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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { paletteHexSchema, drawPaletteColor } from "../palette-construction.js";

export type GeometricColorPatternInput = {
  readonly columns: number;
  readonly rows: number;
  readonly colorCount: number;
  readonly seed?: number;
};
export type GeometricColorPatternOutput = {
  readonly colors: readonly string[];
  readonly shapes: readonly {
    readonly kind: string;
    readonly quarterTurns: number;
    readonly colorIndex: number;
    readonly points: readonly (readonly [number, number])[];
  }[];
  readonly svg: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    columns: { type: "integer", minimum: 1, maximum: 16 },
    rows: { type: "integer", minimum: 1, maximum: 16 },
    colorCount: { type: "integer", minimum: 2, maximum: 8 },
    seed: generatorSeedSchema,
  },
  required: ["columns", "rows", "colorCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colors: {
      type: "array",
      minItems: 2,
      maxItems: 8,
      items: paletteHexSchema,
    },
    shapes: {
      type: "array",
      minItems: 1,
      maxItems: 256,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          kind: { type: "string", enum: ["triangle", "diamond", "square"] },
          quarterTurns: { type: "integer", minimum: 0, maximum: 3 },
          colorIndex: { type: "integer", minimum: 0, maximum: 7 },
          points: {
            type: "array",
            minItems: 3,
            maxItems: 4,
            items: {
              type: "array",
              minItems: 2,
              maxItems: 2,
              items: { type: "number", minimum: 0, maximum: 16 },
            },
          },
        },
        required: ["kind", "quarterTurns", "colorIndex", "points"],
      },
    },
    svg: { type: "string", minLength: 1, maxLength: 65536 },
    randomness: generatorReplaySchema,
  },
  required: ["colors", "shapes", "svg", "randomness"],
} as const;

const isInput = (input: unknown): input is GeometricColorPatternInput =>
  matchesModelInput(input, inputSchema);
export const calculateGeometricColorPattern = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GeometricColorPatternOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      colors = Array.from({ length: input.colorCount }, () =>
        drawPaletteColor(random),
      );
    const templates: readonly (readonly (readonly [number, number])[])[] = [
      [
        [-0.5, -0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
      ],
      [
        [0, -0.5],
        [0.5, 0],
        [0, 0.5],
        [-0.5, 0],
      ],
      [
        [-0.5, -0.5],
        [0.5, -0.5],
        [0.5, 0.5],
        [-0.5, 0.5],
      ],
    ];
    const kinds = ["triangle", "diamond", "square"];
    const shapes = Array.from(
      { length: input.rows * input.columns },
      (_, index) => {
        const kind = random.integer(0, 2),
          quarterTurns = random.integer(0, 3),
          colorIndex = random.integer(0, input.colorCount - 1);
        const points = templates[kind].map(
          ([initialX, initialY]): [number, number] => {
            let x = initialX,
              y = initialY;
            for (let turn = 0; turn < quarterTurns; turn += 1) [x, y] = [-y, x];
            return [
              x + (index % input.columns) + 0.5,
              y + Math.floor(index / input.columns) + 0.5,
            ];
          },
        );
        return { kind: kinds[kind], quarterTurns, colorIndex, points };
      },
    );
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      input.columns +
      " " +
      input.rows +
      '">' +
      shapes
        .map(
          (shape) =>
            '<polygon points="' +
            shape.points.map((point) => point.join(",")).join(" ") +
            '" fill="' +
            colors[shape.colorIndex] +
            '"/>',
        )
        .join("") +
      "</svg>";
    return toolSuccess({
      colors,
      shapes,
      svg,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const geometricColorPatternExample = {
  input: {
    columns: 2,
    rows: 2,
    colorCount: 3,
    seed: 42,
  },
  output: {
    colors: ["#99E1EF", "#72C32B", "#DA3B32"],
    shapes: [
      {
        kind: "square",
        quarterTurns: 0,
        colorIndex: 1,
        points: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      },
      {
        kind: "triangle",
        quarterTurns: 2,
        colorIndex: 2,
        points: [
          [2, 1],
          [1, 1],
          [2, 0],
        ],
      },
      {
        kind: "diamond",
        quarterTurns: 0,
        colorIndex: 2,
        points: [
          [0.5, 1],
          [1, 1.5],
          [0.5, 2],
          [0, 1.5],
        ],
      },
      {
        kind: "square",
        quarterTurns: 1,
        colorIndex: 0,
        points: [
          [2, 1],
          [2, 2],
          [1, 2],
          [1, 1],
        ],
      },
    ],
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><polygon points="0,0 1,0 1,1 0,1" fill="#72C32B"/><polygon points="2,1 1,1 2,0" fill="#DA3B32"/><polygon points="0.5,1 1,1.5 0.5,2 0,1.5" fill="#DA3B32"/><polygon points="2,1 2,2 1,2 1,1" fill="#99E1EF"/></svg>',
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  GeometricColorPatternInput,
  GeometricColorPatternOutput
>;
export const geometricColorPatternTool = createModelDefinition<
  GeometricColorPatternInput,
  GeometricColorPatternOutput
>({
  id: "random/geometric-color-pattern",
  title: "Random Geometric Color Pattern Generator",
  description:
    "Generate one quarter-turn triangle, diamond or square in every bounded grid cell using reusable random hex palette slots, with explicit polygon vertices and portable SVG; palette slots may repeat and blank triangle/diamond corners stay transparent.",
  inputSchema,
  outputSchema,
  execute: calculateGeometricColorPattern,
});
export const runGeometricColorPattern = geometricColorPatternTool.execute;
export default geometricColorPatternTool;
