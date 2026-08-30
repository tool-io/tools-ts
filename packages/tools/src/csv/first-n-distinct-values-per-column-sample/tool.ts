import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type FirstNDistinctValuesPerColumnSampleInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly count: number;
};
export type FirstNDistinctValuesPerColumnSampleOutput = {
  readonly columns: ReadonlyArray<{ readonly column: number; readonly distinctCount: number; readonly values: ReadonlyArray<string>; readonly truncated: boolean; }>;
};
export const firstNDistinctValuesPerColumnSampleInputSchema = {
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
    },
    "count": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10000,
      "description": "Count"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "count"
  ]
} as const satisfies ToolJsonSchema;
export const firstNDistinctValuesPerColumnSampleOutputSchema = {
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
          "distinctCount": {
            "type": "integer"
          },
          "values": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "truncated": {
            "type": "boolean"
          }
        },
        "required": [
          "column",
          "distinctCount",
          "values",
          "truncated"
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

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateFirstNDistinctValuesPerColumnSample = (rawInput: unknown): ToolResult<FirstNDistinctValuesPerColumnSampleOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly count?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "count"
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
  const countValue = candidate.count;
  if (typeof countValue !== "number" || !Number.isSafeInteger(countValue)) return issue("count", "invalid_type", "Enter a finite safe integer.");
  if (countValue < 0) return issue("count", "out_of_range", "Value is outside the accepted range.");
  if (countValue > 10000) return issue("count", "out_of_range", "Value is outside the accepted range.");
  const input: FirstNDistinctValuesPerColumnSampleInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, count: countValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const columns = Array.from({ length: width }, (_, column) => {
    const distinct = [...new Set(data.map((row) => row[column] ?? ""))];
    return { column, distinctCount: distinct.length, values: distinct.slice(0, input.count), truncated: distinct.length > input.count };
  });
  return toolSuccess({ columns });
};
export const example = {
  input: {
    "csv": "color\nred\nblue\nred\ngreen",
    "delimiter": ",",
    "hasHeader": true,
    "count": 2
  },
  output: {
    "columns": [
      {
        "column": 0,
        "distinctCount": 3,
        "values": [
          "red",
          "blue"
        ],
        "truncated": true
      }
    ]
  },
} satisfies ToolExample<FirstNDistinctValuesPerColumnSampleInput, FirstNDistinctValuesPerColumnSampleOutput>;
export const firstNDistinctValuesPerColumnSampleTool = defineTool<FirstNDistinctValuesPerColumnSampleInput, FirstNDistinctValuesPerColumnSampleOutput>({
  id: "csv/first-n-distinct-values-per-column-sample",
  title: "First-N Distinct Values Per Column",
  description: "Sample the first N distinct decoded data values per column in encounter order, counting empty strings as values and reporting the full distinct count.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: firstNDistinctValuesPerColumnSampleInputSchema,
  outputSchema: firstNDistinctValuesPerColumnSampleOutputSchema,
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
      },
      {
        "id": "count",
        "label": "Count",
        "required": true,
        "valueType": {
          "type": "integer"
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
  execute: calculateFirstNDistinctValuesPerColumnSample,
});
export const runFirstNDistinctValuesPerColumnSample = firstNDistinctValuesPerColumnSampleTool.execute;
export default firstNDistinctValuesPerColumnSampleTool;
