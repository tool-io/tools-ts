import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JsonToCsvInput = {
  readonly delimiter?: string;
  readonly hasHeader?: boolean;
  readonly json: string;
};

export type JsonToCsvOutput = {
  readonly csv: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const formatCell = (value: unknown, delimiter: string): string => {
  let text: string;
  if (value === null || value === undefined) text = "";
  else if (typeof value === "string") text = value;
  else if (typeof value === "number" || typeof value === "boolean")
    text = String(value);
  else text = JSON.stringify(value);
  if (
    text.includes(delimiter) ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  )
    return `"${text.replaceAll('"', '""')}"`;
  return text;
};

/**
 * Serializes a JSON array of flat objects as RFC 4180 CSV. Columns follow
 * first-appearance order across rows; missing values become empty cells
 * and nested values are inlined as compact JSON.
 */
export const calculateJsonToCsv = (input: JsonToCsvInput): JsonToCsvOutput => {
  const delimiter = input.delimiter ?? ",";
  const hasHeader = input.hasHeader ?? true;
  let parsed: unknown;
  try {
    parsed = JSON.parse(input.json) as unknown;
  } catch {
    simpleError("json", "The text is not valid JSON.", "malformed_json");
  }
  if (!Array.isArray(parsed))
    simpleError(
      "json",
      "The JSON document must be an array.",
      "not_json_array",
    );
  const rows = parsed as unknown[];
  if (rows.length === 0)
    simpleError(
      "json",
      "The JSON array needs at least one row.",
      "empty_document",
    );
  const columns: string[] = [];
  for (const row of rows)
    if (!isRecord(row))
      simpleError("json", "Every row must be a JSON object.", "invalid_row");
    else
      for (const key of Object.keys(row))
        if (!columns.includes(key)) columns.push(key);
  const lines: string[] = [];
  if (hasHeader) lines.push(columns.join(delimiter));
  for (const row of rows as Record<string, unknown>[])
    lines.push(
      columns
        .map((column) => formatCell(row[column], delimiter))
        .join(delimiter),
    );
  return { csv: `${lines.join("\n")}\n` };
};

export const jsonToCsvExample = {
  input: { json: '[{"name":"Ada","age":36},{"name":"Grace","age":45}]' },
  output: { csv: "name,age\nAda,36\nGrace,45\n" },
} satisfies ToolExample<JsonToCsvInput, JsonToCsvOutput>;

export const jsonToCsvTool = createSimpleTool({
  calculate: (rawInput) =>
    calculateJsonToCsv({
      delimiter: rawInput.delimiter as string | undefined,
      hasHeader: rawInput.hasHeader as boolean | undefined,
      json: rawInput.json as string,
    }),
  description:
    "Convert a JSON array of objects to RFC 4180 CSV with first-seen column order and quoted escaping.",
  id: "convert/json-to-csv",
  inputs: [
    {
      description: "JSON text holding an array of flat objects.",
      id: "json",
      kind: "string",
      label: "JSON",
      format: "application/json",
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
      description: "Emit a header row built from the object keys.",
      id: "hasHeader",
      kind: "boolean",
      label: "Include header",
    },
  ],
  outputs: [
    {
      description: "CSV text with one line per record and a trailing newline.",
      format: "text/csv",
      id: "csv",
      kind: "string",
      label: "CSV",
    },
  ],
  title: "JSON to CSV Converter",
});
export const runJsonToCsv = jsonToCsvTool.execute;
export default jsonToCsvTool;
