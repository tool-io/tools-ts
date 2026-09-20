import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  calculate as feedback,
  type Output as Feedback,
} from "../../game/mastermind-black-white-peg-feedback-calculator/tool.js";
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
  puzzleCount,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type MastermindRoundDatasetInput = {
  readonly codeLength: number;
  readonly symbolCount: number;
  readonly allowRepetition: boolean;
  readonly guessCount: number;
  readonly seed?: number;
};
export type MastermindRoundDatasetOutput = {
  readonly secret: readonly number[];
  readonly rounds: readonly {
    readonly guess: readonly number[];
    readonly feedback: Feedback;
  }[];
  readonly randomness: GeneratorReplay;
};
const code = puzzleArray(puzzleInteger, 16, 1);
export const inputSchema = puzzleObject(
  {
    codeLength: { type: "integer", minimum: 1, maximum: 16 },
    symbolCount: { type: "integer", minimum: 1, maximum: 100 },
    allowRepetition: {
      type: "boolean",
      description:
        "Whether a symbol may repeat within one code; guesses may repeat across rounds.",
    },
    guessCount: puzzleCount,
    seed: generatorSeedSchema,
  },
  ["codeLength", "symbolCount", "allowRepetition", "guessCount"],
);
export const outputSchema = puzzleObject({
  secret: code,
  rounds: puzzleArray(
    puzzleObject({
      guess: code,
      feedback: puzzleObject({
        blackExactPegs: puzzleInteger,
        whiteMisplacedPegs: puzzleInteger,
        perPositionFeedback: puzzleArray(puzzleInteger, 16),
      }),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
export const calculateMastermindRoundDataset = (
  input: MastermindRoundDatasetInput,
  context?: ToolExecutionContext,
): ToolResult<MastermindRoundDatasetOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    if (!input.allowRepetition && input.codeLength > input.symbolCount)
      simpleError(
        "codeLength",
        "Distinct codes need at least as many symbols as positions.",
        "insufficient_symbols",
      );
    const random = createGeneratorRandom(input.seed, context),
      draw = (): number[] =>
        input.allowRepetition
          ? Array.from({ length: input.codeLength }, () =>
              random.integer(0, input.symbolCount - 1),
            )
          : generatorSampleIndices(input.symbolCount, input.codeLength, random),
      secret = draw();
    const rounds = Array.from({ length: input.guessCount }, () => {
      const guess = draw();
      return {
        guess,
        feedback: feedback({
          secretCode: secret,
          guessedCode: guess,
          symbolCount: input.symbolCount,
        }),
      };
    });
    return toolSuccess({
      secret,
      rounds,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const mastermindRoundDatasetExample = puzzleFreeze({
  input: {
    codeLength: 4,
    symbolCount: 4,
    allowRepetition: true,
    guessCount: 2,
    seed: 42,
  },
  output: {
    secret: [2, 1, 3, 2],
    rounds: [
      {
        guess: [0, 2, 1, 2],
        feedback: {
          blackExactPegs: 1,
          whiteMisplacedPegs: 2,
          perPositionFeedback: [0, 1, 1, 2],
        },
      },
      {
        guess: [3, 1, 0, 3],
        feedback: {
          blackExactPegs: 1,
          whiteMisplacedPegs: 1,
          perPositionFeedback: [1, 2, 0, 0],
        },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  MastermindRoundDatasetInput,
  MastermindRoundDatasetOutput
>);
const isInput = (input: unknown): input is MastermindRoundDatasetInput =>
  matchesModelInput(input, inputSchema);
export const mastermindRoundDatasetTool = createModelDefinition<
  MastermindRoundDatasetInput,
  MastermindRoundDatasetOutput
>({
  id: "random/mastermind-round-dataset",
  title: "Random Mastermind Round Dataset Generator",
  description:
    "Generate a synthetic secret and guesses under explicit repetition rules with delegated duplicate-aware peg feedback, without claiming unique deduction.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateMastermindRoundDataset,
  ),
});
export const runMastermindRoundDataset = mastermindRoundDatasetTool.execute;
export default mastermindRoundDatasetTool;
