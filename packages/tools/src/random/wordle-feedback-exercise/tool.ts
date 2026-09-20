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
} from "../../game/wordle-feedback-pattern-green-yellow-gray/tool.js";
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
  puzzleCount,
  puzzleDistinct,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleValidate,
  puzzleWord,
} from "../m250-puzzles-logic-support.js";
export type WordleFeedbackExerciseInput = {
  readonly answers: readonly string[];
  readonly guesses: readonly string[];
  readonly provenance: string;
  readonly guessCount: number;
  readonly hideSecret: boolean;
  readonly seed?: number;
};
export type WordleFeedbackExerciseOutput = {
  readonly puzzle: {
    readonly answerWord: string | null;
    readonly rounds: readonly {
      readonly guess: string;
      readonly feedback: Feedback;
    }[];
  };
  readonly answer: { readonly answerWord: string };
  readonly provenance: string;
  readonly randomness: GeneratorReplay;
};
const bank = puzzleArray(puzzleWord, 128, 1),
  provenanceSchema = { type: "string", minLength: 1, maxLength: 512 } as const;
export const inputSchema = puzzleObject(
  {
    answers: bank,
    guesses: bank,
    provenance: provenanceSchema,
    guessCount: puzzleCount,
    hideSecret: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  ["answers", "guesses", "provenance", "guessCount", "hideSecret"],
);
export const outputSchema = puzzleObject({
  puzzle: puzzleObject({
    answerWord: { anyOf: [puzzleWord, { type: "null" }] },
    rounds: puzzleArray(
      puzzleObject({
        guess: puzzleWord,
        feedback: puzzleObject({
          feedbackCodes: puzzleArray(puzzleInteger, 32),
          feedbackPattern: { type: "string" },
        }),
      }),
      64,
      1,
    ),
  }),
  answer: puzzleObject({ answerWord: puzzleWord }),
  provenance: provenanceSchema,
  randomness: generatorReplaySchema,
});
export const calculateWordleFeedbackExercise = (
  input: WordleFeedbackExerciseInput,
  context?: ToolExecutionContext,
): ToolResult<WordleFeedbackExerciseOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    puzzleDistinct(input.answers, "answers");
    puzzleDistinct(input.guesses, "guesses");
    if (
      [...input.answers, ...input.guesses].some(
        (w) => w.length !== input.answers[0].length,
      )
    )
      simpleError(
        "guesses",
        "All supplied answers and guesses must have the same length.",
        "word_length_mismatch",
      );
    const random = createGeneratorRandom(input.seed, context),
      answerWord = random.pick(input.answers),
      rounds = Array.from({ length: input.guessCount }, () => {
        const guess = random.pick(input.guesses);
        return { guess, feedback: feedback({ answerWord, guessWord: guess }) };
      });
    return toolSuccess({
      puzzle: { answerWord: input.hideSecret ? null : answerWord, rounds },
      answer: { answerWord },
      provenance: input.provenance,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const wordleFeedbackExerciseExample = puzzleFreeze({
  input: {
    answers: ["apple", "allee"],
    guesses: ["apple", "alley"],
    provenance: "Caller-supplied illustrative words",
    guessCount: 2,
    hideSecret: true,
    seed: 42,
  },
  output: {
    puzzle: {
      answerWord: null,
      rounds: [
        {
          guess: "apple",
          feedback: {
            feedbackCodes: [2, 0, 0, 1, 2],
            feedbackPattern: "20012",
          },
        },
        {
          guess: "alley",
          feedback: {
            feedbackCodes: [2, 2, 2, 2, 0],
            feedbackPattern: "22220",
          },
        },
      ],
    },
    answer: { answerWord: "allee" },
    provenance: "Caller-supplied illustrative words",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  WordleFeedbackExerciseInput,
  WordleFeedbackExerciseOutput
>);
const isInput = (input: unknown): input is WordleFeedbackExerciseInput =>
  matchesModelInput(input, inputSchema);
export const wordleFeedbackExerciseTool = createModelDefinition<
  WordleFeedbackExerciseInput,
  WordleFeedbackExerciseOutput
>({
  id: "random/wordle-feedback-exercise",
  title: "Random Wordle Feedback Exercise Generator",
  description:
    "Draw supplied equal-length words and guesses with duplicate-aware Wordle feedback and a separate answer key, without an official dictionary or unique-deduction claim.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateWordleFeedbackExercise,
  ),
});
export const runWordleFeedbackExercise = wordleFeedbackExerciseTool.execute;
export default wordleFeedbackExerciseTool;
