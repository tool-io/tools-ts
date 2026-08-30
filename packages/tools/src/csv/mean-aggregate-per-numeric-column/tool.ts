import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
import { sumColumns } from "../sum-aggregate-per-numeric-column/tool.js";
import { extendedEuclid } from "../../math/extended-euclidean-coefficients/tool.js";
export type MeanAggregatePerNumericColumnInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly columnIndices: ReadonlyArray<number>;
};
export type MeanAggregatePerNumericColumnOutput = {
  readonly columns: ReadonlyArray<{ readonly column: number; readonly count: number; readonly hasValues: boolean; readonly numerator: string; readonly denominator: string; }>;
};
export const meanAggregatePerNumericColumnInputSchema = {
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
    "columnIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Column indices"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "columnIndices"
  ]
} as const satisfies ToolJsonSchema;
export const meanAggregatePerNumericColumnOutputSchema = {
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
          "hasValues": {
            "type": "boolean"
          },
          "numerator": {
            "type": "string"
          },
          "denominator": {
            "type": "string"
          }
        },
        "required": [
          "column",
          "count",
          "hasValues",
          "numerator",
          "denominator"
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
export const calculateMeanAggregatePerNumericColumn = (rawInput: unknown): ToolResult<MeanAggregatePerNumericColumnOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly columnIndices?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "columnIndices"
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
  const columnIndicesValue = candidate.columnIndices;
  if (!Array.isArray(columnIndicesValue)) return issue("columnIndices", "invalid_type", "Enter a dense array.");
  if (columnIndicesValue.length < 0) return issue("columnIndices", "out_of_range", "Too few entries.");
  if (columnIndicesValue.length > 10000) return issue("columnIndices", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedColumnindices: number[] = [];
  for (let index = 0; index < columnIndicesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(columnIndicesValue, index)) return issue(`columnIndices.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = columnIndicesValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`columnIndices.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`columnIndices.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedColumnindices.push(item);
  }
  const input: MeanAggregatePerNumericColumnInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, columnIndices: validatedColumnindices };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  if (input.columnIndices.some((column) => column >= width)) return issue("columnIndices", "column_range", "Column index is outside the CSV width.");
  if (new Set(input.columnIndices).size !== input.columnIndices.length) return issue("columnIndices", "duplicate_columns", "Choose each numeric column once.");
  const summed = sumColumns(data, input.columnIndices, header.length);
  if (!summed.ok) return issue(summed.field, summed.code, summed.message);
  const columns = summed.columns.map(({ column, count, sum }) => {
    if (count === 0) return { column, count, hasValues: false, numerator: "0", denominator: "1" };
    const denominator = 10n ** BigInt(sum.scale) * BigInt(count);
    const gcd = extendedEuclid(sum.coefficient, denominator).gcd;
    return { column, count, hasValues: true, numerator: (sum.coefficient / gcd).toString(), denominator: (denominator / gcd).toString() };
  });
  return toolSuccess({ columns });
};
export const example = {
  input: {
    "csv": "value\n1\n0\n0",
    "delimiter": ",",
    "hasHeader": true,
    "columnIndices": [
      0
    ]
  },
  output: {
    "columns": [
      {
        "column": 0,
        "count": 3,
        "hasValues": true,
        "numerator": "1",
        "denominator": "3"
      }
    ]
  },
} satisfies ToolExample<MeanAggregatePerNumericColumnInput, MeanAggregatePerNumericColumnOutput>;
export const meanAggregatePerNumericColumnTool = defineTool<MeanAggregatePerNumericColumnInput, MeanAggregatePerNumericColumnOutput>({
  id: "csv/mean-aggregate-per-numeric-column",
  title: "Mean Aggregate Per Numeric Column",
  description: "Compute exact means for explicit dot-decimal CSV columns as reduced numerator/denominator strings, ignoring blanks; count zero and hasValues false identify absent means.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: meanAggregatePerNumericColumnInputSchema,
  outputSchema: meanAggregatePerNumericColumnOutputSchema,
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
        "id": "columnIndices",
        "label": "Column indices",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
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
  execute: calculateMeanAggregatePerNumericColumn,
});
export const runMeanAggregatePerNumericColumn = meanAggregatePerNumericColumnTool.execute;
export default meanAggregatePerNumericColumnTool;
