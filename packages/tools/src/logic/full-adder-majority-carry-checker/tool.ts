import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FullAdderMajorityCarryCheckerInput = {
  readonly a: boolean;
  readonly b: boolean;
  readonly carryIn: boolean;
};
export type FullAdderMajorityCarryCheckerOutput = {
  readonly sum: boolean;
  readonly carryOut: boolean;
};
export const fullAdderMajorityCarryCheckerInputSchema = {
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
    },
    "carryIn": {
      "type": "boolean",
      "description": "Carry In"
    }
  },
  "required": [
    "a",
    "b",
    "carryIn"
  ]
} as const satisfies ToolJsonSchema;
export const fullAdderMajorityCarryCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "sum": {
      "type": "boolean",
      "description": "Sum"
    },
    "carryOut": {
      "type": "boolean",
      "description": "Carry Out"
    }
  },
  "required": [
    "sum",
    "carryOut"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateFullAdderMajorityCarryChecker = (rawInput: unknown): ToolResult<FullAdderMajorityCarryCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly a?: unknown; readonly b?: unknown; readonly carryIn?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "a",
  "b",
  "carryIn"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const aValue = candidate.a;
  if (typeof aValue !== "boolean") return issue("a", "invalid_type", "Enter a boolean value.");
  const bValue = candidate.b;
  if (typeof bValue !== "boolean") return issue("b", "invalid_type", "Enter a boolean value.");
  const carryInValue = candidate.carryIn;
  if (typeof carryInValue !== "boolean") return issue("carryIn", "invalid_type", "Enter a boolean value.");

  const input: FullAdderMajorityCarryCheckerInput = { a: aValue, b: bValue, carryIn: carryInValue };
  const total = Number(input.a) + Number(input.b) + Number(input.carryIn);
  return toolSuccess({ sum: total % 2 === 1, carryOut: total >= 2 });
};
export const example = {
  input: {
    "a": true,
    "b": true,
    "carryIn": true
  },
  output: {
    "sum": true,
    "carryOut": true
  },
} satisfies ToolExample<FullAdderMajorityCarryCheckerInput, FullAdderMajorityCarryCheckerOutput>;
export const fullAdderMajorityCarryCheckerTool = defineTool<FullAdderMajorityCarryCheckerInput, FullAdderMajorityCarryCheckerOutput>({
  id: "logic/full-adder-majority-carry-checker",
  title: "Full Adder Majority Carry Expression Checker",
  description: "Compute the Boolean sum and majority carry bits of a full adder with a carry input.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fullAdderMajorityCarryCheckerInputSchema,
  outputSchema: fullAdderMajorityCarryCheckerOutputSchema,
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
      },
      {
        "id": "carryIn",
        "label": "Carry In",
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
        "id": "carryOut",
        "label": "Carry Out",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateFullAdderMajorityCarryChecker,
});
export const runFullAdderMajorityCarryChecker = fullAdderMajorityCarryCheckerTool.execute;
export default fullAdderMajorityCarryCheckerTool;
