import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  runNormalizeUnicode,
  type UnicodeForm,
} from "../../text/normalize-unicode/tool.js";
import { calculateCsvToJson } from "../../convert/csv-to-json/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  booleanSchema,
  enumSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  outputRowsSchema,
  csvTextSchema,
  rectangular,
  csvItem,
  csvText,
  type CsvRows,
} from "../m500b-csv-algorithms-csv.js";

export type CsvUnicodeNormalizationCorpusInput = {
  readonly headers: readonly string[];
  readonly rows: CsvRows;
  readonly forms: readonly UnicodeForm[];
  readonly seed?: number;
};
type Comparison = {
  readonly original: string;
  readonly normalized: string;
  readonly originalBytes: readonly number[];
  readonly normalizedBytes: readonly number[];
  readonly byteEqual: boolean;
  readonly canonicalEquivalent: boolean;
};
export type CsvUnicodeNormalizationCorpusOutput = {
  readonly form: UnicodeForm;
  readonly headers: readonly string[];
  readonly rows: CsvRows;
  readonly comparisons: readonly Comparison[];
  readonly csv: string;
  readonly parsedJson: string;
  readonly conversionConvention: string;
  readonly randomness: GeneratorReplay;
};
const formSchema = enumSchema(["NFC", "NFD", "NFKC", "NFKD"]),
  sourceText = { type: "string", maxLength: 32 } as const,
  normalizedText = { type: "string", maxLength: 256 } as const;
export const inputSchema = objectSchema(
  {
    headers: arraySchema({ ...sourceText, minLength: 1 }, 8, 1),
    rows: arraySchema(arraySchema(sourceText, 8, 1), 16, 1),
    forms: arraySchema(formSchema, 4, 1),
    seed: generatorSeedSchema,
  },
  ["headers", "rows", "forms"],
);
export const outputSchema = objectSchema({
  form: formSchema,
  headers: arraySchema(normalizedText, 8),
  rows: outputRowsSchema,
  comparisons: arraySchema(
    objectSchema({
      original: sourceText,
      normalized: normalizedText,
      originalBytes: arraySchema(countSchema(255), 128),
      normalizedBytes: arraySchema(countSchema(255), 1024),
      byteEqual: booleanSchema,
      canonicalEquivalent: booleanSchema,
    }),
    136,
  ),
  csv: csvTextSchema,
  parsedJson: csvTextSchema,
  conversionConvention: {
    type: "string",
    const:
      "legacy CSV-to-JSON: empty cells become null; single-empty-cell records may be dropped",
  },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvUnicodeNormalizationCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvUnicodeNormalizationCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvUnicodeNormalizationCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    rectangular(input.rows, input.headers.length);
    distinct(input.forms, "forms");
    const random = createGeneratorRandom(input.seed, context),
      form = csvItem(input.forms, random),
      comparisons: Comparison[] = [];
    const normalize = (original: string): string => {
      const normalized = coreOutput(
        runNormalizeUnicode({ text: original, form }),
      ).normalized;
      if (normalized.length > 256)
        return simpleError(
          "rows",
          "Normalized text exceeds the bounded fixture cell budget.",
          "resource_limit",
        );
      const originalBytes = utf8Encode(original),
        normalizedBytes = utf8Encode(normalized);
      comparisons.push({
        original,
        normalized,
        originalBytes,
        normalizedBytes,
        byteEqual:
          JSON.stringify(originalBytes) === JSON.stringify(normalizedBytes),
        canonicalEquivalent:
          coreOutput(runNormalizeUnicode({ text: original, form: "NFC" }))
            .normalized ===
          coreOutput(runNormalizeUnicode({ text: normalized, form: "NFC" }))
            .normalized,
      });
      return normalized;
    };
    const headers = input.headers.map(normalize);
    distinct(headers, "headers");
    const rows = input.rows.map((row) => row.map(normalize)),
      csv = csvText([headers, ...rows]);
    return toolSuccess({
      form,
      headers,
      rows,
      comparisons,
      csv,
      parsedJson: calculateCsvToJson({ csv, inferNumbers: false }).json,
      conversionConvention:
        "legacy CSV-to-JSON: empty cells become null; single-empty-cell records may be dropped",
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvUnicodeNormalizationCorpusExample = {
  input: { headers: ["café"], rows: [["é"]], forms: ["NFC", "NFD"], seed: 42 },
  output: {
    form: "NFD",
    headers: ["cafe\u0301"],
    rows: [["e\u0301"]],
    comparisons: [
      {
        original: "café",
        normalized: "cafe\u0301",
        originalBytes: [99, 97, 102, 195, 169],
        normalizedBytes: [99, 97, 102, 101, 204, 129],
        byteEqual: false,
        canonicalEquivalent: true,
      },
      {
        original: "é",
        normalized: "e\u0301",
        originalBytes: [195, 169],
        normalizedBytes: [101, 204, 129],
        byteEqual: false,
        canonicalEquivalent: true,
      },
    ],
    csv: "cafe\u0301\ne\u0301",
    parsedJson: '[{"cafe\u0301":"e\u0301"}]',
    conversionConvention:
      "legacy CSV-to-JSON: empty cells become null; single-empty-cell records may be dropped",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvUnicodeNormalizationCorpusInput,
  CsvUnicodeNormalizationCorpusOutput
>;
export const csvUnicodeNormalizationCorpusTool = createModelDefinition<
  CsvUnicodeNormalizationCorpusInput,
  CsvUnicodeNormalizationCorpusOutput
>({
  id: "random/csv-unicode-normalization-corpus",
  title: "Random CSV Unicode Normalization Corpus Generator",
  description:
    "Normalize supplied headers and cells with a sampled Unicode form and retain UTF-8 bytes and canonical-equivalence comparisons. Parsed JSON preserves the disclosed legacy empty-cell and blank-record conversion, not a lossless round trip.",
  inputSchema,
  outputSchema,
  execute: calculateCsvUnicodeNormalizationCorpus,
});
export const runCsvUnicodeNormalizationCorpus =
  csvUnicodeNormalizationCorpusTool.execute;
export default csvUnicodeNormalizationCorpusTool;
