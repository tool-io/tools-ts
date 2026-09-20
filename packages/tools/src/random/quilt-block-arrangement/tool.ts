import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateRotate90 } from "../../matrix/rotate-90/tool.js";
import { calculateFlipHorizontal } from "../../matrix/flip-horizontal/tool.js";
import {
  fcArray,
  fcBoolean,
  fcCounts,
  fcCountSchema,
  fcId,
  fcInput,
  fcInteger,
  fcNumber,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type QuiltBlockArrangementInput = FcSeed & {
  readonly rows: number;
  readonly columns: number;
  readonly blocks: readonly {
    readonly id: string;
    readonly matrix: readonly (readonly number[])[];
    readonly quarterTurns: readonly number[];
    readonly allowReflection: boolean;
  }[];
};
export type QuiltBlockArrangementOutput = FcReplay & {
  readonly placements: readonly {
    readonly row: number;
    readonly column: number;
    readonly blockId: string;
    readonly quarterTurns: number;
    readonly reflected: boolean;
    readonly matrix: readonly (readonly number[])[];
  }[];
  readonly repetitionCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
};
const matrixSchema = fcArray(fcArray(fcNumber, 8, 1), 8, 1);
export const inputSchema = fcInput({
  rows: fcInteger(1, 16),
  columns: fcInteger(1, 16),
  blocks: fcArray(
    fcObject({
      id: fcId,
      matrix: matrixSchema,
      quarterTurns: fcArray(fcInteger(0, 3), 4, 1),
      allowReflection: fcBoolean,
    }),
    16,
    1,
  ),
});
export const outputSchema = fcOutput({
  placements: fcArray(
    fcObject({
      row: fcInteger(0, 15),
      column: fcInteger(0, 15),
      blockId: fcId,
      quarterTurns: fcInteger(0, 3),
      reflected: fcBoolean,
      matrix: matrixSchema,
    }),
    256,
    1,
  ),
  repetitionCounts: fcCountSchema,
});
const isInput = (v: unknown): v is QuiltBlockArrangementInput =>
  matchesModelInput(v, inputSchema);
export const calculateQuiltBlockArrangement = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<QuiltBlockArrangementOutput, "randomness"> => {
      fcUnique(
        x.blocks.map((b) => b.id),
        "blocks",
      );
      for (const b of x.blocks) {
        fcUnique(b.quarterTurns, "blocks." + b.id + ".quarterTurns");
        if (b.matrix.some((r) => r.length !== b.matrix[0].length))
          simpleError(
            "blocks",
            "Each supplied block must be rectangular.",
            "invalid_matrix",
          );
      }
      const placements = Array.from({ length: x.rows * x.columns }, (_, i) => {
        const block = fcPick(x.blocks, random),
          quarterTurns = fcPick(block.quarterTurns, random),
          reflected = block.allowReflection && random.unit() < 0.5;
        let matrix: readonly (readonly number[])[] = reflected
          ? calculateFlipHorizontal({ matrix: block.matrix }).flipped
          : block.matrix.map((r) => [...r]);
        for (let turn = 0; turn < quarterTurns; turn++)
          matrix = calculateRotate90({ matrix }).rotated;
        return {
          row: Math.floor(i / x.columns),
          column: i % x.columns,
          blockId: block.id,
          quarterTurns,
          reflected,
          matrix,
        };
      });
      return {
        placements,
        repetitionCounts: fcCounts(
          placements.map((p) => p.blockId),
          x.blocks.map((b) => b.id),
        ),
      };
    },
  );
export const quiltBlockArrangementExample = {
  input: {
    rows: 1,
    columns: 2,
    blocks: [
      {
        id: "arrow",
        matrix: [
          [1, 2],
          [3, 4],
        ],
        quarterTurns: [0, 1],
        allowReflection: true,
      },
      {
        id: "bars",
        matrix: [
          [5, 6],
          [7, 8],
        ],
        quarterTurns: [0, 2],
        allowReflection: false,
      },
    ],
    seed: 42,
  },
  output: {
    placements: [
      {
        row: 0,
        column: 0,
        blockId: "bars",
        quarterTurns: 0,
        reflected: false,
        matrix: [
          [5, 6],
          [7, 8],
        ],
      },
      {
        row: 0,
        column: 1,
        blockId: "bars",
        quarterTurns: 2,
        reflected: false,
        matrix: [
          [8, 7],
          [6, 5],
        ],
      },
    ],
    repetitionCounts: [
      { id: "arrow", count: 0 },
      { id: "bars", count: 2 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  QuiltBlockArrangementInput,
  QuiltBlockArrangementOutput
>;
export const quiltBlockArrangementTool = createModelDefinition<
  QuiltBlockArrangementInput,
  QuiltBlockArrangementOutput
>({
  id: "random/quilt-block-arrangement",
  title: "Random Quilt Block Arrangement Generator",
  description:
    "Arrange supplied quilt blocks with legal clockwise quarter-turns and optional horizontal reflection, returning transformed grids and repetition counts.",
  inputSchema,
  outputSchema,
  execute: calculateQuiltBlockArrangement,
});
export const runQuiltBlockArrangement = quiltBlockArrangementTool.execute;
export default quiltBlockArrangementTool;
