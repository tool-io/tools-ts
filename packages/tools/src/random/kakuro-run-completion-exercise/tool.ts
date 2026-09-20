import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculate as checkRun } from "../../game/kakuro-row-sum-distinct-digits-checker/tool.js";
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
export type KakuroRunCompletionExerciseInput = {
  readonly length: number;
  readonly hiddenCount: number;
  readonly seed?: number;
};
export type KakuroRunCompletionExerciseOutput = {
  readonly puzzle: {
    readonly targetSum: number;
    readonly cells: readonly number[];
  };
  readonly answer: {
    readonly solution: readonly number[];
    readonly remainingDigitSets: readonly (readonly number[])[];
    readonly unorderedSetCount: number;
    readonly orderedCompletionCount: number;
  };
  readonly randomness: GeneratorReplay;
};
const digits = puzzleArray({ type: "integer", minimum: 0, maximum: 9 }, 9);
export const inputSchema = puzzleObject(
  {
    length: { type: "integer", minimum: 1, maximum: 9 },
    hiddenCount: { type: "integer", minimum: 0, maximum: 9 },
    seed: generatorSeedSchema,
  },
  ["length", "hiddenCount"],
);
export const outputSchema = puzzleObject({
  puzzle: puzzleObject({ targetSum: puzzleInteger, cells: digits }),
  answer: puzzleObject({
    solution: digits,
    remainingDigitSets: puzzleArray(digits, 512),
    unorderedSetCount: puzzleInteger,
    orderedCompletionCount: puzzleInteger,
  }),
  randomness: generatorReplaySchema,
});
export const calculateKakuroRunCompletionExercise = (
  input: KakuroRunCompletionExerciseInput,
  context?: ToolExecutionContext,
): ToolResult<KakuroRunCompletionExerciseOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    if (input.hiddenCount > input.length)
      simpleError(
        "hiddenCount",
        "Hidden cells cannot exceed run length.",
        "infeasible_hidden_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      solution = generatorSampleIndices(9, input.length, random).map(
        (i) => i + 1,
      ),
      hidden = new Set(
        generatorSampleIndices(input.length, input.hiddenCount, random),
      ),
      cells = solution.map((v, i) => (hidden.has(i) ? 0 : v)),
      targetSum = solution.reduce((s, v) => s + v, 0);
    const core = checkRun({ observedDigitsWithZeroUnknown: cells, targetSum }),
      available = Array.from({ length: 9 }, (_, i) => i + 1).filter(
        (v) => !cells.includes(v),
      ),
      remainingDigitSets: number[][] = [];
    for (let mask = 0; mask < 2 ** available.length; mask += 1) {
      const values = available.filter(
        (_, i) => Math.floor(mask / 2 ** i) % 2 === 1,
      );
      if (
        values.length === input.hiddenCount &&
        values.reduce((s, v) => s + v, core.observedKnownSum) === targetSum
      )
        remainingDigitSets.push(values);
    }
    remainingDigitSets.sort((a, b) => {
      for (let i = 0; i < a.length; i += 1)
        if (a[i] !== b[i]) return a[i] - b[i];
      return 0;
    });
    if (core.unorderedRemainingDigitSetsCount !== remainingDigitSets.length)
      throw new Error("Kakuro completion enumeration disagrees with the core.");
    let permutations = 1;
    for (let i = 2; i <= input.hiddenCount; i += 1) permutations *= i;
    return toolSuccess({
      puzzle: { targetSum, cells },
      answer: {
        solution,
        remainingDigitSets,
        unorderedSetCount: remainingDigitSets.length,
        orderedCompletionCount: permutations * remainingDigitSets.length,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const kakuroRunCompletionExerciseExample = puzzleFreeze({
  input: { length: 3, hiddenCount: 2, seed: 42 },
  output: {
    puzzle: { targetSum: 19, cells: [0, 4, 0] },
    answer: {
      solution: [6, 4, 9],
      remainingDigitSets: [
        [6, 9],
        [7, 8],
      ],
      unorderedSetCount: 2,
      orderedCompletionCount: 4,
    },
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  KakuroRunCompletionExerciseInput,
  KakuroRunCompletionExerciseOutput
>);
const isInput = (input: unknown): input is KakuroRunCompletionExerciseInput =>
  matchesModelInput(input, inputSchema);
export const kakuroRunCompletionExerciseTool = createModelDefinition<
  KakuroRunCompletionExerciseInput,
  KakuroRunCompletionExerciseOutput
>({
  id: "random/kakuro-run-completion-exercise",
  title: "Random Kakuro Run Completion Exercise Generator",
  description:
    "Generate a distinct-digit Kakuro run with hidden cells and all feasible unordered remaining digit sets, without assuming ordered uniqueness.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateKakuroRunCompletionExercise,
  ),
});
export const runKakuroRunCompletionExercise =
  kakuroRunCompletionExerciseTool.execute;
export default kakuroRunCompletionExerciseTool;
