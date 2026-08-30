import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type QuotedMultilineSafeSplitterInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type QuotedMultilineSafeSplitterOutput = {
  readonly records: ReadonlyArray<string>;
};
export const quotedMultilineSafeSplitterInputSchema = {
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
export const quotedMultilineSafeSplitterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "records": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Records"
    }
  },
  "required": [
    "records"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateQuotedMultilineSafeSplitter = (rawInput: unknown): ToolResult<QuotedMultilineSafeSplitterOutput> => {
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
  const input: QuotedMultilineSafeSplitterInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  return toolSuccess({ records: parsed.rawRecords });
};
export const example = {
  input: {
    "csv": "a,b\r\n\"x\r\ny\",z\r\n",
    "delimiter": ","
  },
  output: {
    "records": [
      "a,b",
      "\"x\r\ny\",z"
    ]
  },
} satisfies ToolExample<QuotedMultilineSafeSplitterInput, QuotedMultilineSafeSplitterOutput>;
export const quotedMultilineSafeSplitterTool = defineTool<QuotedMultilineSafeSplitterInput, QuotedMultilineSafeSplitterOutput>({
  id: "csv/quoted-multiline-safe-splitter",
  title: "Quoted Multiline Safe Splitter",
  description: "Split CSV into raw record fragments without outer record endings, preserving quote spelling, embedded line endings, blank records, and escaped quote pairs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: quotedMultilineSafeSplitterInputSchema,
  outputSchema: quotedMultilineSafeSplitterOutputSchema,
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
        "id": "records",
        "label": "Records",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateQuotedMultilineSafeSplitter,
});
export const runQuotedMultilineSafeSplitter = quotedMultilineSafeSplitterTool.execute;
export default quotedMultilineSafeSplitterTool;
