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
import { calculateJsonToCsv } from "../../convert/json-to-csv/tool.js";
import { calculateCsvToJson } from "../../convert/csv-to-json/tool.js";

export type CsvEdgeCellKind =
  "delimiter" | "quote" | "lf" | "crlf" | "unicode" | "empty" | "unmodified";
export type CsvQuotingEdgeCaseCorpusInput = {
  readonly headers: readonly string[];
  readonly fragments: readonly string[];
  readonly kinds: readonly CsvEdgeCellKind[];
  readonly delimiter: "," | ";" | "\t" | "|";
  readonly caseCount: number;
  readonly rowCount: number;
  readonly seed?: number;
};
export type CsvQuotingEdgeCaseCorpusOutput = {
  readonly headers: readonly string[];
  readonly cases: readonly {
    readonly cells: readonly (readonly string[])[];
    readonly cellKinds: readonly (readonly CsvEdgeCellKind[])[];
    readonly csv: string;
    readonly parsedJson: string;
    readonly parsedCells: readonly (readonly (string | null)[])[];
    readonly skippedSingleEmptyRows: number;
    readonly exactRoundTrip: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const kindSchema = {
  type: "string",
  enum: ["delimiter", "quote", "lf", "crlf", "unicode", "empty", "unmodified"],
} as const;
const headersSchema = {
  type: "array",
  minItems: 1,
  maxItems: 8,
  items: {
    type: "string",
    minLength: 1,
    maxLength: 32,
    pattern: "^[A-Za-z_][A-Za-z0-9_]*(?![\\s\\S])",
  },
} as const;
const cellsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 64,
  items: {
    type: "array",
    minItems: 1,
    maxItems: 8,
    items: { type: "string", maxLength: 130 },
  },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headers: headersSchema,
    fragments: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "string", maxLength: 64 },
    },
    kinds: { type: "array", minItems: 1, maxItems: 7, items: kindSchema },
    delimiter: { type: "string", enum: [",", ";", "\t", "|"] },
    caseCount: { type: "integer", minimum: 1, maximum: 16 },
    rowCount: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: [
    "headers",
    "fragments",
    "kinds",
    "delimiter",
    "caseCount",
    "rowCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headers: headersSchema,
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          cells: cellsSchema,
          cellKinds: {
            type: "array",
            minItems: 1,
            maxItems: 64,
            items: {
              type: "array",
              minItems: 1,
              maxItems: 8,
              items: kindSchema,
            },
          },
          csv: {
            type: "string",
            minLength: 1,
            maxLength: 131072,
            format: "text/csv",
          },
          parsedJson: {
            type: "string",
            minLength: 2,
            maxLength: 131072,
            format: "application/json",
          },
          parsedCells: {
            type: "array",
            maxItems: 64,
            items: {
              type: "array",
              minItems: 1,
              maxItems: 8,
              items: {
                anyOf: [{ type: "string", maxLength: 130 }, { type: "null" }],
              },
            },
          },
          skippedSingleEmptyRows: { type: "integer", minimum: 0, maximum: 64 },
          exactRoundTrip: { type: "boolean" },
        },
        required: [
          "cells",
          "cellKinds",
          "csv",
          "parsedJson",
          "parsedCells",
          "skippedSingleEmptyRows",
          "exactRoundTrip",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["headers", "cases", "randomness"],
} as const;

