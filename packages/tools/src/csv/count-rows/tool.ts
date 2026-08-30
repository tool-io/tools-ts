import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type CountRowsInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type CountRowsOutput = {
  readonly recordCount: number;
  readonly dataRowCount: number;
};
export const countRowsInputSchema = {
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
    },
    "hasHeader": {
      "type": "boolean",
      "description": "Has header"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader"
  ]
} as const satisfies ToolJsonSchema;
export const countRowsOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "recordCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Record count"
    },
    "dataRowCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Data row count"
    }
  },
  "required": [
    "recordCount",
    "dataRowCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateCountRows = (rawInput: unknown): ToolResult<CountRowsOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const hasHeaderValue = candidate.hasHeader;
  if (typeof hasHeaderValue !== "boolean") return issue("hasHeader", "invalid_type", "Enter a boolean value.");
  const input: CountRowsInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  return toolSuccess({ recordCount: rows.length, dataRowCount: data.length });
};
export const example = {
  input: {
    "csv": "name,note\nAda,\"one\ntwo\"",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "recordCount": 2,
    "dataRowCount": 1
  },
} satisfies ToolExample<CountRowsInput, CountRowsOutput>;
export const countRowsTool = defineTool<CountRowsInput, CountRowsOutput>({
  id: "csv/count-rows",
  title: "CSV Row Counter",
  description: "Count CSV records including blank records and quoted multiline fields, with an explicit header flag; physical lines are not records.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: countRowsInputSchema,
  outputSchema: countRowsOutputSchema,
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
      },
      {
        "id": "hasHeader",
        "label": "Has header",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "recordCount",
        "label": "Record count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "dataRowCount",
        "label": "Data row count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateCountRows,
});
export const runCountRows = countRowsTool.execute;
export default countRowsTool;
