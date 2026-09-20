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
import { calculate as calculateCloze } from "../../pedagogy/cloze-passage-generator/tool.js";

export type ClozePracticePacketInput = {
  readonly passages: readonly string[];
  readonly minimumInterval: number;
  readonly maximumInterval: number;
  readonly count: number;
  readonly seed?: number;
};
export type ClozePracticePacketOutput = {
  readonly exercises: readonly {
    readonly passageIndex: number;
    readonly passage: string;
    readonly deleteEveryNthWord: number;
    readonly firstDeletionOrdinal: number;
    readonly clozePassage: string;
    readonly deletedWords: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passages: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: { type: "string", minLength: 1, maxLength: 4096 },
    },
    minimumInterval: { type: "integer", minimum: 1, maximum: 128 },
    maximumInterval: { type: "integer", minimum: 1, maximum: 128 },
    count: { type: "integer", minimum: 1, maximum: 32 },
    seed: generatorSeedSchema,
  },
  required: ["passages", "minimumInterval", "maximumInterval", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exercises: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          passageIndex: { type: "integer", minimum: 0, maximum: 31 },
          passage: { type: "string", minLength: 1, maxLength: 4096 },
          deleteEveryNthWord: { type: "integer", minimum: 1, maximum: 128 },
          firstDeletionOrdinal: { type: "integer", minimum: 1, maximum: 128 },
          clozePassage: { type: "string", maxLength: 16384 },
          deletedWords: {
            type: "array",
            maxItems: 4096,
            items: { type: "string", minLength: 1, maxLength: 4096 },
          },
        },
        required: [
          "passageIndex",
          "passage",
          "deleteEveryNthWord",
          "firstDeletionOrdinal",
          "clozePassage",
          "deletedWords",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["exercises", "randomness"],
} as const;

const isInput = (input: unknown): input is ClozePracticePacketInput =>
  matchesModelInput(input, inputSchema);
export const calculateClozePracticePacket = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ClozePracticePacketOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumInterval > input.maximumInterval)
      simpleError(
        "maximumInterval",
        "Deletion interval bounds must be ordered.",
        "invalid_interval_range",
      );
    for (const passage of input.passages)
      calculateCloze({
        passage,
        deleteEveryNthWord: 1,
        firstDeletionOrdinal: 1,
      });
    const random = createGeneratorRandom(input.seed, context);
    const exercises = Array.from({ length: input.count }, () => {
      const passageIndex = random.integer(0, input.passages.length - 1),
        passage = input.passages[passageIndex],
        deleteEveryNthWord = random.integer(
          input.minimumInterval,
          input.maximumInterval,
        ),
        firstDeletionOrdinal = random.integer(1, deleteEveryNthWord);
      return {
        passageIndex,
        passage,
        deleteEveryNthWord,
        firstDeletionOrdinal,
        ...calculateCloze({
          passage,
          deleteEveryNthWord,
          firstDeletionOrdinal,
        }),
      };
    });
    return toolSuccess({
      exercises,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const clozePracticePacketExample = {
  input: {
    passages: ["One two three four five six.", "Red, blue; green and gold."],
    minimumInterval: 2,
    maximumInterval: 4,
    count: 3,
    seed: 42,
  },
  output: {
    exercises: [
      {
        passageIndex: 1,
        passage: "Red, blue; green and gold.",
        deleteEveryNthWord: 3,
        firstDeletionOrdinal: 3,
        clozePassage: "Red, blue; ____ and gold.",
        deletedWords: ["green"],
      },
      {
        passageIndex: 1,
        passage: "Red, blue; green and gold.",
        deleteEveryNthWord: 2,
        firstDeletionOrdinal: 2,
        clozePassage: "Red, ____; green ____ gold.",
        deletedWords: ["blue", "and"],
      },
      {
        passageIndex: 0,
        passage: "One two three four five six.",
        deleteEveryNthWord: 3,
        firstDeletionOrdinal: 3,
        clozePassage: "One two ____ four five ____.",
        deletedWords: ["three", "six"],
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<ClozePracticePacketInput, ClozePracticePacketOutput>;
export const clozePracticePacketTool = createModelDefinition<
  ClozePracticePacketInput,
  ClozePracticePacketOutput
>({
  id: "random/cloze-practice-packet",
  title: "Random Cloze Practice Packet Generator",
  description:
    "Sample caller-supplied passages with replacement, draw a deletion interval and valid starting ordinal for each, and delegate punctuation-preserving cloze generation with original-word keys. Tokenization follows the existing Unicode word rule; empty-key exercises can occur when the first ordinal exceeds passage length, and difficulty is not calibrated.",
  inputSchema,
  outputSchema,
  execute: calculateClozePracticePacket,
});
export const runClozePracticePacket = clozePracticePacketTool.execute;
export default clozePracticePacketTool;
