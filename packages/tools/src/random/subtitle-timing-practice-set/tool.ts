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
import { calculateSubtitleCharactersPerSecond } from "../../film/subtitle-characters-per-second/tool.js";
import { calculateSubtitleReadingSpeed } from "../../film/subtitle-reading-speed/tool.js";

export type SubtitleTimingPracticeSetInput = {
  readonly captions: readonly string[];
  readonly minimumMilliseconds: number;
  readonly maximumMilliseconds: number;
  readonly characterMode: "include-whitespace" | "exclude-whitespace";
  readonly characterLimit: number;
  readonly wordLimit: number;
  readonly count: number;
  readonly seed?: number;
};
export type SubtitleTimingPracticeSetOutput = {
  readonly cases: readonly {
    readonly captionIndex: number;
    readonly text: string;
    readonly durationMilliseconds: number;
    readonly durationSeconds: number;
    readonly characterCount: number;
    readonly wordCount: number;
    readonly charactersPerSecond: number;
    readonly wordsPerMinute: number;
    readonly exceedsCharacterLimit: boolean;
    readonly exceedsWordLimit: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    captions: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { type: "string", maxLength: 2048 },
    },
    minimumMilliseconds: {
      type: "integer",
      minimum: 1,
      maximum: Number.MAX_SAFE_INTEGER,
    },
    maximumMilliseconds: {
      type: "integer",
      minimum: 1,
      maximum: Number.MAX_SAFE_INTEGER,
    },
    characterMode: {
      type: "string",
      enum: ["include-whitespace", "exclude-whitespace"],
    },
    characterLimit: { type: "number", minimum: 0 },
    wordLimit: { type: "number", minimum: 0 },
    count: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: [
    "captions",
    "minimumMilliseconds",
    "maximumMilliseconds",
    "characterMode",
    "characterLimit",
    "wordLimit",
    "count",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          captionIndex: { type: "integer", minimum: 0, maximum: 63 },
          text: { type: "string", maxLength: 2048 },
          durationMilliseconds: {
            type: "integer",
            minimum: 1,
            maximum: Number.MAX_SAFE_INTEGER,
          },
          durationSeconds: { type: "number", exclusiveMinimum: 0 },
          characterCount: { type: "integer", minimum: 0, maximum: 2048 },
          wordCount: { type: "integer", minimum: 0, maximum: 2048 },
          charactersPerSecond: { type: "number", minimum: 0 },
          wordsPerMinute: { type: "number", minimum: 0 },
          exceedsCharacterLimit: { type: "boolean" },
          exceedsWordLimit: { type: "boolean" },
        },
        required: [
          "captionIndex",
          "text",
          "durationMilliseconds",
          "durationSeconds",
          "characterCount",
          "wordCount",
          "charactersPerSecond",
          "wordsPerMinute",
          "exceedsCharacterLimit",
          "exceedsWordLimit",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (input: unknown): input is SubtitleTimingPracticeSetInput =>
  matchesModelInput(input, inputSchema);
export const calculateSubtitleTimingPracticeSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SubtitleTimingPracticeSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumMilliseconds > input.maximumMilliseconds)
      simpleError(
        "maximumMilliseconds",
        "Millisecond bounds must be ordered.",
        "invalid_duration_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const captionIndex = random.integer(0, input.captions.length - 1),
        text = input.captions[captionIndex],
        durationMilliseconds = random.integer(
          input.minimumMilliseconds,
          input.maximumMilliseconds,
        ),
        durationSeconds = durationMilliseconds / 1000;
      const characterCount = [
          ...(input.characterMode === "exclude-whitespace"
            ? text.replace(/\s/gu, "")
            : text),
        ].length,
        wordCount = text.trim().split(/\s+/u).filter(Boolean).length;
      const { charactersPerSecond } = calculateSubtitleCharactersPerSecond({
          visibleCharacters: characterCount,
          durationSeconds,
        }),
        { wordsPerMinute } = calculateSubtitleReadingSpeed({
          wordCount,
          durationSeconds,
        });
      return {
        captionIndex,
        text,
        durationMilliseconds,
        durationSeconds,
        characterCount,
        wordCount,
        charactersPerSecond,
        wordsPerMinute,
        exceedsCharacterLimit: charactersPerSecond > input.characterLimit,
        exceedsWordLimit: wordsPerMinute > input.wordLimit,
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const subtitleTimingPracticeSetExample = {
  input: {
    captions: ["Hello world!", "Hi 😀"],
    minimumMilliseconds: 1000,
    maximumMilliseconds: 3000,
    characterMode: "include-whitespace",
    characterLimit: 4,
    wordLimit: 60,
    count: 3,
    seed: 42,
  },
  output: {
    cases: [
      {
        captionIndex: 1,
        text: "Hi 😀",
        durationMilliseconds: 1897,
        durationSeconds: 1.897,
        characterCount: 4,
        wordCount: 2,
        charactersPerSecond: 2.1085925144965736,
        wordsPerMinute: 63.257775434897205,
        exceedsCharacterLimit: false,
        exceedsWordLimit: true,
      },
      {
        captionIndex: 1,
        text: "Hi 😀",
        durationMilliseconds: 2340,
        durationSeconds: 2.34,
        characterCount: 4,
        wordCount: 2,
        charactersPerSecond: 1.7094017094017095,
        wordsPerMinute: 51.282051282051285,
        exceedsCharacterLimit: false,
        exceedsWordLimit: false,
      },
      {
        captionIndex: 0,
        text: "Hello world!",
        durationMilliseconds: 2053,
        durationSeconds: 2.053,
        characterCount: 12,
        wordCount: 2,
        charactersPerSecond: 5.845104724792986,
        wordsPerMinute: 58.45104724792986,
        exceedsCharacterLimit: true,
        exceedsWordLimit: false,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  SubtitleTimingPracticeSetInput,
  SubtitleTimingPracticeSetOutput
>;
export const subtitleTimingPracticeSetTool = createModelDefinition<
  SubtitleTimingPracticeSetInput,
  SubtitleTimingPracticeSetOutput
>({
  id: "random/subtitle-timing-practice-set",
  title: "Random Subtitle Timing Practice Set Generator",
  description:
    "Draw supplied plain caption text and inclusive positive millisecond durations, then delegate characters/second and words/minute. Characters are JavaScript code points with explicit whitespace inclusion/exclusion; words are nonempty whitespace-separated tokens, not linguistic segmentation. Compare only caller-supplied limits, without claiming readability or stripping markup.",
  inputSchema,
  outputSchema,
  execute: calculateSubtitleTimingPracticeSet,
});
export const runSubtitleTimingPracticeSet =
  subtitleTimingPracticeSetTool.execute;
export default subtitleTimingPracticeSetTool;
