import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateEquivalenceBiconditionalMatchChecker } from "../../logic/equivalence-biconditional-match-checker/tool.js";
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
  puzzleBoolean,
  puzzleCount,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleUnwrap,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type BooleanEquivalenceQuizInput = {
  readonly variableCount: number;
  readonly mismatchCount: number;
  readonly count: number;
  readonly seed?: number;
};
export type BooleanEquivalenceQuizOutput = {
  readonly valuationOrder: "ascending-binary-false-first-msb";
  readonly valuations: readonly (readonly boolean[])[];
  readonly questions: readonly {
    readonly left: readonly boolean[];
    readonly right: readonly boolean[];
    readonly equivalent: boolean;
    readonly mismatchRows: readonly number[];
  }[];
  readonly randomness: GeneratorReplay;
};
const column = puzzleArray(puzzleBoolean, 256, 1);
export const inputSchema = puzzleObject(
  {
    variableCount: { type: "integer", minimum: 0, maximum: 8 },
    mismatchCount: { type: "integer", minimum: 0, maximum: 256 },
    count: puzzleCount,
    seed: generatorSeedSchema,
  },
  ["variableCount", "mismatchCount", "count"],
);
export const outputSchema = puzzleObject({
  valuationOrder: { type: "string", const: "ascending-binary-false-first-msb" },
  valuations: puzzleArray(puzzleArray(puzzleBoolean, 8), 256, 1),
  questions: puzzleArray(
    puzzleObject({
      left: column,
      right: column,
      equivalent: puzzleBoolean,
      mismatchRows: puzzleArray(puzzleInteger, 256),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
export const calculateBooleanEquivalenceQuiz = (
  input: BooleanEquivalenceQuizInput,
  context?: ToolExecutionContext,
): ToolResult<BooleanEquivalenceQuizOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    const rowCount = 2 ** input.variableCount;
    if (input.mismatchCount > rowCount)
      simpleError(
        "mismatchCount",
        "Mismatch count cannot exceed complete-table rows.",
        "infeasible_mismatch_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      valuations = Array.from({ length: rowCount }, (_, row) =>
        Array.from(
          { length: input.variableCount },
          (_, i) =>
            Math.floor(row / 2 ** (input.variableCount - i - 1)) % 2 === 1,
        ),
      );
    const questions = Array.from({ length: input.count }, () => {
      const left = Array.from(
          { length: rowCount },
          () => random.integer(0, 1) === 1,
        ),
        mismatchRows = generatorSampleIndices(
          rowCount,
          input.mismatchCount,
          random,
        ).sort((a, b) => a - b),
        changed = new Set(mismatchRows),
        right = left.map((v, i) => (changed.has(i) ? !v : v)),
        core = puzzleUnwrap(
          calculateEquivalenceBiconditionalMatchChecker({ left, right }),
        );
      return { left, right, equivalent: core.equivalent, mismatchRows };
    });
    return toolSuccess({
      valuationOrder: "ascending-binary-false-first-msb",
      valuations,
      questions,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const booleanEquivalenceQuizExample = puzzleFreeze({
  input: { variableCount: 2, mismatchCount: 2, count: 1, seed: 42 },
  output: {
    valuationOrder: "ascending-binary-false-first-msb",
    valuations: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    questions: [
      {
        left: [true, false, true, true],
        right: [false, true, true, true],
        equivalent: false,
        mismatchRows: [0, 1],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  BooleanEquivalenceQuizInput,
  BooleanEquivalenceQuizOutput
>);
const isInput = (input: unknown): input is BooleanEquivalenceQuizInput =>
  matchesModelInput(input, inputSchema);
export const booleanEquivalenceQuizTool = createModelDefinition<
  BooleanEquivalenceQuizInput,
  BooleanEquivalenceQuizOutput
>({
  id: "random/boolean-equivalence-quiz",
  title: "Random Boolean Equivalence Quiz Generator",
  description:
    "Generate complete aligned truth columns with an exact deliberate mismatch count and delegated equivalence keys under a declared valuation order.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateBooleanEquivalenceQuiz,
  ),
});
export const runBooleanEquivalenceQuiz = booleanEquivalenceQuizTool.execute;
export default booleanEquivalenceQuizTool;
