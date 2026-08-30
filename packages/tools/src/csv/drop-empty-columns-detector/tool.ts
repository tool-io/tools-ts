import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type DropEmptyColumnsDetectorInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type DropEmptyColumnsDetectorOutput = {
  readonly columnIndices: ReadonlyArray<number>;
};
export const dropEmptyColumnsDetectorInputSchema = {
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
export const dropEmptyColumnsDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "columnIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Column indices"
    }
  },
  "required": [
    "columnIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateDropEmptyColumnsDetector = (rawInput: unknown): ToolResult<DropEmptyColumnsDetectorOutput> => {
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
  const input: DropEmptyColumnsDetectorInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const columnIndices: number[] = [];
  for (let column = 0; column < width; column++) if (data.length > 0 && data.every((row) => row[column] === "")) columnIndices.push(column);
  return toolSuccess({ columnIndices });
};
export const example = {
  input: {
    "csv": "id,unused,note\n1,, \n2,,x",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "columnIndices": [
      1
    ]
  },
} satisfies ToolExample<DropEmptyColumnsDetectorInput, DropEmptyColumnsDetectorOutput>;
export const dropEmptyColumnsDetectorTool = defineTool<DropEmptyColumnsDetectorInput, DropEmptyColumnsDetectorOutput>({
  id: "csv/drop-empty-columns-detector",
  title: "Drop Empty Columns Detector",
  description: "Identify zero-based columns whose every data cell is exactly empty, excluding an explicit header; no columns are inferred empty when there are no data records.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dropEmptyColumnsDetectorInputSchema,
  outputSchema: dropEmptyColumnsDetectorOutputSchema,
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
        "id": "columnIndices",
        "label": "Column indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateDropEmptyColumnsDetector,
});
export const runDropEmptyColumnsDetector = dropEmptyColumnsDetectorTool.execute;
export default dropEmptyColumnsDetectorTool;
