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
import { runIdentifierGenerator as generateEan } from "../../generate/ean-13/tool.js";
import { runIdentifierGenerator as generateIsbn } from "../../generate/isbn-13/tool.js";
import { calculateValidateGtin } from "../../validate/gtin/tool.js";
import { calculateValidateIsbn } from "../../validate/isbn/tool.js";

export type TranscriptionIdentifierKind = "ean-13" | "isbn-13";
export type TranscriptionMutation =
  "substitution" | "deletion" | "transposition";
export type TranscriptionValidation = {
  readonly normalized: string;
  readonly type: string;
  readonly valid: boolean;
};
export type IdentifierTranscriptionErrorCorpusInput = {
  readonly kinds: readonly TranscriptionIdentifierKind[];
  readonly operations: readonly TranscriptionMutation[];
  readonly count: number;
  readonly seed?: number;
};
export type IdentifierTranscriptionErrorCorpusOutput = {
  readonly cases: readonly {
    readonly kind: TranscriptionIdentifierKind;
    readonly original: string;
    readonly originalValidation: TranscriptionValidation;
    readonly operation: TranscriptionMutation;
    readonly position: number;
    readonly before: string;
    readonly after: string;
    readonly mutated: string;
    readonly changed: boolean;
    readonly mutatedValidation: TranscriptionValidation;
  }[];
  readonly randomness: GeneratorReplay;
};
const identifierKinds = ["ean-13", "isbn-13"] as const,
  operations = ["substitution", "deletion", "transposition"] as const;
const validationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "string" },
    type: { type: "string" },
    valid: { type: "boolean" },
  },
  required: ["normalized", "type", "valid"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kinds: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      items: { type: "string", enum: identifierKinds },
    },
    operations: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string", enum: operations },
    },
    count: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: ["kinds", "operations", "count"],
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
          kind: { type: "string", enum: identifierKinds },
          original: { type: "string", minLength: 13, maxLength: 13 },
          originalValidation: validationSchema,
          operation: { type: "string", enum: operations },
          position: { type: "integer", minimum: 0, maximum: 12 },
          before: { type: "string", minLength: 1, maxLength: 2 },
          after: { type: "string", maxLength: 2 },
          mutated: { type: "string", minLength: 12, maxLength: 13 },
          changed: { type: "boolean" },
          mutatedValidation: validationSchema,
        },
        required: [
          "kind",
          "original",
          "originalValidation",
          "operation",
          "position",
          "before",
          "after",
          "mutated",
          "changed",
          "mutatedValidation",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;
const validateTranscription = (
  kind: TranscriptionIdentifierKind,
  identifier: string,
): TranscriptionValidation => {
  const result =
    kind === "ean-13"
      ? calculateValidateGtin({ identifier })
      : calculateValidateIsbn({ isbn: identifier });
  if (!result.ok)
    throw new Error("A constructed decimal identifier was rejected as input.");
  const { normalized, type, valid } = result.output;
  return { normalized, type, valid };
};
const isInput = (
  input: unknown,
): input is IdentifierTranscriptionErrorCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateIdentifierTranscriptionErrorCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<IdentifierTranscriptionErrorCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.kinds).size !== input.kinds.length)
      simpleError("kinds", "Entries must be distinct.", "duplicate_entries");
    if (new Set(input.operations).size !== input.operations.length)
      simpleError(
        "operations",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const kind = random.pick(input.kinds);
      const dataDigits =
        (kind === "isbn-13" ? "978" : "") +
        Array.from({ length: kind === "isbn-13" ? 9 : 12 }, () =>
          String(random.integer(0, 9)),
        ).join("");
      const generated =
        kind === "ean-13"
          ? generateEan({ dataDigits })
          : generateIsbn({ dataDigits });
      if (!generated.ok)
        throw new Error("A constructed identifier failed checksum generation.");
      const original = generated.output.identifier,
        operation = random.pick(input.operations),
        position = random.integer(0, operation === "transposition" ? 11 : 12);
      const before = original.slice(
        position,
        position + (operation === "transposition" ? 2 : 1),
      );
      const after =
        operation === "substitution"
          ? String((Number(before) + random.integer(1, 9)) % 10)
          : operation === "deletion"
            ? ""
            : [...before].reverse().join("");
      const mutated =
        original.slice(0, position) +
        after +
        original.slice(position + before.length);
      return {
        kind,
        original,
        originalValidation: validateTranscription(kind, original),
        operation,
        position,
        before,
        after,
        mutated,
        changed: original !== mutated,
        mutatedValidation: validateTranscription(kind, mutated),
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
export const identifierTranscriptionErrorCorpusExample = {
  input: {
    kinds: ["ean-13", "isbn-13"],
    operations: ["substitution", "deletion", "transposition"],
    count: 5,
    seed: 42,
  },
  output: {
    cases: [
      {
        kind: "isbn-13",
        original: "9784861526848",
        originalValidation: {
          normalized: "9784861526848",
          type: "ISBN-13",
          valid: true,
        },
        operation: "substitution",
        position: 11,
        before: "4",
        after: "1",
        mutated: "9784861526818",
        changed: true,
        mutatedValidation: {
          normalized: "9784861526818",
          type: "ISBN-13",
          valid: false,
        },
      },
      {
        kind: "ean-13",
        original: "1566048050203",
        originalValidation: {
          normalized: "1566048050203",
          type: "GTIN-13",
          valid: true,
        },
        operation: "substitution",
        position: 10,
        before: "2",
        after: "7",
        mutated: "1566048050703",
        changed: true,
        mutatedValidation: {
          normalized: "1566048050703",
          type: "GTIN-13",
          valid: false,
        },
      },
      {
        kind: "ean-13",
        original: "1848340055262",
        originalValidation: {
          normalized: "1848340055262",
          type: "GTIN-13",
          valid: true,
        },
        operation: "substitution",
        position: 3,
        before: "8",
        after: "5",
        mutated: "1845340055262",
        changed: true,
        mutatedValidation: {
          normalized: "1845340055262",
          type: "GTIN-13",
          valid: false,
        },
      },
      {
        kind: "isbn-13",
        original: "9785222066690",
        originalValidation: {
          normalized: "9785222066690",
          type: "ISBN-13",
          valid: true,
        },
        operation: "substitution",
        position: 12,
        before: "0",
        after: "4",
        mutated: "9785222066694",
        changed: true,
        mutatedValidation: {
          normalized: "9785222066694",
          type: "ISBN-13",
          valid: false,
        },
      },
      {
        kind: "isbn-13",
        original: "9781103468072",
        originalValidation: {
          normalized: "9781103468072",
          type: "ISBN-13",
          valid: true,
        },
        operation: "transposition",
        position: 3,
        before: "11",
        after: "11",
        mutated: "9781103468072",
        changed: false,
        mutatedValidation: {
          normalized: "9781103468072",
          type: "ISBN-13",
          valid: true,
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  IdentifierTranscriptionErrorCorpusInput,
  IdentifierTranscriptionErrorCorpusOutput
>;
export const identifierTranscriptionErrorCorpusTool = createModelDefinition<
  IdentifierTranscriptionErrorCorpusInput,
  IdentifierTranscriptionErrorCorpusOutput
>({
  id: "random/identifier-transcription-error-corpus",
  title: "Random Identifier Transcription Error Corpus Generator",
  description:
    "Generate synthetic checksum-valid EAN-13 and 978-prefixed ISBN-13 originals, apply a selected decimal substitution, deletion, or adjacent transposition, and record actual GTIN/ISBN validator outcomes; swaps may be unchanged or remain valid, and checksum validity is not product or publication allocation.",
  inputSchema,
  outputSchema,
  execute: calculateIdentifierTranscriptionErrorCorpus,
});
export const runIdentifierTranscriptionErrorCorpus =
  identifierTranscriptionErrorCorpusTool.execute;
export default identifierTranscriptionErrorCorpusTool;
