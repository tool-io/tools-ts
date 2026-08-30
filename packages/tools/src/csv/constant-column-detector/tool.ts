import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type ConstantColumnDetectorInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type ConstantColumnDetectorOutput = {
  readonly constants: ReadonlyArray<{ readonly column: number; readonly value: string; }>;
};
export const constantColumnDetectorInputSchema = {
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
export const constantColumnDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "constants": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "column": {
            "type": "integer"
          },
          "value": {
            "type": "string"
          }
        },
        "required": [
          "column",
          "value"
        ]
      },
      "description": "Constants"
    }
  },
  "required": [
    "constants"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateConstantColumnDetector = (rawInput: unknown): ToolResult<ConstantColumnDetectorOutput> => {
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
  const input: ConstantColumnDetectorInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const constants: { column: number; value: string }[] = [];
  const first = data[0];
  if (first !== undefined) for (let column = 0; column < width; column++) {
    const value = first[column] ?? "";
    if (data.every((row) => row[column] === value)) constants.push({ column, value });
  }
  return toolSuccess({ constants });
};
export const example = {
  input: {
    "csv": "id,country,blank\n1,UK,\n2,UK,",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "constants": [
      {
        "column": 1,
        "value": "UK"
      },
      {
        "column": 2,
        "value": ""
      }
    ]
  },
} satisfies ToolExample<ConstantColumnDetectorInput, ConstantColumnDetectorOutput>;
export const constantColumnDetectorTool = defineTool<ConstantColumnDetectorInput, ConstantColumnDetectorOutput>({
  id: "csv/constant-column-detector",
  title: "Constant Column Detector",
  description: "Identify columns with one exact decoded value across all data records, excluding an explicit header; empty strings may be constant but zero observations are not evidence.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: constantColumnDetectorInputSchema,
  outputSchema: constantColumnDetectorOutputSchema,
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
        "id": "constants",
        "label": "Constants",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateConstantColumnDetector,
});
export const runConstantColumnDetector = constantColumnDetectorTool.execute;
export default constantColumnDetectorTool;
