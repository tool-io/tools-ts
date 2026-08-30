import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type FilterRowsColumnEqualsValueInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly column: number;
  readonly value: string;
};
export type FilterRowsColumnEqualsValueOutput = {
  readonly csv: string;
};
export const filterRowsColumnEqualsValueInputSchema = {
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
    "value": {
      "type": "string",
      "maxLength": 100000,
      "description": "Value"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "column",
    "value"
  ]
} as const satisfies ToolJsonSchema;
export const filterRowsColumnEqualsValueOutputSchema = {
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
export const calculateFilterRowsColumnEqualsValue = (rawInput: unknown): ToolResult<FilterRowsColumnEqualsValueOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly column?: unknown; readonly value?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "column",
  "value"
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
  const valueValue = candidate.value;
  if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
  if (valueValue.length > 100000) return issue("value", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: FilterRowsColumnEqualsValueInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, column: columnValue, value: valueValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  if (input.column >= width) return issue("column", "column_range", "Column index is outside the CSV width.");
  return toolSuccess({ csv: writeCsvRecords([...header, ...data.filter((row) => row[input.column] === input.value)], input.delimiter) });
};
export const example = {
  input: {
    "csv": "name,city\nAda,London\nGrace,New York",
    "delimiter": ",",
    "hasHeader": true,
    "column": 1,
    "value": "London"
  },
  output: {
    "csv": "name,city\nAda,London"
  },
} satisfies ToolExample<FilterRowsColumnEqualsValueInput, FilterRowsColumnEqualsValueOutput>;
export const filterRowsColumnEqualsValueTool = defineTool<FilterRowsColumnEqualsValueInput, FilterRowsColumnEqualsValueOutput>({
  id: "csv/filter-rows-column-equals-value",
  title: "Filter Rows Column Equals Value",
  description: "Keep CSV data records whose selected zero-based column exactly equals a supplied decoded string, preserving an explicit header and original record order.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: filterRowsColumnEqualsValueInputSchema,
  outputSchema: filterRowsColumnEqualsValueOutputSchema,
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
        "id": "value",
        "label": "Value",
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
  execute: calculateFilterRowsColumnEqualsValue,
});
export const runFilterRowsColumnEqualsValue = filterRowsColumnEqualsValueTool.execute;
export default filterRowsColumnEqualsValueTool;
