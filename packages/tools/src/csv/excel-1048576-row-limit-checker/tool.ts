import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Excel1048576RowLimitCheckerInput = {
  readonly totalRows: number;
};
export type Excel1048576RowLimitCheckerOutput = {
  readonly fits: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly excess: number;
};
export const excel1048576RowLimitCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "totalRows": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Total rows"
    }
  },
  "required": [
    "totalRows"
  ]
} as const satisfies ToolJsonSchema;
export const excel1048576RowLimitCheckerOutputSchema = {
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
    "excess": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Excess"
    }
  },
  "required": [
    "fits",
    "limit",
    "remaining",
    "excess"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/excel/excel-specifications-and-limits
export const calculateExcel1048576RowLimitChecker = (rawInput: unknown): ToolResult<Excel1048576RowLimitCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly totalRows?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "totalRows"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const totalRowsValue = candidate.totalRows;
  if (typeof totalRowsValue !== "number" || !Number.isSafeInteger(totalRowsValue)) return issue("totalRows", "invalid_type", "Enter a finite safe integer.");
  if (totalRowsValue < 0) return issue("totalRows", "out_of_range", "Value is outside the accepted range.");
  if (totalRowsValue > 9007199254740991) return issue("totalRows", "out_of_range", "Value is outside the accepted range.");
  const input: Excel1048576RowLimitCheckerInput = { totalRows: totalRowsValue };
  return toolSuccess({ fits: input.totalRows <= 1048576, limit: 1048576, remaining: Math.max(0, 1048576 - input.totalRows), excess: Math.max(0, input.totalRows - 1048576) });
};
export const example = {
  input: {
    "totalRows": 1000000
  },
  output: {
    "fits": true,
    "limit": 1048576,
    "remaining": 48576,
    "excess": 0
  },
} satisfies ToolExample<Excel1048576RowLimitCheckerInput, Excel1048576RowLimitCheckerOutput>;
export const excel1048576RowLimitCheckerTool = defineTool<Excel1048576RowLimitCheckerInput, Excel1048576RowLimitCheckerOutput>({
  id: "csv/excel-1048576-row-limit-checker",
  title: "Excel 1,048,576-Row Limit Check",
  description: "Check a total row count, including headers, against the 1,048,576-row limit of modern Excel worksheets and report remaining capacity or excess rows.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: excel1048576RowLimitCheckerInputSchema,
  outputSchema: excel1048576RowLimitCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "totalRows",
        "label": "Total rows",
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
        "id": "excess",
        "label": "Excess",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateExcel1048576RowLimitChecker,
});
export const runExcel1048576RowLimitChecker = excel1048576RowLimitCheckerTool.execute;
export default excel1048576RowLimitCheckerTool;
