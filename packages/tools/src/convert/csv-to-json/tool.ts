import { CsvParseError, parseCsv } from "../../core/csv.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CsvToJsonInput = {
  readonly csv: string;
  readonly delimiter?: string;
  readonly hasHeader?: boolean;
  readonly indent?: number;
  readonly inferNumbers?: boolean;
};

export type CsvToJsonOutput = {
  readonly json: string;
};

const NUMBER_PATTERN = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/u;

export const csvToJsonExample = {
  input: { csv: "name,age\nAda,36\n" },
  output: { json: '[{"name":"Ada","age":36}]' },
} satisfies ToolExample<CsvToJsonInput, CsvToJsonOutput>;

const coerce = (cell: string, inferNumbers: boolean): unknown => {
  if (cell === "") return null;
  return inferNumbers && NUMBER_PATTERN.test(cell) ? Number(cell) : cell;
};

export const calculateCsvToJson = (input: CsvToJsonInput): CsvToJsonOutput => {
  const delimiter = input.delimiter ?? ",";
  const hasHeader = input.hasHeader ?? true;
  const inferNumbers = input.inferNumbers ?? true;
  const indent = input.indent ?? 0;
  let document;
  try {
    document = parseCsv(input.csv, { delimiter, hasHeader });
  } catch (error) {
    if (error instanceof CsvParseError)
      simpleError("csv", error.message, error.code);
    throw error;
  }
  let values: unknown;
  if (hasHeader) {
    if (!document.header)
      simpleError(
        "csv",
        "CSV input needs at least a header row.",
        "missing_header",
      );
    const header = document.header as readonly string[];
    const unique = new Set(header);
    if (unique.size !== header.length)
      simpleError(
        "csv",
        "CSV headers must not contain duplicate column names.",
        "duplicate_header",
      );
    values = document.rows.map((row) => {
      if (row.length !== header.length)
        simpleError(
          "csv",
          "Every CSV row must have the same number of cells as the header.",
          "inconsistent_row_count",
        );
      return Object.fromEntries(
        header.map((column, index) => [
          column,
          coerce(row[index]!, inferNumbers),
        ]),
      );
    });
  } else {
    if (document.rows.length === 0)
      simpleError("csv", "CSV input needs at least one row.", "empty_csv");
    values = document.rows.map((row) =>
      row.map((cell) => coerce(cell, inferNumbers)),
    );
  }
  return {
    json: indent === 0 ? JSON.stringify(values) : JSON.stringify(values, null, indent),
  };
};

export const csvToJsonTool = createSimpleTool({
  calculate: (input) => calculateCsvToJson(input as unknown as CsvToJsonInput),
  description:
    "Convert RFC 4180 CSV text to a JSON array of objects or arrays.",
  id: "convert/csv-to-json",
  inputs: [
    {
      description: "CSV text to convert.",
      id: "csv",
      kind: "string",
      label: "CSV",
    },
    {
      default: ",",
      description: "Single-character field delimiter.",
      enum: [",", ";", "\t", "|"],
      id: "delimiter",
      kind: "string",
      label: "Delimiter",
    },
    {
      default: true,
      description:
        "Treat the first row as a header; objects are keyed by it.",
      id: "hasHeader",
      kind: "boolean",
      label: "First row is header",
    },
    {
      default: 0,
      description:
        "Spaces of JSON indentation; zero produces compact JSON.",
      id: "indent",
      kind: "integer",
      label: "Indent",
      maximum: 8,
      minimum: 0,
    },
    {
      default: true,
      description:
        "Convert numeric-looking non-empty cells to numbers and empty cells to null.",
      id: "inferNumbers",
      kind: "boolean",
      label: "Infer numbers",
    },
  ],
  outputs: [
    {
      description: "Serialized JSON document.",
      format: "application/json",
      id: "json",
      kind: "string",
      label: "JSON",
    },
  ],
  title: "CSV to JSON Converter",
});
export const runCsvToJson = csvToJsonTool.execute;
export default csvToJsonTool;
