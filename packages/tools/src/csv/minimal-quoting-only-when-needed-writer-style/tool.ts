import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type MinimalQuotingOnlyWhenNeededWriterStyleInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type MinimalQuotingOnlyWhenNeededWriterStyleOutput = {
  readonly csv: string;
};
export const minimalQuotingOnlyWhenNeededWriterStyleInputSchema = {
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
export const minimalQuotingOnlyWhenNeededWriterStyleOutputSchema = {
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
export const calculateMinimalQuotingOnlyWhenNeededWriterStyle = (rawInput: unknown): ToolResult<MinimalQuotingOnlyWhenNeededWriterStyleOutput> => {
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
  const input: MinimalQuotingOnlyWhenNeededWriterStyleInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  return toolSuccess({ csv: writeCsvRecords(rows, input.delimiter) });
};
export const example = {
  input: {
    "csv": "\"Ada\",\"a,b\",\"plain\"",
    "delimiter": ","
  },
  output: {
    "csv": "Ada,\"a,b\",plain"
  },
} satisfies ToolExample<MinimalQuotingOnlyWhenNeededWriterStyleInput, MinimalQuotingOnlyWhenNeededWriterStyleOutput>;
export const minimalQuotingOnlyWhenNeededWriterStyleTool = defineTool<MinimalQuotingOnlyWhenNeededWriterStyleInput, MinimalQuotingOnlyWhenNeededWriterStyleOutput>({
  id: "csv/minimal-quoting-only-when-needed-writer-style",
  title: "Minimal Quoting Only-When-Needed Style",
  description: "Rewrite CSV using quotes only for a delimiter, double quote, or line break, additionally quoting a one-cell empty record to preserve it; use LF without a terminal newline.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: minimalQuotingOnlyWhenNeededWriterStyleInputSchema,
  outputSchema: minimalQuotingOnlyWhenNeededWriterStyleOutputSchema,
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
  execute: calculateMinimalQuotingOnlyWhenNeededWriterStyle,
});
export const runMinimalQuotingOnlyWhenNeededWriterStyle = minimalQuotingOnlyWhenNeededWriterStyleTool.execute;
export default minimalQuotingOnlyWhenNeededWriterStyleTool;
