import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { truthColumnSize } from "../tautology-all-true-checker/tool.js";
export type EquivalenceBiconditionalMatchCheckerInput = {
  readonly left: ReadonlyArray<boolean>;
  readonly right: ReadonlyArray<boolean>;
};
export type EquivalenceBiconditionalMatchCheckerOutput = {
  readonly equivalent: boolean;
};
export const equivalenceBiconditionalMatchCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "left": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 1,
      "maxItems": 4096,
      "description": "Left truth column"
    },
    "right": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 1,
      "maxItems": 4096,
      "description": "Right truth column"
    }
  },
  "required": [
    "left",
    "right"
  ]
} as const satisfies ToolJsonSchema;
export const equivalenceBiconditionalMatchCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "equivalent": {
      "type": "boolean",
      "description": "Equivalent"
    }
  },
  "required": [
    "equivalent"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateEquivalenceBiconditionalMatchChecker = (rawInput: unknown): ToolResult<EquivalenceBiconditionalMatchCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly left?: unknown; readonly right?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "left",
  "right"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const leftValue = candidate.left;
  if (!Array.isArray(leftValue)) return issue("left", "invalid_type", "Enter a dense array.");
  if (leftValue.length < 1) return issue("left", "out_of_range", "Too few entries.");
  if (leftValue.length > 4096) return issue("left", "resource_limit", "Array exceeds the 4096-entry resource limit.");
  const validatedLeft: boolean[] = [];
  for (let index = 0; index < leftValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(leftValue, index)) return issue(`left.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = leftValue[index];
    if (typeof item !== "boolean") return issue(`left.${index}`, "invalid_type", "Enter a boolean value.");
    validatedLeft.push(item);
  }
  const rightValue = candidate.right;
  if (!Array.isArray(rightValue)) return issue("right", "invalid_type", "Enter a dense array.");
  if (rightValue.length < 1) return issue("right", "out_of_range", "Too few entries.");
  if (rightValue.length > 4096) return issue("right", "resource_limit", "Array exceeds the 4096-entry resource limit.");
  const validatedRight: boolean[] = [];
  for (let index = 0; index < rightValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(rightValue, index)) return issue(`right.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = rightValue[index];
    if (typeof item !== "boolean") return issue(`right.${index}`, "invalid_type", "Enter a boolean value.");
    validatedRight.push(item);
  }

  const input: EquivalenceBiconditionalMatchCheckerInput = { left: validatedLeft, right: validatedRight };
  if (!truthColumnSize(input.left.length)) return issue("left", "incomplete_table", "A complete truth column has a positive power-of-two row count.");
  if (input.left.length !== input.right.length) return issue("right", "length_mismatch", "Truth columns must describe the same ordered valuations.");
  return toolSuccess({ equivalent: input.left.every((value, index) => value === input.right[index]) });
};
export const example = {
  input: {
    "left": [
      false,
      true
    ],
    "right": [
      false,
      true
    ]
  },
  output: {
    "equivalent": true
  },
} satisfies ToolExample<EquivalenceBiconditionalMatchCheckerInput, EquivalenceBiconditionalMatchCheckerOutput>;
export const equivalenceBiconditionalMatchCheckerTool = defineTool<EquivalenceBiconditionalMatchCheckerInput, EquivalenceBiconditionalMatchCheckerOutput>({
  id: "logic/equivalence-biconditional-match-checker",
  title: "Logical Equivalence Biconditional Row Match Checker",
  description: "Test logical equivalence of two complete truth columns with the same valuation order.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: equivalenceBiconditionalMatchCheckerInputSchema,
  outputSchema: equivalenceBiconditionalMatchCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "left",
        "label": "Left truth column",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "right",
        "label": "Right truth column",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "equivalent",
        "label": "Equivalent",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateEquivalenceBiconditionalMatchChecker,
});
export const runEquivalenceBiconditionalMatchChecker = equivalenceBiconditionalMatchCheckerTool.execute;
export default equivalenceBiconditionalMatchCheckerTool;
