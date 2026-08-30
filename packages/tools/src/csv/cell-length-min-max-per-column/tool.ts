import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type CellLengthMinMaxPerColumnInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type CellLengthMinMaxPerColumnOutput = {
  readonly columns: ReadonlyArray<{ readonly column: number; readonly count: number; readonly minimum: number; readonly maximum: number; }>;
};
export const cellLengthMinMaxPerColumnInputSchema = {
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
export const cellLengthMinMaxPerColumnOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "columns": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "column": {
            "type": "integer"
          },
          "count": {
            "type": "integer"
          },
          "minimum": {
            "type": "integer"
          },
          "maximum": {
            "type": "integer"
          }
        },
        "required": [
          "column",
          "count",
          "minimum",
          "maximum"
        ]
      },
      "description": "Columns"
    }
  },
  "required": [
    "columns"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180; https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype-@@iterator
export const calculateCellLengthMinMaxPerColumn = (rawInput: unknown): ToolResult<CellLengthMinMaxPerColumnOutput> => {
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
  const input: CellLengthMinMaxPerColumnInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const columns = Array.from({ length: width }, (_, column) => {
    let minimum = Infinity;
    let maximum = 0;
    for (const row of data) { const length = [...(row[column] ?? "")].length; minimum = Math.min(minimum, length); maximum = Math.max(maximum, length); }
    return { column, count: data.length, minimum: data.length === 0 ? 0 : minimum, maximum };
  });
  return toolSuccess({ columns });
};
export const example = {
  input: {
    "csv": "label\n😀\nAda",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "columns": [
      {
        "column": 0,
        "count": 2,
        "minimum": 1,
        "maximum": 3
      }
    ]
  },
} satisfies ToolExample<CellLengthMinMaxPerColumnInput, CellLengthMinMaxPerColumnOutput>;
export const cellLengthMinMaxPerColumnTool = defineTool<CellLengthMinMaxPerColumnInput, CellLengthMinMaxPerColumnOutput>({
  id: "csv/cell-length-min-max-per-column",
  title: "Cell Length Min/Max Per Column",
  description: "Measure minimum and maximum Unicode code-point lengths of decoded data cells per column, including empty strings and excluding an explicit header; zero observations return count zero.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: cellLengthMinMaxPerColumnInputSchema,
  outputSchema: cellLengthMinMaxPerColumnOutputSchema,
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
        "id": "columns",
        "label": "Columns",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateCellLengthMinMaxPerColumn,
});
export const runCellLengthMinMaxPerColumn = cellLengthMinMaxPerColumnTool.execute;
export default cellLengthMinMaxPerColumnTool;
