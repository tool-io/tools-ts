import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
import { sumColumns } from "../sum-aggregate-per-numeric-column/tool.js";
import { decimalText } from "../currency-symbol-strip-to-number/tool.js";
export type ChecksumTotalRowAppenderInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly columnIndices: ReadonlyArray<number>;
  readonly labelColumn: number;
  readonly label: string;
};
export type ChecksumTotalRowAppenderOutput = {
  readonly csv: string;
};
export const checksumTotalRowAppenderInputSchema = {
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
    },
    "labelColumn": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Label column"
    },
    "label": {
      "type": "string",
      "maxLength": 100000,
      "description": "Label"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "columnIndices",
    "labelColumn",
    "label"
  ]
} as const satisfies ToolJsonSchema;
export const checksumTotalRowAppenderOutputSchema = {
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
export const calculateChecksumTotalRowAppender = (rawInput: unknown): ToolResult<ChecksumTotalRowAppenderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly columnIndices?: unknown; readonly labelColumn?: unknown; readonly label?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "columnIndices",
  "labelColumn",
  "label"
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
  const labelColumnValue = candidate.labelColumn;
  if (typeof labelColumnValue !== "number" || !Number.isSafeInteger(labelColumnValue)) return issue("labelColumn", "invalid_type", "Enter a finite safe integer.");
  if (labelColumnValue < 0) return issue("labelColumn", "out_of_range", "Value is outside the accepted range.");
  if (labelColumnValue > 9007199254740991) return issue("labelColumn", "out_of_range", "Value is outside the accepted range.");
  const labelValue = candidate.label;
  if (typeof labelValue !== "string") return issue("label", "invalid_type", "Enter a string value.");
  if (labelValue.length > 100000) return issue("label", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: ChecksumTotalRowAppenderInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, columnIndices: validatedColumnindices, labelColumn: labelColumnValue, label: labelValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  if (input.labelColumn >= width) return issue("labelColumn", "column_range", "Label column is outside the CSV width.");
  if (input.columnIndices.includes(input.labelColumn)) return issue("labelColumn", "column_conflict", "The label column cannot also contain a numeric total.");
  if (input.columnIndices.some((column) => column >= width)) return issue("columnIndices", "column_range", "Column index is outside the CSV width.");
  if (new Set(input.columnIndices).size !== input.columnIndices.length) return issue("columnIndices", "duplicate_columns", "Choose each numeric column once.");
  const summed = sumColumns(data, input.columnIndices, header.length);
  if (!summed.ok) return issue(summed.field, summed.code, summed.message);
  const totalRow = Array<string>(width).fill("");
  totalRow[input.labelColumn] = input.label;
  for (const entry of summed.columns) totalRow[entry.column] = decimalText(entry.sum);
  if (parsed.fieldCount + width > 10000) return issue("csv", "resource_limit", "Appending totals exceeds the 10,000-field CSV limit.");
  if (input.csv.length + totalRow.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("label", "resource_limit", "Appending totals exceeds the 100,000-character CSV limit.");
  return toolSuccess({ csv: writeCsvRecords([...rows, totalRow], input.delimiter) });
};
export const example = {
  input: {
    "csv": "item,amount\na,0.1\nb,0.2",
    "delimiter": ",",
    "hasHeader": true,
    "columnIndices": [
      1
    ],
    "labelColumn": 0,
    "label": "Total"
  },
  output: {
    "csv": "item,amount\na,0.1\nb,0.2\nTotal,0.3"
  },
} satisfies ToolExample<ChecksumTotalRowAppenderInput, ChecksumTotalRowAppenderOutput>;
export const checksumTotalRowAppenderTool = defineTool<ChecksumTotalRowAppenderInput, ChecksumTotalRowAppenderOutput>({
  id: "csv/checksum-total-row-appender",
  title: "Checksum Total Row Appender",
  description: "Append one CSV total row for explicitly selected dot-decimal columns, ignoring blanks and placing a supplied label in a separate column; all totals remain exact strings.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: checksumTotalRowAppenderInputSchema,
  outputSchema: checksumTotalRowAppenderOutputSchema,
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
      },
      {
        "id": "labelColumn",
        "label": "Label column",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "label",
        "label": "Label",
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
  execute: calculateChecksumTotalRowAppender,
});
export const runChecksumTotalRowAppender = checksumTotalRowAppenderTool.execute;
export default checksumTotalRowAppenderTool;
