import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseA1, columnLetters } from "../column-letter-to-index-a1/tool.js";
export type A1RangeCellCountExpanderInput = {
  readonly range: string;
};
export type A1RangeCellCountExpanderOutput = {
  readonly cellCount: number;
  readonly addresses: ReadonlyArray<string>;
};
export const a1RangeCellCountExpanderInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "range": {
      "type": "string",
      "maxLength": 65,
      "description": "Range"
    }
  },
  "required": [
    "range"
  ]
} as const satisfies ToolJsonSchema;
export const a1RangeCellCountExpanderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "cellCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Cell count"
    },
    "addresses": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Addresses"
    }
  },
  "required": [
    "cellCount",
    "addresses"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/office/overview-of-formulas-in-excel-ecfdc708-9162-49e8-b993-c311f47ca173
export const calculateA1RangeCellCountExpander = (rawInput: unknown): ToolResult<A1RangeCellCountExpanderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly range?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "range"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const rangeValue = candidate.range;
  if (typeof rangeValue !== "string") return issue("range", "invalid_type", "Enter a string value.");
  if (rangeValue.length > 65) return issue("range", "resource_limit", "Text exceeds the 65-character resource limit.");
  const input: A1RangeCellCountExpanderInput = { range: rangeValue };
  const parts = input.range.split(":");
  const start = parseA1(parts[0] ?? "");
  const end = parseA1(parts[1] ?? "");
  if (parts.length !== 2 || start === undefined || end === undefined) return issue("range", "invalid_range", "Enter two A1 corners separated by a colon.");
  if (end.row < start.row || end.column < start.column) return issue("range", "reversed_range", "The end corner must follow the start on both axes.");
  const count = (BigInt(end.row) - BigInt(start.row) + 1n) * (BigInt(end.column) - BigInt(start.column) + 1n);
  if (count > 5000n) return issue("range", "resource_limit", "Range expansion is limited to 5,000 cells.");
  const addresses: string[] = [];
  for (let row = start.row; row <= end.row; row++) {
    for (let column = start.column; column <= end.column; column++) addresses.push(columnLetters(column) + row);
  }
  return toolSuccess({ cellCount: Number(count), addresses });
};
export const example = {
  input: {
    "range": "B2:C3"
  },
  output: {
    "cellCount": 4,
    "addresses": [
      "B2",
      "C2",
      "B3",
      "C3"
    ]
  },
} satisfies ToolExample<A1RangeCellCountExpanderInput, A1RangeCellCountExpanderOutput>;
export const a1RangeCellCountExpanderTool = defineTool<A1RangeCellCountExpanderInput, A1RangeCellCountExpanderOutput>({
  id: "csv/a1-range-cell-count-expander",
  title: "A1 Range Cell Count Expander",
  description: "Expand an ordered rectangular A1 range in row-major order into relative addresses, rejecting reversed corners and limiting materialization to 5,000 cells.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: a1RangeCellCountExpanderInputSchema,
  outputSchema: a1RangeCellCountExpanderOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "range",
        "label": "Range",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "cellCount",
        "label": "Cell count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "addresses",
        "label": "Addresses",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateA1RangeCellCountExpander,
});
export const runA1RangeCellCountExpander = a1RangeCellCountExpanderTool.execute;
export default a1RangeCellCountExpanderTool;
