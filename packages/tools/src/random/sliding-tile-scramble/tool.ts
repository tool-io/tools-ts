import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateReshape } from "../../matrix/reshape/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  puzzleArray,
  puzzleDistinct,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type SlidingDirection = "up" | "down" | "left" | "right";
export type SlidingTileScrambleInput = {
  readonly solvedBoard: readonly (readonly number[])[];
  readonly moveCount: number;
  readonly seed?: number;
};
export type SlidingTileScrambleOutput = {
  readonly initialBoard: readonly (readonly number[])[];
  readonly moves: readonly {
    readonly direction: SlidingDirection;
    readonly tile: number;
    readonly blankFrom: number;
    readonly blankTo: number;
    readonly board: readonly (readonly number[])[];
  }[];
  readonly finalBoard: readonly (readonly number[])[];
  readonly inverseMoves: readonly SlidingDirection[];
  readonly randomness: GeneratorReplay;
};
const boardSchema = puzzleArray(
    puzzleArray({ type: "integer", minimum: 0 }, 8, 2),
    8,
    2,
  ),
  directionSchema = {
    type: "string",
    enum: ["up", "down", "left", "right"],
  } as const;
export const inputSchema = puzzleObject(
  {
    solvedBoard: boardSchema,
    moveCount: { type: "integer", minimum: 0, maximum: 128 },
    seed: generatorSeedSchema,
  },
  ["solvedBoard", "moveCount"],
);
export const outputSchema = puzzleObject({
  initialBoard: boardSchema,
  moves: puzzleArray(
    puzzleObject({
      direction: directionSchema,
      tile: puzzleInteger,
      blankFrom: puzzleInteger,
      blankTo: puzzleInteger,
      board: boardSchema,
    }),
    128,
  ),
  finalBoard: boardSchema,
  inverseMoves: puzzleArray(directionSchema, 128),
  randomness: generatorReplaySchema,
});
const inverse: Readonly<Record<SlidingDirection, SlidingDirection>> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};
export const calculateSlidingTileScramble = (
  input: SlidingTileScrambleInput,
  context?: ToolExecutionContext,
): ToolResult<SlidingTileScrambleOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    const rows = input.solvedBoard.length,
      columns = input.solvedBoard[0].length,
      flat = input.solvedBoard.flat();
    if (input.solvedBoard.some((row) => row.length !== columns))
      simpleError(
        "solvedBoard",
        "The solved board must be rectangular.",
        "invalid_board_shape",
      );
    puzzleDistinct(flat, "solvedBoard");
    if (!flat.includes(0))
      simpleError(
        "solvedBoard",
        "The solved board requires exactly one zero blank.",
        "missing_blank",
      );
    const random = createGeneratorRandom(input.seed, context),
      snapshot = (): readonly (readonly number[])[] =>
        calculateReshape({ matrix: [flat], rows, columns }).reshaped,
      initialBoard = snapshot();
    let blank = flat.indexOf(0);
    const moves = Array.from(
      { length: input.moveCount },
      (): SlidingTileScrambleOutput["moves"][number] => {
        const row = Math.floor(blank / columns),
          column = blank % columns,
          options: { direction: SlidingDirection; to: number }[] = [];
        if (row > 0) options.push({ direction: "up", to: blank - columns });
        if (row + 1 < rows)
          options.push({ direction: "down", to: blank + columns });
        if (column > 0) options.push({ direction: "left", to: blank - 1 });
        if (column + 1 < columns)
          options.push({ direction: "right", to: blank + 1 });
        const selected = random.pick(options),
          blankFrom = blank,
          tile = flat[selected.to];
        flat[blank] = tile;
        flat[selected.to] = 0;
        blank = selected.to;
        return {
          direction: selected.direction,
          tile,
          blankFrom,
          blankTo: blank,
          board: snapshot(),
        };
      },
    );
    return toolSuccess({
      initialBoard,
      moves,
      finalBoard: snapshot(),
      inverseMoves: [...moves].reverse().map((move) => inverse[move.direction]),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const slidingTileScrambleExample = puzzleFreeze({
  input: {
    solvedBoard: [
      [1, 2],
      [3, 0],
    ],
    moveCount: 3,
    seed: 42,
  },
  output: {
    initialBoard: [
      [1, 2],
      [3, 0],
    ],
    moves: [
      {
        direction: "left",
        tile: 3,
        blankFrom: 3,
        blankTo: 2,
        board: [
          [1, 2],
          [0, 3],
        ],
      },
      {
        direction: "up",
        tile: 1,
        blankFrom: 2,
        blankTo: 0,
        board: [
          [0, 2],
          [1, 3],
        ],
      },
      {
        direction: "right",
        tile: 2,
        blankFrom: 0,
        blankTo: 1,
        board: [
          [2, 0],
          [1, 3],
        ],
      },
    ],
    finalBoard: [
      [2, 0],
      [1, 3],
    ],
    inverseMoves: ["left", "down", "right"],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  SlidingTileScrambleInput,
  SlidingTileScrambleOutput
>);
const isInput = (input: unknown): input is SlidingTileScrambleInput =>
  matchesModelInput(input, inputSchema);
export const slidingTileScrambleTool = createModelDefinition<
  SlidingTileScrambleInput,
  SlidingTileScrambleOutput
>({
  id: "random/sliding-tile-scramble",
  title: "Random Sliding Tile Scramble Generator",
  description:
    "Scramble a caller-selected solved grid by legal blank moves with complete replay and inverse moves, preserving reachability without a minimum-distance guarantee.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(isInput, inputSchema, calculateSlidingTileScramble),
});
export const runSlidingTileScramble = slidingTileScrambleTool.execute;
export default slidingTileScrambleTool;
