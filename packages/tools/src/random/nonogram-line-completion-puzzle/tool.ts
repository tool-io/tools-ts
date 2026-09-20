import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  calculate as checkLength,
  type Output as LengthEvidence,
} from "../../game/nonogram-clue-sum-plus-gaps-length-checker/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSampleIndices,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  puzzleArray,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";

export type NonogramLineCompletionPuzzleInput = {
  readonly length: number;
  readonly hiddenCount: number;
  readonly seed?: number;
};
export type NonogramLineCompletionPuzzleOutput = {
  readonly puzzle: {
    readonly clues: readonly number[];
    readonly cells: readonly (number | null)[];
  };
  readonly answer: {
    readonly solution: readonly number[];
    readonly completionCount: number;
    readonly unique: boolean;
    readonly forcedCells: readonly (number | null)[];
  };
  readonly feasibility: LengthEvidence;
  readonly randomness: GeneratorReplay;
};
const bit = { type: "integer", minimum: 0, maximum: 1 } as const;
const cells = puzzleArray({ anyOf: [bit, { type: "null" }] }, 16);
export const inputSchema = puzzleObject(
  {
    length: { type: "integer", minimum: 1, maximum: 16 },
    hiddenCount: { type: "integer", minimum: 0, maximum: 16 },
    seed: generatorSeedSchema,
  },
  ["length", "hiddenCount"],
);
export const outputSchema = puzzleObject({
  puzzle: puzzleObject({ clues: puzzleArray(puzzleInteger, 16), cells }),
  answer: puzzleObject({
    solution: puzzleArray(bit, 16),
    completionCount: puzzleInteger,
    unique: { type: "boolean" },
    forcedCells: cells,
  }),
  feasibility: puzzleObject({
    minimumRequiredLineCells: puzzleInteger,
    signedRemainingSlackCells: puzzleInteger,
    lineLengthFeasible: { type: "boolean" },
  }),
  randomness: generatorReplaySchema,
});
const runs = (line: readonly number[]): number[] => {
  const result: number[] = [];
  let run = 0;
  for (const cell of [...line, 0]) {
    if (cell === 1) run += 1;
    else if (run) {
      result.push(run);
      run = 0;
    }
  }
  return result;
};
export const calculateNonogramLineCompletionPuzzle = (
  input: NonogramLineCompletionPuzzleInput,
  context?: ToolExecutionContext,
): ToolResult<NonogramLineCompletionPuzzleOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    if (input.hiddenCount > input.length)
      simpleError(
        "hiddenCount",
        "Hidden cells cannot exceed line length.",
        "infeasible_hidden_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      solution = Array.from({ length: input.length }, () =>
        random.integer(0, 1),
      ),
      clues = runs(solution);
    const hidden = new Set(
        generatorSampleIndices(input.length, input.hiddenCount, random),
      ),
      observed = solution.map((v, i) => (hidden.has(i) ? null : v));
    const feasibility = checkLength({
      runLengths: clues,
      availableLineCells: input.length,
      fixedLeadingEmptyCells: 0,
      fixedTrailingEmptyCells: 0,
    });
    let completionCount = 0;
    let forcedCells: (number | null)[] = [];
    for (let mask = 0; mask < 2 ** input.length; mask += 1) {
      const candidate = Array.from(
        { length: input.length },
        (_, i) => Math.floor(mask / 2 ** i) % 2,
      );
      if (observed.some((v, i) => v !== null && v !== candidate[i])) continue;
      const candidateRuns = runs(candidate);
      if (
        candidateRuns.length !== clues.length ||
        candidateRuns.some((v, i) => v !== clues[i])
      )
        continue;
      if (!completionCount) forcedCells = [...candidate];
      else
        forcedCells = forcedCells.map((v, i) =>
          v === candidate[i] ? v : null,
        );
      completionCount += 1;
    }
    if (!feasibility.lineLengthFeasible || completionCount === 0)
      throw new Error("Constructed Nonogram solution was lost.");
    return toolSuccess({
      puzzle: { clues, cells: observed },
      answer: {
        solution,
        completionCount,
        unique: completionCount === 1,
        forcedCells,
      },
      feasibility,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const nonogramLineCompletionPuzzleExample = puzzleFreeze({
  input: { length: 6, hiddenCount: 2, seed: 42 },
  output: {
    puzzle: { clues: [1, 2, 1], cells: [1, null, 1, null, 0, 1] },
    answer: {
      solution: [1, 0, 1, 1, 0, 1],
      completionCount: 1,
      unique: true,
      forcedCells: [1, 0, 1, 1, 0, 1],
    },
    feasibility: {
      minimumRequiredLineCells: 6,
      signedRemainingSlackCells: 0,
      lineLengthFeasible: true,
    },
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  NonogramLineCompletionPuzzleInput,
  NonogramLineCompletionPuzzleOutput
>);
const isInput = (input: unknown): input is NonogramLineCompletionPuzzleInput =>
  matchesModelInput(input, inputSchema);
export const nonogramLineCompletionPuzzleTool = createModelDefinition<
  NonogramLineCompletionPuzzleInput,
  NonogramLineCompletionPuzzleOutput
>({
  id: "random/nonogram-line-completion-puzzle",
  title: "Random Nonogram Line Completion Puzzle Generator",
  description:
    "Generate a binary Nonogram line with hidden cells and exact bounded completion counts and forced-cell answers.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateNonogramLineCompletionPuzzle,
  ),
});
export const runNonogramLineCompletionPuzzle =
  nonogramLineCompletionPuzzleTool.execute;
export default nonogramLineCompletionPuzzleTool;
