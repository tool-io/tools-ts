import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type SortRowsColumnLexicographicInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly column: number;
  readonly direction: "ascending" | "descending";
};
export type SortRowsColumnLexicographicOutput = {
  readonly csv: string;
};
export const sortRowsColumnLexicographicInputSchema = {
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
export const sortRowsColumnLexicographicOutputSchema = {
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
export const calculateSortRowsColumnLexicographic = (rawInput: unknown): ToolResult<SortRowsColumnLexicographicOutput> => {
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
  const input: SortRowsColumnLexicographicInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, column: columnValue, direction: directionValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  if (input.column >= width) return issue("column", "column_range", "Column index is outside the CSV width.");
  const sorted = data.map((row, index) => ({ row, index })).sort((a, b) => {
    const left = a.row[input.column] ?? "";
    const right = b.row[input.column] ?? "";
    const order = left < right ? -1 : left > right ? 1 : 0;
    return order === 0 ? a.index - b.index : order * (input.direction === "ascending" ? 1 : -1);
  });
  return toolSuccess({ csv: writeCsvRecords([...header, ...sorted.map((entry) => entry.row)], input.delimiter) });
};
export const example = {
  input: {
    "csv": "name,id\nGrace,1\nAda,2\nAda,3",
    "delimiter": ",",
    "hasHeader": true,
    "column": 0,
    "direction": "ascending"
  },
  output: {
    "csv": "name,id\nAda,2\nAda,3\nGrace,1"
  },
} satisfies ToolExample<SortRowsColumnLexicographicInput, SortRowsColumnLexicographicOutput>;
export const sortRowsColumnLexicographicTool = defineTool<SortRowsColumnLexicographicInput, SortRowsColumnLexicographicOutput>({
  id: "csv/sort-rows-column-lexicographic",
  title: "Sort Rows Column Lexicographic",
  description: "Stably sort CSV data records by a selected column using deterministic UTF-16 code-unit ordering, with an explicit direction and header flag.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sortRowsColumnLexicographicInputSchema,
  outputSchema: sortRowsColumnLexicographicOutputSchema,
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
  execute: calculateSortRowsColumnLexicographic,
});
export const runSortRowsColumnLexicographic = sortRowsColumnLexicographicTool.execute;
export default sortRowsColumnLexicographicTool;
