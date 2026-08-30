import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
import { parseDecimal, compareDecimal, type ExactDecimal } from "../currency-symbol-strip-to-number/tool.js";
export type SortRowsColumnNumericEuDecimalAwareInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly column: number;
  readonly direction: "ascending" | "descending";
};
export type SortRowsColumnNumericEuDecimalAwareOutput = {
  readonly csv: string;
};
export const sortRowsColumnNumericEuDecimalAwareInputSchema = {
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
    "column": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Column"
    },
    "direction": {
      "type": "string",
      "enum": [
        "ascending",
        "descending"
      ],
      "description": "Direction"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "column",
    "direction"
  ]
} as const satisfies ToolJsonSchema;
export const sortRowsColumnNumericEuDecimalAwareOutputSchema = {
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
export const calculateSortRowsColumnNumericEuDecimalAware = (rawInput: unknown): ToolResult<SortRowsColumnNumericEuDecimalAwareOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly column?: unknown; readonly direction?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "column",
  "direction"
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
  const columnValue = candidate.column;
  if (typeof columnValue !== "number" || !Number.isSafeInteger(columnValue)) return issue("column", "invalid_type", "Enter a finite safe integer.");
  if (columnValue < 0) return issue("column", "out_of_range", "Value is outside the accepted range.");
  if (columnValue > 9007199254740991) return issue("column", "out_of_range", "Value is outside the accepted range.");
  const directionValue = candidate.direction;
  if (typeof directionValue !== "string") return issue("direction", "invalid_type", "Enter a string value.");
  if (directionValue !== "ascending" && directionValue !== "descending") return issue("direction", "invalid_value", "Choose a supported value.");
  const input: SortRowsColumnNumericEuDecimalAwareInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, column: columnValue, direction: directionValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  if (input.column >= width) return issue("column", "column_range", "Column index is outside the CSV width.");
  const decorated: { row: ReadonlyArray<string>; index: number; value: ExactDecimal }[] = [];
  for (const [index, row] of data.entries()) {
    const value = parseDecimal(row[input.column] ?? "", ",", ".");
    if (value === undefined) return issue(`csv.${index + header.length}.${input.column}`, "invalid_decimal", "Use comma decimals and valid optional dot grouping.");
    decorated.push({ row, index, value });
  }
  decorated.sort((a, b) => { const order = compareDecimal(a.value, b.value); return order === 0 ? a.index - b.index : order * (input.direction === "ascending" ? 1 : -1); });
  return toolSuccess({ csv: writeCsvRecords([...header, ...decorated.map((entry) => entry.row)], input.delimiter) });
};
export const example = {
  input: {
    "csv": "id;amount\na;1.234,50\nb;9,75\nc;9,750",
    "delimiter": ";",
    "hasHeader": true,
    "column": 1,
    "direction": "ascending"
  },
  output: {
    "csv": "id;amount\nb;9,75\nc;9,750\na;1.234,50"
  },
} satisfies ToolExample<SortRowsColumnNumericEuDecimalAwareInput, SortRowsColumnNumericEuDecimalAwareOutput>;
export const sortRowsColumnNumericEuDecimalAwareTool = defineTool<SortRowsColumnNumericEuDecimalAwareInput, SortRowsColumnNumericEuDecimalAwareOutput>({
  id: "csv/sort-rows-column-numeric-eu-decimal-aware",
  title: "Numeric Sort EU Decimal-Aware",
  description: "Stably sort rectangular CSV rows by exact numbers using comma decimals and optional dot groups of three, preserving original cell spelling and an explicit header.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sortRowsColumnNumericEuDecimalAwareInputSchema,
  outputSchema: sortRowsColumnNumericEuDecimalAwareOutputSchema,
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
        "id": "column",
        "label": "Column",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "direction",
        "label": "Direction",
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
  execute: calculateSortRowsColumnNumericEuDecimalAware,
});
export const runSortRowsColumnNumericEuDecimalAware = sortRowsColumnNumericEuDecimalAwareTool.execute;
export default sortRowsColumnNumericEuDecimalAwareTool;
