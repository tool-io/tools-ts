import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TruthTableRowCount2nInput = {
  readonly variableCount: number;
};
export type TruthTableRowCount2nOutput = {
  readonly rowCount: string;
};
export const truthTableRowCount2nInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "variableCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10000,
      "description": "Propositional variable count"
    }
  },
  "required": [
    "variableCount"
  ]
} as const satisfies ToolJsonSchema;
export const truthTableRowCount2nOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rowCount": {
      "type": "string",
      "description": "Exact row count"
    }
  },
  "required": [
    "rowCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateTruthTableRowCount2n = (rawInput: unknown): ToolResult<TruthTableRowCount2nOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly variableCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "variableCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const variableCountValue = candidate.variableCount;
  if (typeof variableCountValue !== "number" || !Number.isSafeInteger(variableCountValue)) return issue("variableCount", "invalid_type", "Enter a finite safe integer.");
  if (variableCountValue < 0) return issue("variableCount", "out_of_range", "Value is outside the accepted range.");
  if (variableCountValue > 10000) return issue("variableCount", "out_of_range", "Value is outside the accepted range.");

  const input: TruthTableRowCount2nInput = { variableCount: variableCountValue };
  return toolSuccess({ rowCount: (1n << BigInt(input.variableCount)).toString() });
};
export const example = {
  input: {
    "variableCount": 3
  },
  output: {
    "rowCount": "8"
  },
} satisfies ToolExample<TruthTableRowCount2nInput, TruthTableRowCount2nOutput>;
export const truthTableRowCount2nTool = defineTool<TruthTableRowCount2nInput, TruthTableRowCount2nOutput>({
  id: "logic/truth-table-row-count-2n",
  title: "Truth Table Row Count 2^n Calculator",
  description: "Return the exact number of rows in a truth table with zero through 10,000 propositional variables.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: truthTableRowCount2nInputSchema,
  outputSchema: truthTableRowCount2nOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "variableCount",
        "label": "Propositional variable count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "rowCount",
        "label": "Exact row count",
        "valueType": {
          "type": "string",
          "format": "integer-decimal"
        }
      }
    ]
  },
  execute: calculateTruthTableRowCount2n,
});
export const runTruthTableRowCount2n = truthTableRowCount2nTool.execute;
export default truthTableRowCount2nTool;
