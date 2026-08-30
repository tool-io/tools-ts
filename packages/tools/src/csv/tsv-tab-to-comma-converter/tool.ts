import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type TsvTabToCommaConverterInput = {
  readonly csv: string;
};
export type TsvTabToCommaConverterOutput = {
  readonly csv: string;
};
export const tsvTabToCommaConverterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "maxLength": 100000,
      "description": "Tab-delimited CSV text"
    }
  },
  "required": [
    "csv"
  ]
} as const satisfies ToolJsonSchema;
export const tsvTabToCommaConverterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "description": "CSV text"
    }
  },
  "required": [
    "csv"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateTsvTabToCommaConverter = (rawInput: unknown): ToolResult<TsvTabToCommaConverterOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: TsvTabToCommaConverterInput = { csv: csvValue };
  const parsed = readCsvText(input.csv, "	");
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  return toolSuccess({ csv: writeCsvRecords(parsed.records, ",") });
};
export const example = {
  input: {
    "csv": "name\tnote\nAda\ta,b"
  },
  output: {
    "csv": "name,note\nAda,\"a,b\""
  },
} satisfies ToolExample<TsvTabToCommaConverterInput, TsvTabToCommaConverterOutput>;
export const tsvTabToCommaConverterTool = defineTool<TsvTabToCommaConverterInput, TsvTabToCommaConverterOutput>({
  id: "csv/tsv-tab-to-comma-converter",
  title: "TSV Tab-to-Comma Converter",
  description: "Convert tab-delimited records using CSV double-quote rules into comma CSV with LF record endings; unquoted multiline or arbitrary TSV escape conventions are outside this profile.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: tsvTabToCommaConverterInputSchema,
  outputSchema: tsvTabToCommaConverterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "csv",
        "label": "Tab-delimited CSV text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "csv",
        "label": "CSV text",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateTsvTabToCommaConverter,
});
export const runTsvTabToCommaConverter = tsvTabToCommaConverterTool.execute;
export default tsvTabToCommaConverterTool;
