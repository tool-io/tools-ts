import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
import { parseDecimal, compareDecimal } from "../currency-symbol-strip-to-number/tool.js";
export type FilterRowsNumericGreaterThresholdInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly column: number;
  readonly threshold: string;
};
export type FilterRowsNumericGreaterThresholdOutput = {
  readonly csv: string;
};
export const filterRowsNumericGreaterThresholdInputSchema = {
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
    "threshold": {
      "type": "string",
      "maxLength": 200,
      "description": "Threshold"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "column",
    "threshold"
  ]
} as const satisfies ToolJsonSchema;
export const filterRowsNumericGreaterThresholdOutputSchema = {
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
export const calculateFilterRowsNumericGreaterThreshold = (rawInput: unknown): ToolResult<FilterRowsNumericGreaterThresholdOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly column?: unknown; readonly threshold?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "column",
  "threshold"
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
  const thresholdValue = candidate.threshold;
  if (typeof thresholdValue !== "string") return issue("threshold", "invalid_type", "Enter a string value.");
  if (thresholdValue.length > 200) return issue("threshold", "resource_limit", "Text exceeds the 200-character resource limit.");
  const input: FilterRowsNumericGreaterThresholdInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, column: columnValue, threshold: thresholdValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  if (input.column >= width) return issue("column", "column_range", "Column index is outside the CSV width.");
  const threshold = parseDecimal(input.threshold);
  if (threshold === undefined) return issue("threshold", "invalid_decimal", "Enter a dot decimal without grouping.");
  const selected: ReadonlyArray<string>[] = [];
  for (const [index, row] of data.entries()) {
    const value = parseDecimal(row[input.column] ?? "");
    if (value === undefined) return issue(`csv.${index + header.length}.${input.column}`, "invalid_decimal", "Numeric filtering requires valid dot-decimal cells.");
    if (compareDecimal(value, threshold) > 0) selected.push(row);
  }
  return toolSuccess({ csv: writeCsvRecords([...header, ...selected], input.delimiter) });
};
export const example = {
  input: {
    "csv": "id,amount\na,9007199254740993\nb,9007199254740992",
    "delimiter": ",",
    "hasHeader": true,
    "column": 1,
    "threshold": "9007199254740992"
  },
  output: {
    "csv": "id,amount\na,9007199254740993"
  },
} satisfies ToolExample<FilterRowsNumericGreaterThresholdInput, FilterRowsNumericGreaterThresholdOutput>;
export const filterRowsNumericGreaterThresholdTool = defineTool<FilterRowsNumericGreaterThresholdInput, FilterRowsNumericGreaterThresholdOutput>({
  id: "csv/filter-rows-numeric-greater-threshold",
  title: "Filter Rows Numeric > Threshold",
  description: "Keep CSV data rows whose selected column is strictly greater than an exact dot-decimal threshold; malformed numeric cells fail instead of being rounded or ignored.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: filterRowsNumericGreaterThresholdInputSchema,
  outputSchema: filterRowsNumericGreaterThresholdOutputSchema,
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
        "id": "threshold",
        "label": "Threshold",
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
  execute: calculateFilterRowsNumericGreaterThreshold,
});
export const runFilterRowsNumericGreaterThreshold = filterRowsNumericGreaterThresholdTool.execute;
export default filterRowsNumericGreaterThresholdTool;
