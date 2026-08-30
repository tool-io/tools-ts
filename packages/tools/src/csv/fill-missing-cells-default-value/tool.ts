import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type FillMissingCellsDefaultValueInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly width: number;
  readonly defaultValue: string;
};
export type FillMissingCellsDefaultValueOutput = {
  readonly csv: string;
};
export const fillMissingCellsDefaultValueInputSchema = {
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
    "width": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000,
      "description": "Width"
    },
    "defaultValue": {
      "type": "string",
      "maxLength": 100000,
      "description": "Default value"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "width",
    "defaultValue"
  ]
} as const satisfies ToolJsonSchema;
export const fillMissingCellsDefaultValueOutputSchema = {
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
export const calculateFillMissingCellsDefaultValue = (rawInput: unknown): ToolResult<FillMissingCellsDefaultValueOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly width?: unknown; readonly defaultValue?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "width",
  "defaultValue"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const widthValue = candidate.width;
  if (typeof widthValue !== "number" || !Number.isSafeInteger(widthValue)) return issue("width", "invalid_type", "Enter a finite safe integer.");
  if (widthValue < 1) return issue("width", "out_of_range", "Value is outside the accepted range.");
  if (widthValue > 10000) return issue("width", "out_of_range", "Value is outside the accepted range.");
  const defaultValueValue = candidate.defaultValue;
  if (typeof defaultValueValue !== "string") return issue("defaultValue", "invalid_type", "Enter a string value.");
  if (defaultValueValue.length > 100000) return issue("defaultValue", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: FillMissingCellsDefaultValueInput = { csv: csvValue, delimiter: delimiterValue, width: widthValue, defaultValue: defaultValueValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  if (rows.some((row) => row.length > input.width)) return issue("width", "would_truncate", "Width must not remove existing fields.");
  if (rows.length * input.width > 10000) return issue("width", "resource_limit", "Padded output may contain at most 10,000 fields.");
  const missing = rows.reduce((total, row) => total + input.width - row.length, 0);
  const textLength = rows.reduce((total, row) => total + row.reduce((sum, cell) => sum + cell.length, 0), 0);
  if (textLength + missing * input.defaultValue.length > 100000) return issue("defaultValue", "resource_limit", "Padded cell text exceeds 100,000 UTF-16 code units.");
  return toolSuccess({ csv: writeCsvRecords(rows.map((row) => [...row, ...Array<string>(input.width - row.length).fill(input.defaultValue)]), input.delimiter) });
};
export const example = {
  input: {
    "csv": "a,b\nc\nd,",
    "delimiter": ",",
    "width": 2,
    "defaultValue": "NA"
  },
  output: {
    "csv": "a,b\nc,NA\nd,"
  },
} satisfies ToolExample<FillMissingCellsDefaultValueInput, FillMissingCellsDefaultValueOutput>;
export const fillMissingCellsDefaultValueTool = defineTool<FillMissingCellsDefaultValueInput, FillMissingCellsDefaultValueOutput>({
  id: "csv/fill-missing-cells-default-value",
  title: "Fill Missing Cells Default Value",
  description: "Pad short CSV records to an explicit width with a default string, preserving present empty fields and rejecting longer records; output materialization is bounded.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fillMissingCellsDefaultValueInputSchema,
  outputSchema: fillMissingCellsDefaultValueOutputSchema,
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
        "id": "width",
        "label": "Width",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "defaultValue",
        "label": "Default value",
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
  execute: calculateFillMissingCellsDefaultValue,
});
export const runFillMissingCellsDefaultValue = fillMissingCellsDefaultValueTool.execute;
export default fillMissingCellsDefaultValueTool;
