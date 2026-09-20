import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculatePointInPolygon } from "../../geometry/point-in-polygon/tool.js";
import { calculatePolygonArea } from "../../geometry/polygon-area/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  integerSchema,
  numberSchema,
  nullable,
  safeRange,
  finite,
} from "../m250-algorithms-common.js";

export type PointInPolygonClassificationQuizInput = {
  readonly count: number;
  readonly shape: "rectangle" | "l-shape" | "mixed";
  readonly originMinimum: number;
  readonly originMaximum: number;
  readonly minimumExtent: number;
  readonly maximumExtent: number;
  readonly seed?: number;
};
export type PolygonQuizCase = {
  readonly shape: "rectangle" | "l-shape";
  readonly parameters: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly cutX: number | null;
    readonly cutY: number | null;
  };
  readonly xs: readonly number[];
  readonly ys: readonly number[];
  readonly area: number;
  readonly points: readonly {
    readonly x: number;
    readonly y: number;
    readonly intended: "interior" | "exterior" | "boundary";
    readonly inside: boolean;
    readonly onBoundary: boolean;
  }[];
};
export type PointInPolygonClassificationQuizOutput = {
  readonly cases: readonly PolygonQuizCase[];
  readonly boundaryConvention: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    count: integerSchema(1, 16),
    shape: { type: "string", enum: ["rectangle", "l-shape", "mixed"] },
    originMinimum: { type: "integer" },
    originMaximum: { type: "integer" },
    minimumExtent: integerSchema(4),
    maximumExtent: integerSchema(4),
    seed: generatorSeedSchema,
  },
  [
    "count",
    "shape",
    "originMinimum",
    "originMaximum",
    "minimumExtent",
    "maximumExtent",
  ],
);
export const outputSchema = objectSchema({
  cases: arraySchema(
    objectSchema({
      shape: { type: "string", enum: ["rectangle", "l-shape"] },
      parameters: objectSchema({
        x: { type: "integer" },
        y: { type: "integer" },
        width: integerSchema(4),
        height: integerSchema(4),
        cutX: nullable(integerSchema(2)),
        cutY: nullable(integerSchema(2)),
      }),
      xs: arraySchema(numberSchema, 6, 4),
      ys: arraySchema(numberSchema, 6, 4),
      area: { type: "number", exclusiveMinimum: 0 },
      points: arraySchema(
        objectSchema({
          x: numberSchema,
          y: numberSchema,
          intended: {
            type: "string",
            enum: ["interior", "exterior", "boundary"],
          },
          inside: { type: "boolean" },
          onBoundary: { type: "boolean" },
        }),
        6,
        6,
      ),
    }),
    16,
    1,
  ),
  boundaryConvention: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is PointInPolygonClassificationQuizInput =>
  matchesModelInput(input, inputSchema);
export const calculatePointInPolygonClassificationQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PointInPolygonClassificationQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    safeRange(input.originMinimum, input.originMaximum, "originMaximum");
    safeRange(input.minimumExtent, input.maximumExtent, "maximumExtent");
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, (): PolygonQuizCase => {
      const shape =
        input.shape === "mixed"
          ? random.pick(["rectangle", "l-shape"] as const)
          : input.shape;
      const x = random.integer(input.originMinimum, input.originMaximum),
        y = random.integer(input.originMinimum, input.originMaximum),
        width = random.integer(input.minimumExtent, input.maximumExtent),
        height = random.integer(input.minimumExtent, input.maximumExtent);
      if (![x + width + 1, y + height + 1].every(Number.isSafeInteger))
        simpleError(
          "maximumExtent",
          "Translated polygon and exterior probes must retain safe integer coordinates.",
          "coordinate_overflow",
        );
      const cutX = shape === "l-shape" ? random.integer(2, width - 2) : null,
        cutY = shape === "l-shape" ? random.integer(2, height - 2) : null;
      const xs =
        cutX === null
          ? [x, x + width, x + width, x]
          : [x, x + width, x + width, x + cutX, x + cutX, x];
      const ys =
        cutY === null
          ? [y, y, y + height, y + height]
          : [y, y, y + cutY, y + cutY, y + height, y + height];
      const probes: {
        x: number;
        y: number;
        intended: "interior" | "exterior" | "boundary";
      }[] = [
        { x: x + 1, y: y + 1, intended: "interior" },
        { x: x + 1, y: y + height - 1, intended: "interior" },
        { x: x + width + 1, y: y + height + 1, intended: "exterior" },
        { x: x + Math.floor(width / 2), y, intended: "boundary" },
        { x, y, intended: "boundary" },
        cutX !== null && cutY !== null
          ? { x: x + cutX + 1, y: y + cutY + 1, intended: "exterior" }
          : { x: x + width - 1, y: y + height - 1, intended: "interior" },
      ];
      const points = probes.map((point) => {
        const core = calculatePointInPolygon({
          xs,
          ys,
          x: point.x,
          y: point.y,
        });
        if (
          core.inside !== (point.intended !== "exterior") ||
          core.onBoundary !== (point.intended === "boundary")
        )
          simpleError(
            "originMaximum",
            "Coordinate precision cannot preserve the intended polygon probe classifications.",
            "coordinate_precision_loss",
          );
        return { ...point, ...core };
      });
      const area = finite(
        calculatePolygonArea({ xs, ys }).area,
        "maximumExtent",
      );
      const expectedArea =
        width * height -
        (cutX !== null && cutY !== null ? (width - cutX) * (height - cutY) : 0);
      if (
        area <= 0 ||
        Math.abs(area - expectedArea) >
          64 * Number.EPSILON * Math.max(1, expectedArea)
      )
        simpleError(
          "originMaximum",
          "Coordinate precision cannot preserve the polygon area.",
          "coordinate_precision_loss",
        );
      return {
        shape,
        parameters: { x, y, width, height, cutX, cutY },
        xs,
        ys,
        area,
        points,
      };
    });
    return toolSuccess({
      cases,
      boundaryConvention:
        "Boundary points count as inside; exact collinearity and segment bounds identify edges and vertices.",
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const pointInPolygonClassificationQuizExample = {
  input: {
    count: 1,
    shape: "mixed",
    originMinimum: -2,
    originMaximum: 2,
    minimumExtent: 4,
    maximumExtent: 6,
    seed: 42,
  },
  output: {
    cases: [
      {
        shape: "l-shape",
        parameters: { x: 0, y: 2, width: 6, height: 4, cutX: 3, cutY: 2 },
        xs: [0, 6, 6, 3, 3, 0],
        ys: [2, 2, 4, 4, 6, 6],
        area: 18,
        points: [
          { x: 1, y: 3, intended: "interior", inside: true, onBoundary: false },
          { x: 1, y: 5, intended: "interior", inside: true, onBoundary: false },
          {
            x: 7,
            y: 7,
            intended: "exterior",
            inside: false,
            onBoundary: false,
          },
          { x: 3, y: 2, intended: "boundary", inside: true, onBoundary: true },
          { x: 0, y: 2, intended: "boundary", inside: true, onBoundary: true },
          {
            x: 4,
            y: 5,
            intended: "exterior",
            inside: false,
            onBoundary: false,
          },
        ],
      },
    ],
    boundaryConvention:
      "Boundary points count as inside; exact collinearity and segment bounds identify edges and vertices.",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PointInPolygonClassificationQuizInput,
  PointInPolygonClassificationQuizOutput
>;
export const pointInPolygonClassificationQuizTool = createModelDefinition<
  PointInPolygonClassificationQuizInput,
  PointInPolygonClassificationQuizOutput
>({
  id: "random/point-in-polygon-classification-quiz",
  title: "Random Point in Polygon Classification Quiz Generator",
  description:
    "Construct simple integer rectangles or concave L polygons with interior, exterior, edge and vertex probes, delegating area and boundary-inclusive classification.",
  inputSchema,
  outputSchema,
  execute: calculatePointInPolygonClassificationQuiz,
});
export const runPointInPolygonClassificationQuiz =
  pointInPolygonClassificationQuizTool.execute;
export default pointInPolygonClassificationQuizTool;
