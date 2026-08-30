import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
import { parseDecimal, decimalText, compareDecimal, type ExactDecimal } from "../currency-symbol-strip-to-number/tool.js";
export type NumericRangeMinMaxPerColumnInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type NumericRangeMinMaxPerColumnOutput = {
  readonly columns: ReadonlyArray<{ readonly column: number; readonly count: number; readonly ignoredCount: number; readonly hasValues: boolean; readonly minimum: string; readonly maximum: string; }>;
};
export const numericRangeMinMaxPerColumnInputSchema = {
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
export const numericRangeMinMaxPerColumnOutputSchema = {
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
          "ignoredCount": {
            "type": "integer"
          },
          "hasValues": {
            "type": "boolean"
          },
          "minimum": {
            "type": "string"
          },
          "maximum": {
            "type": "string"
          }
        },
        "required": [
          "column",
          "count",
          "ignoredCount",
          "hasValues",
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

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateNumericRangeMinMaxPerColumn = (rawInput: unknown): ToolResult<NumericRangeMinMaxPerColumnOutput> => {
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
  const input: NumericRangeMinMaxPerColumnInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const columns = Array.from({ length: width }, (_, column) => {
    let minimum: ExactDecimal | undefined;
    let maximum: ExactDecimal | undefined;
    let count = 0;
    for (const row of data) {
      const value = parseDecimal(row[column] ?? "");
      if (value === undefined) continue;
      count++;
      if (minimum === undefined || compareDecimal(value, minimum) < 0) minimum = value;
      if (maximum === undefined || compareDecimal(value, maximum) > 0) maximum = value;
    }
    return { column, count, ignoredCount: data.length - count, hasValues: count > 0, minimum: minimum === undefined ? "" : decimalText(minimum), maximum: maximum === undefined ? "" : decimalText(maximum) };
  });
  return toolSuccess({ columns });
};
export const example = {
  input: {
    "csv": "n,label\n9007199254740993,A\n9007199254740992,B",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "columns": [
      {
        "column": 0,
        "count": 2,
        "ignoredCount": 0,
        "hasValues": true,
        "minimum": "9007199254740992",
        "maximum": "9007199254740993"
      },
      {
        "column": 1,
        "count": 0,
        "ignoredCount": 2,
        "hasValues": false,
        "minimum": "",
        "maximum": ""
      }
    ]
  },
} satisfies ToolExample<NumericRangeMinMaxPerColumnInput, NumericRangeMinMaxPerColumnOutput>;
export const numericRangeMinMaxPerColumnTool = defineTool<NumericRangeMinMaxPerColumnInput, NumericRangeMinMaxPerColumnOutput>({
  id: "csv/numeric-range-min-max-per-column",
  title: "Numeric Range Min/Max Per Column",
  description: "Find exact dot-decimal minima and maxima per data column, skipping and counting nonnumeric cells; columns with no numeric values return hasValues false and empty bounds.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: numericRangeMinMaxPerColumnInputSchema,
  outputSchema: numericRangeMinMaxPerColumnOutputSchema,
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
  execute: calculateNumericRangeMinMaxPerColumn,
});
export const runNumericRangeMinMaxPerColumn = numericRangeMinMaxPerColumnTool.execute;
export default numericRangeMinMaxPerColumnTool;
