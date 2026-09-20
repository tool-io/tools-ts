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
import { encodeBase32 } from "../../encode/base32/tool.js";
import { encodeBase64 } from "../../encode/base64/tool.js";
import { calculateBase85Encode } from "../../encode/base85/tool.js";
import { runEncodeHtmlEntities } from "../../encode/html-entities/tool.js";
import { generatorSampleIndices } from "../generator-random.js";

export type PracticeTextEncoding =
  "base32" | "base64" | "ascii85" | "html-entities";
export type TextEncodingDetectionPracticeCardsInput = {
  readonly messages: readonly string[];
  readonly encodings: readonly PracticeTextEncoding[];
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly seed?: number;
};
export type TextEncodingDetectionPracticeCardsOutput = {
  readonly cards: readonly {
    readonly display: string;
    readonly sourceText: string;
    readonly generatedEncoding: PracticeTextEncoding;
    readonly acceptedLabels: readonly PracticeTextEncoding[];
    readonly matchingSources: readonly {
      readonly encoding: PracticeTextEncoding;
      readonly text: string;
    }[];
    readonly uniqueWithinSuppliedBank: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const encodingSchema = {
  type: "string",
  enum: ["base32", "base64", "ascii85", "html-entities"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    messages: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "string", maxLength: 256 },
    },
    encodings: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: encodingSchema,
    },
    count: { type: "integer", minimum: 1, maximum: 32 },
    withoutReplacement: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  required: ["messages", "encodings", "count", "withoutReplacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cards: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          display: { type: "string", maxLength: 2048 },
          sourceText: { type: "string", maxLength: 256 },
          generatedEncoding: encodingSchema,
          acceptedLabels: {
            type: "array",
            minItems: 1,
            maxItems: 4,
            items: encodingSchema,
          },
          matchingSources: {
            type: "array",
            minItems: 1,
            maxItems: 64,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                encoding: encodingSchema,
                text: { type: "string", maxLength: 256 },
              },
              required: ["encoding", "text"],
            },
          },
          uniqueWithinSuppliedBank: { type: "boolean" },
        },
        required: [
          "display",
          "sourceText",
          "generatedEncoding",
          "acceptedLabels",
          "matchingSources",
          "uniqueWithinSuppliedBank",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cards", "randomness"],
} as const;
const encodePracticeText = (
  text: string,
  encoding: PracticeTextEncoding,
): string => {
  if (encoding === "base32") return encodeBase32(text);
  if (encoding === "base64") return encodeBase64(text);
  if (encoding === "ascii85") return calculateBase85Encode({ text }).encoded;
  const result = runEncodeHtmlEntities({ text });
  if (!result.ok)
    throw new Error(
      "A bounded message was rejected by the HTML entity encoder.",
    );
  return result.output.encoded as string;
};
const isInput = (
  input: unknown,
): input is TextEncodingDetectionPracticeCardsInput =>
  matchesModelInput(input, inputSchema);
export const calculateTextEncodingDetectionPracticeCards = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TextEncodingDetectionPracticeCardsOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.messages).size !== input.messages.length)
      simpleError("messages", "Entries must be distinct.", "duplicate_entries");
    if (new Set(input.encodings).size !== input.encodings.length)
      simpleError(
        "encodings",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    if (
      input.messages.some((text) =>
        [...text].some((character) => {
          const point = character.codePointAt(0) ?? 0;
          return point >= 0xd800 && point <= 0xdfff;
        }),
      )
    )
      simpleError(
        "messages",
        "Use well-formed Unicode messages so UTF-8 source identities do not silently replace lone surrogates.",
        "ill_formed_unicode",
      );
    const bank = input.messages.flatMap((text) =>
      input.encodings.map((encoding) => ({
        text,
        encoding,
        display: encodePracticeText(text, encoding),
      })),
    );
    if (input.withoutReplacement && input.count > bank.length)
      simpleError(
        "count",
        "No-replacement card count cannot exceed source/encoding pairs.",
        "insufficient_pairs",
      );
    const byDisplay = new Map<string, typeof bank>();
    for (const entry of bank)
      byDisplay.set(entry.display, [
        ...(byDisplay.get(entry.display) ?? []),
        entry,
      ]);
    const random = createGeneratorRandom(input.seed, context),
      indices = input.withoutReplacement
        ? generatorSampleIndices(bank.length, input.count, random)
        : Array.from({ length: input.count }, () =>
            random.integer(0, bank.length - 1),
          );
    const cards = indices.map((index) => {
      const selected = bank[index],
        matches = byDisplay.get(selected.display);
      if (matches === undefined)
        throw new Error(
          "A generated encoding pair was not retained in its display group.",
        );
      const acceptedLabels = input.encodings.filter((encoding) =>
        matches.some((entry) => entry.encoding === encoding),
      );
      return {
        display: selected.display,
        sourceText: selected.text,
        generatedEncoding: selected.encoding,
        acceptedLabels,
        matchingSources: matches.map((entry) => ({
          encoding: entry.encoding,
          text: entry.text,
        })),
        uniqueWithinSuppliedBank: acceptedLabels.length === 1,
      };
    });
    return toolSuccess({
      cards,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const textEncodingDetectionPracticeCardsExample = {
  input: {
    messages: ["", "foo"],
    encodings: ["base32", "base64", "ascii85", "html-entities"],
    count: 3,
    withoutReplacement: false,
    seed: 42,
  },
  output: {
    cards: [
      {
        display: "MZXW6===",
        sourceText: "foo",
        generatedEncoding: "base32",
        acceptedLabels: ["base32"],
        matchingSources: [
          {
            encoding: "base32",
            text: "foo",
          },
        ],
        uniqueWithinSuppliedBank: true,
      },
      {
        display: "",
        sourceText: "",
        generatedEncoding: "html-entities",
        acceptedLabels: ["base32", "base64", "ascii85", "html-entities"],
        matchingSources: [
          {
            encoding: "base32",
            text: "",
          },
          {
            encoding: "base64",
            text: "",
          },
          {
            encoding: "ascii85",
            text: "",
          },
          {
            encoding: "html-entities",
            text: "",
          },
        ],
        uniqueWithinSuppliedBank: false,
      },
      {
        display: "AoDS",
        sourceText: "foo",
        generatedEncoding: "ascii85",
        acceptedLabels: ["ascii85"],
        matchingSources: [
          {
            encoding: "ascii85",
            text: "foo",
          },
        ],
        uniqueWithinSuppliedBank: true,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  TextEncodingDetectionPracticeCardsInput,
  TextEncodingDetectionPracticeCardsOutput
>;
export const textEncodingDetectionPracticeCardsTool = createModelDefinition<
  TextEncodingDetectionPracticeCardsInput,
  TextEncodingDetectionPracticeCardsOutput
>({
  id: "random/text-encoding-detection-practice-cards",
  title: "Random Text Encoding Detection Practice Cards Generator",
  description:
    "Encode supplied well-formed messages with selected existing UTF-8 base32/base64/Ascii85 or five-character HTML-entity encoders and sample practice cards; accepted labels include every source/encoding pair in that supplied bank yielding the same display, not universal encoding detection, and no-replacement applies to pairs rather than distinct prompts.",
  inputSchema,
  outputSchema,
  execute: calculateTextEncodingDetectionPracticeCards,
});
export const runTextEncodingDetectionPracticeCards =
  textEncodingDetectionPracticeCardsTool.execute;
export default textEncodingDetectionPracticeCardsTool;