const isInput = (input: unknown): input is CsvQuotingEdgeCaseCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvQuotingEdgeCaseCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvQuotingEdgeCaseCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.headers).size !== input.headers.length)
      simpleError("headers", "Entries must be distinct.", "duplicate_entries");
    if (new Set(input.kinds).size !== input.kinds.length)
      simpleError("kinds", "Entries must be distinct.", "duplicate_entries");
    if (input.caseCount * input.rowCount * input.headers.length > 1024)
      simpleError(
        "caseCount",
        "The corpus is limited to 1024 generated cells.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.caseCount }, () => {
      const cellKinds: CsvEdgeCellKind[][] = [];
      const cells = Array.from({ length: input.rowCount }, () => {
        const kinds: CsvEdgeCellKind[] = [];
        cellKinds.push(kinds);
        return input.headers.map(() => {
          const kind = random.pick(input.kinds),
            fragment = random.pick(input.fragments);
          kinds.push(kind);
          return kind === "empty"
            ? ""
            : kind === "delimiter"
              ? fragment + input.delimiter + fragment
              : kind === "quote"
                ? fragment + '"' + fragment
                : kind === "lf"
                  ? fragment + "\n" + fragment
                  : kind === "crlf"
                    ? fragment + "\r\n" + fragment
                    : kind === "unicode"
                      ? fragment + "😀" + fragment
                      : fragment;
        });
      });
      const records = cells.map((row) =>
          Object.fromEntries(
            input.headers.map((header, i) => [header, row[i]]),
          ),
        ),
        csv = calculateJsonToCsv({
          json: JSON.stringify(records),
          delimiter: input.delimiter,
          hasHeader: true,
        }).csv;
      const parsedJson = calculateCsvToJson({
        csv,
        delimiter: input.delimiter,
        hasHeader: true,
        inferNumbers: false,
        indent: 0,
      }).json;
      const parsed = JSON.parse(parsedJson) as Record<string, string | null>[],
        parsedCells = parsed.map((row) =>
          input.headers.map((header) => row[header]),
        );
      const kept = cells.filter((row) => row.length !== 1 || row[0] !== ""),
        expected = kept.map((row) =>
          row.map((cell) => (cell === "" ? null : cell)),
        );
      if (JSON.stringify(parsedCells) !== JSON.stringify(expected))
        throw new Error(
          "Generated CSV cells disagreed with the documented converter round-trip conventions.",
        );
      return {
        cells,
        cellKinds,
        csv,
        parsedJson,
        parsedCells,
        skippedSingleEmptyRows: cells.length - kept.length,
        exactRoundTrip: JSON.stringify(cells) === JSON.stringify(parsedCells),
      };
    });
    return toolSuccess({
      headers: input.headers,
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvQuotingEdgeCaseCorpusExample = {
  input: {
    headers: ["a", "b"],
    fragments: ["x", "y"],
    kinds: ["delimiter", "quote", "lf", "empty"],
    delimiter: ",",
    caseCount: 1,
    rowCount: 2,
    seed: 42,
  },
  output: {
    headers: ["a", "b"],
    cases: [
      {
        cells: [
          ["x\nx", ""],
          ["y,y", 'y"y'],
        ],
        cellKinds: [
          ["lf", "empty"],
          ["delimiter", "quote"],
        ],
        csv: 'a,b\n"x\nx",\n"y,y","y""y"\n',
        parsedJson: '[{"a":"x\\nx","b":null},{"a":"y,y","b":"y\\"y"}]',
        parsedCells: [
          ["x\nx", null],
          ["y,y", 'y"y'],
        ],
        skippedSingleEmptyRows: 0,
        exactRoundTrip: false,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  CsvQuotingEdgeCaseCorpusInput,
  CsvQuotingEdgeCaseCorpusOutput
>;
export const csvQuotingEdgeCaseCorpusTool = createModelDefinition<
  CsvQuotingEdgeCaseCorpusInput,
  CsvQuotingEdgeCaseCorpusOutput
>({
  id: "random/csv-quoting-edge-case-corpus",
  title: "Random CSV Quoting Edge-Case Corpus Generator",
  description:
    "Construct cell-level delimiter, quote, LF, CRLF, Unicode, empty and unmodified CSV edge cases from text fragments, delegate JSON/CSV conversion, and retain original cells separately from parsed cells; numeric inference is off, empty cells become null, single-empty-field rows are skipped, and identifier-only headers avoid the old unquoted-header limitation.",
  inputSchema,
  outputSchema,
  execute: calculateCsvQuotingEdgeCaseCorpus,
});
export const runCsvQuotingEdgeCaseCorpus = csvQuotingEdgeCaseCorpusTool.execute;
export default csvQuotingEdgeCaseCorpusTool;
