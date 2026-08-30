import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { columnLetters } from "../column-letter-to-index-a1/tool.js";
export type ExcelXfd16384ColumnLimitCheckerInput = {
  readonly columnCount: number;
};
export type ExcelXfd16384ColumnLimitCheckerOutput = {
  readonly fits: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly lastColumn: string;
};
export const excelXfd16384ColumnLimitCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "columnCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Column count"
    }
  },
  "required": [
    "columnCount"
  ]
} as const satisfies ToolJsonSchema;
export const excelXfd16384ColumnLimitCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fits": {
      "type": "boolean",
      "description": "Fits"
    },
    "limit": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Limit"
    },
    "remaining": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Remaining"
    },
    "lastColumn": {
      "type": "string",
      "description": "Last column"
    }
  },
  "required": [
    "fits",
    "limit",
    "remaining",
    "lastColumn"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/excel/excel-specifications-and-limits
export const calculateExcelXfd16384ColumnLimitChecker = (rawInput: unknown): ToolResult<ExcelXfd16384ColumnLimitCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly columnCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "columnCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const columnCountValue = candidate.columnCount;
  if (typeof columnCountValue !== "number" || !Number.isSafeInteger(columnCountValue)) return issue("columnCount", "invalid_type", "Enter a finite safe integer.");
  if (columnCountValue < 0) return issue("columnCount", "out_of_range", "Value is outside the accepted range.");
  if (columnCountValue > 9007199254740991) return issue("columnCount", "out_of_range", "Value is outside the accepted range.");
  const input: ExcelXfd16384ColumnLimitCheckerInput = { columnCount: columnCountValue };
  return toolSuccess({ fits: input.columnCount <= 16384, limit: 16384, remaining: Math.max(0, 16384 - input.columnCount), lastColumn: input.columnCount === 0 ? "" : columnLetters(input.columnCount) });
};
export const example = {
  input: {
    "columnCount": 16384
  },
  output: {
    "fits": true,
    "limit": 16384,
    "remaining": 0,
    "lastColumn": "XFD"
  },
} satisfies ToolExample<ExcelXfd16384ColumnLimitCheckerInput, ExcelXfd16384ColumnLimitCheckerOutput>;
export const excelXfd16384ColumnLimitCheckerTool = defineTool<ExcelXfd16384ColumnLimitCheckerInput, ExcelXfd16384ColumnLimitCheckerOutput>({
  id: "csv/excel-xfd-16384-column-limit-checker",
  title: "Excel XFD 16,384-Column Limit Check",
  description: "Check a worksheet column count against Excel’s XFD boundary of 16,384 columns, returning remaining capacity and a generalized A1 name for the last column.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: excelXfd16384ColumnLimitCheckerInputSchema,
  outputSchema: excelXfd16384ColumnLimitCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "columnCount",
        "label": "Column count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "fits",
        "label": "Fits",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "limit",
        "label": "Limit",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "remaining",
        "label": "Remaining",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "lastColumn",
        "label": "Last column",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateExcelXfd16384ColumnLimitChecker,
});
export const runExcelXfd16384ColumnLimitChecker = excelXfd16384ColumnLimitCheckerTool.execute;
export default excelXfd16384ColumnLimitCheckerTool;
