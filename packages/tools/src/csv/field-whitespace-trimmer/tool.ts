import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type FieldWhitespaceTrimmerInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type FieldWhitespaceTrimmerOutput = {
  readonly csv: string;
};
export const fieldWhitespaceTrimmerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "maxLength": 100000,
      "description": "CSV text"
    },
    "delimiter": {
      "type": "string",
      "enum": [
        ",",
        ";",
        "\t"
      ],
      "description": "Delimiter"
    }
  },
  "required": [
    "csv",
    "delimiter"
  ]
} as const satisfies ToolJsonSchema;
export const fieldWhitespaceTrimmerOutputSchema = {
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
export const calculateFieldWhitespaceTrimmer = (rawInput: unknown): ToolResult<FieldWhitespaceTrimmerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const input: FieldWhitespaceTrimmerInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  return toolSuccess({ csv: writeCsvRecords(rows.map((row) => row.map((cell) => cell.trim())), input.delimiter) });
};
export const example = {
  input: {
    "csv": " name , note \n Ada ,\"  a,b  \"",
    "delimiter": ","
  },
  output: {
    "csv": "name,note\nAda,\"a,b\""
  },
} satisfies ToolExample<FieldWhitespaceTrimmerInput, FieldWhitespaceTrimmerOutput>;
export const fieldWhitespaceTrimmerTool = defineTool<FieldWhitespaceTrimmerInput, FieldWhitespaceTrimmerOutput>({
  id: "csv/field-whitespace-trimmer",
  title: "Field Whitespace Trimmer",
  description: "Trim ECMAScript boundary whitespace from every decoded CSV cell and re-encode with minimal quoting and LF record endings; interior whitespace is preserved.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fieldWhitespaceTrimmerInputSchema,
  outputSchema: fieldWhitespaceTrimmerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "csv",
        "label": "CSV text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "delimiter",
        "label": "Delimiter",
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
  execute: calculateFieldWhitespaceTrimmer,
});
export const runFieldWhitespaceTrimmer = fieldWhitespaceTrimmerTool.execute;
export default fieldWhitespaceTrimmerTool;
