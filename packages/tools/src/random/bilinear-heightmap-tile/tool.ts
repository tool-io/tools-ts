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
import { calculateBilinearInterpolation } from "../../interpolation/bilinear/tool.js";
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
  realDraw,
  finite,
} from "../m250-algorithms-common.js";

export type HeightmapSharedEdges = {
  readonly bottom?: readonly number[];
  readonly top?: readonly number[];
  readonly left?: readonly number[];
  readonly right?: readonly number[];
};
export type BilinearHeightmapTileInput = {
  readonly rows: number;
  readonly columns: number;
  readonly minimumHeight: number;
  readonly maximumHeight: number;
  readonly sharedEdges?: HeightmapSharedEdges;
  readonly seed?: number;
};
export type BilinearHeightmapTileOutput = {
  readonly corners: readonly (readonly number[])[];
  readonly xs: readonly number[];
  readonly ys: readonly number[];
  readonly values: readonly (readonly number[])[];
  readonly coreValues: readonly (readonly number[])[];
  readonly convention: string;
  readonly randomness: GeneratorReplay;
};
const edgeSchema = arraySchema(numberSchema, 2, 2),
  matrixSchema = arraySchema(arraySchema(numberSchema, 33, 2), 33, 2);
export const inputSchema = objectSchema(
  {
    rows: integerSchema(2, 33),
    columns: integerSchema(2, 33),
    minimumHeight: numberSchema,
    maximumHeight: numberSchema,
    sharedEdges: objectSchema(
      {
        bottom: edgeSchema,
        top: edgeSchema,
        left: edgeSchema,
        right: edgeSchema,
      },
      [],
    ),
    seed: generatorSeedSchema,
  },
  ["rows", "columns", "minimumHeight", "maximumHeight"],
);
export const outputSchema = objectSchema({
  corners: arraySchema(edgeSchema, 2, 2),
  xs: arraySchema(numberSchema, 33, 2),
  ys: arraySchema(numberSchema, 33, 2),
  values: matrixSchema,
  coreValues: matrixSchema,
  convention: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is BilinearHeightmapTileInput =>
  matchesModelInput(input, inputSchema);
export const calculateBilinearHeightmapTile = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BilinearHeightmapTileOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.rows * input.columns > 1024)
      simpleError("rows", "Retain at most 1,024 grid cells.", "resource_limit");
    if (input.minimumHeight > input.maximumHeight)
      simpleError(
        "maximumHeight",
        "Height bounds must be ordered.",
        "invalid_range",
      );
    const assigned = new Map<number, number>();
    const assign = (corner: number, value: number, field: string): void => {
      if (assigned.has(corner) && assigned.get(corner) !== value)
        simpleError(
          field,
          "Shared edges must agree at each common corner.",
          "inconsistent_shared_corner",
        );
      assigned.set(corner, value);
    };
    for (const [name, indices] of [
      ["bottom", [0, 1]],
      ["top", [2, 3]],
      ["left", [0, 2]],
      ["right", [1, 3]],
    ] as const) {
      const edge = input.sharedEdges?.[name];
      if (edge) {
        assign(indices[0], edge[0], `sharedEdges.${name}`);
        assign(indices[1], edge[1], `sharedEdges.${name}`);
      }
    }
    const random = createGeneratorRandom(input.seed, context);
    // Four draws always advance the source, including constrained corners.
    const heights = Array.from({ length: 4 }, (_, i) => {
      const drawn = realDraw(
        input.minimumHeight,
        input.maximumHeight,
        random,
        "maximumHeight",
      );
      return assigned.get(i) ?? drawn;
    });
    const corners = [
        [heights[0], heights[1]],
        [heights[2], heights[3]],
      ],
      xs = Array.from(
        { length: input.columns },
        (_, i) => i / (input.columns - 1),
      ),
      ys = Array.from({ length: input.rows }, (_, i) => i / (input.rows - 1));
    const values: number[][] = [],
      coreValues: number[][] = [];
    for (const y of ys) {
      const row: number[] = [],
        coreRow: number[] = [];
      for (const x of xs) {
        const bottom = (1 - x) * heights[0] + x * heights[1],
          top = (1 - x) * heights[2] + x * heights[3];
        row.push(finite((1 - y) * bottom + y * top, "maximumHeight"));
        coreRow.push(
          finite(
            calculateBilinearInterpolation({
              pointX: x,
              pointY: y,
              values: corners,
            }).value,
            "maximumHeight",
          ),
        );
      }
      values.push(row);
      coreValues.push(coreRow);
    }
    return toolSuccess({
      corners,
      xs,
      ys,
      values,
      coreValues,
      convention:
        "Rows increase from y=0 to y=1; columns from x=0 to x=1. Shared edges are linear corner pairs in those directions and may lie outside the random range. coreValues inherit 12-significant-digit rounding; values are unrounded.",
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bilinearHeightmapTileExample = {
  input: {
    rows: 3,
    columns: 3,
    minimumHeight: -2,
    maximumHeight: 10,
    sharedEdges: { bottom: [0, 4], top: [8, 12] },
    seed: 42,
  },
  output: {
    corners: [
      [0, 4],
      [8, 12],
    ],
    xs: [0, 0.5, 1],
    ys: [0, 0.5, 1],
    values: [
      [0, 2, 4],
      [4, 6, 8],
      [8, 10, 12],
    ],
    coreValues: [
      [0, 2, 4],
      [4, 6, 8],
      [8, 10, 12],
    ],
    convention:
      "Rows increase from y=0 to y=1; columns from x=0 to x=1. Shared edges are linear corner pairs in those directions and may lie outside the random range. coreValues inherit 12-significant-digit rounding; values are unrounded.",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BilinearHeightmapTileInput,
  BilinearHeightmapTileOutput
>;
export const bilinearHeightmapTileTool = createModelDefinition<
  BilinearHeightmapTileInput,
  BilinearHeightmapTileOutput
>({
  id: "random/bilinear-heightmap-tile",
  title: "Random Bilinear Heightmap Tile Generator",
  description:
    "Draw corner heights with optional consistent shared linear edges and delegate a bounded bilinear grid, returning both unrounded and inherited core values.",
  inputSchema,
  outputSchema,
  execute: calculateBilinearHeightmapTile,
});
export const runBilinearHeightmapTile = bilinearHeightmapTileTool.execute;
export default bilinearHeightmapTileTool;
