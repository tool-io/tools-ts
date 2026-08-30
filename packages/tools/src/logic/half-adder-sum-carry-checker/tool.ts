import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type HalfAdderSumCarryCheckerInput = {
  readonly a: boolean;
  readonly b: boolean;
};
export type HalfAdderSumCarryCheckerOutput = {
  readonly sum: boolean;
  readonly carry: boolean;
};
export const halfAdderSumCarryCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "a": {
      "type": "boolean",
      "description": "A"
    },
    "b": {
      "type": "boolean",
      "description": "B"
    }
  },
  "required": [
    "a",
    "b"
  ]
} as const satisfies ToolJsonSchema;
export const halfAdderSumCarryCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "sum": {
      "type": "boolean",
      "description": "Sum"
    },
    "carry": {
      "type": "boolean",
      "description": "Carry"
    }
  },
  "required": [
    "sum",
    "carry"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateHalfAdderSumCarryChecker = (rawInput: unknown): ToolResult<HalfAdderSumCarryCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly a?: unknown; readonly b?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "a",
  "b"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const aValue = candidate.a;
  if (typeof aValue !== "boolean") return issue("a", "invalid_type", "Enter a boolean value.");
  const bValue = candidate.b;
  if (typeof bValue !== "boolean") return issue("b", "invalid_type", "Enter a boolean value.");

  const input: HalfAdderSumCarryCheckerInput = { a: aValue, b: bValue };
  return toolSuccess({ sum: input.a !== input.b, carry: input.a && input.b });
};
export const example = {
  input: {
    "a": true,
    "b": true
  },
  output: {
    "sum": false,
    "carry": true
  },
} satisfies ToolExample<HalfAdderSumCarryCheckerInput, HalfAdderSumCarryCheckerOutput>;
export const halfAdderSumCarryCheckerTool = defineTool<HalfAdderSumCarryCheckerInput, HalfAdderSumCarryCheckerOutput>({
  id: "logic/half-adder-sum-carry-checker",
  title: "Half Adder Sum Carry Boolean Pair Checker",
  description: "Compute the Boolean sum and carry bits of a half adder.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: halfAdderSumCarryCheckerInputSchema,
  outputSchema: halfAdderSumCarryCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "a",
        "label": "A",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "b",
        "label": "B",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "sum",
        "label": "Sum",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "carry",
        "label": "Carry",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateHalfAdderSumCarryChecker,
});
export const runHalfAdderSumCarryChecker = halfAdderSumCarryCheckerTool.execute;
export default halfAdderSumCarryCheckerTool;
