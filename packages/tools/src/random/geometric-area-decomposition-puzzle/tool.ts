import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import { calculateRectangleArea } from "../../geometry/rectangle-area/tool.js";
import { calculatePolygonArea } from "../../geometry/polygon-area/tool.js";

export type GeometricAreaDecompositionPuzzleInput = {
  readonly rectangles: readonly {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  }[];
  readonly translationMaximum: number;
  readonly seed?: number;
};
export type GeometricAreaDecompositionPuzzleOutput = {
  readonly pieces: readonly {
    readonly x: number;
    readonly y: number;
    readonly width: number | null;
    readonly height: number;
    readonly area: number;
  }[];
  readonly hiddenIndex: number;
  readonly hiddenWidth: number;
  readonly totalArea: number;
  readonly translation: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    rectangles: array(
      object({
        x: integer,
        y: integer,
        width: { type: "integer", minimum: 1 },
        height: { type: "integer", minimum: 1 },
      }),
      16,
      1,
    ),
    translationMaximum: { type: "integer", minimum: 0, maximum: 1000000 },
    seed: generatorSeedSchema,
  },
  ["rectangles", "translationMaximum"],
);
export const outputSchema = object({
  pieces: array(
    object({
      x: integer,
      y: integer,
      width: { anyOf: [integer, { type: "null" }] },
      height: integer,
      area: integer,
    }),
    16,
    1,
  ),
  hiddenIndex: integer,
  hiddenWidth: integer,
  totalArea: integer,
  translation: array(integer, 2, 2),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is GeometricAreaDecompositionPuzzleInput =>
  matchesModelInput(value, inputSchema);
export const calculateGeometricAreaDecompositionPuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GeometricAreaDecompositionPuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    for (const r of input.rectangles) {
      safe(r.x + r.width, "rectangles");
      safe(r.y + r.height, "rectangles");
      const exact = BigInt(r.width) * BigInt(r.height);
      if (exact > BigInt(Number.MAX_SAFE_INTEGER))
        simpleError(
          "rectangles",
          "Rectangle area exceeds exact safe integer range.",
          "unsafe_arithmetic",
        );
    }
    for (let i = 0; i < input.rectangles.length; i++)
      for (let j = i + 1; j < input.rectangles.length; j++) {
        const a = input.rectangles[i],
          b = input.rectangles[j];
        if (
          a.x < b.x + b.width &&
          b.x < a.x + a.width &&
          a.y < b.y + b.height &&
          b.y < a.y + a.height
        )
          simpleError(
            "rectangles",
            "Rectangle interiors must not overlap.",
            "overlapping_pieces",
          );
      }
    const dx = random.integer(0, input.translationMaximum),
      dy = random.integer(0, input.translationMaximum),
      hiddenIndex = random.integer(0, input.rectangles.length - 1),
      areas = input.rectangles.map((r) => {
        const area = calculateRectangleArea(r).area,
          polygon = calculatePolygonArea({
            xs: [0, r.width, r.width, 0],
            ys: [0, 0, r.height, r.height],
          }).area;
        if (area !== polygon)
          throw new Error("Rectangle/polygon area mismatch");
        return safe(area, "rectangles");
      });
    const totalArea = safe(sum(areas), "rectangles"),
      pieces = input.rectangles.map((r, i) => ({
        x: safe(r.x + dx, "translationMaximum"),
        y: safe(r.y + dy, "translationMaximum"),
        width: i === hiddenIndex ? null : r.width,
        height: r.height,
        area: areas[i],
      }));
    const result = {
      pieces,
      hiddenIndex,
      hiddenWidth: input.rectangles[hiddenIndex].width,
      totalArea,
      translation: [dx, dy],
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const geometricAreaDecompositionPuzzleExample = {
  input: {
    rectangles: [
      { x: 0, y: 0, width: 2, height: 3 },
      { x: 2, y: 0, width: 1, height: 3 },
    ],
    translationMaximum: 2,
    seed: 42,
  },
  output: {
    pieces: [
      { x: 1, y: 1, width: 2, height: 3, area: 6 },
      { x: 3, y: 1, width: null, height: 3, area: 3 },
    ],
    hiddenIndex: 1,
    hiddenWidth: 1,
    totalArea: 9,
    translation: [1, 1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GeometricAreaDecompositionPuzzleInput,
  GeometricAreaDecompositionPuzzleOutput
>;
export const geometricAreaDecompositionPuzzleTool = createModelDefinition<
  GeometricAreaDecompositionPuzzleInput,
  GeometricAreaDecompositionPuzzleOutput
>({
  id: "random/geometric-area-decomposition-puzzle",
  title: "Random Geometric Area Decomposition Puzzle Generator",
  description:
    "Translate nonoverlapping supplied rectangles, hide one width and retain exact reconciled decomposition areas; touching boundaries are permitted.",
  inputSchema,
  outputSchema,
  execute: calculateGeometricAreaDecompositionPuzzle,
});
export const runGeometricAreaDecompositionPuzzle =
  geometricAreaDecompositionPuzzleTool.execute;
export default geometricAreaDecompositionPuzzleTool;
