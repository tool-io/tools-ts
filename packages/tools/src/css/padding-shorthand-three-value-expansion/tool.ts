import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PaddingShorthandThreeValueExpansionInput = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
};
export type PaddingShorthandThreeValueExpansionOutput = {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};
export const paddingShorthandThreeValueExpansionInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "first": {
      "type": "number",
      "minimum": 0,
      "description": "First padding"
    },
    "second": {
      "type": "number",
      "minimum": 0,
      "description": "Second padding"
    },
    "third": {
      "type": "number",
      "minimum": 0,
      "description": "Third padding"
    }
  },
  "required": [
    "first",
    "second",
    "third"
  ]
} as const satisfies ToolJsonSchema;
export const paddingShorthandThreeValueExpansionOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "top": {
      "type": "number",
      "minimum": 0,
      "description": "Top padding"
    },
    "right": {
      "type": "number",
      "minimum": 0,
      "description": "Right padding"
    },
    "bottom": {
      "type": "number",
      "minimum": 0,
      "description": "Bottom padding"
    },
    "left": {
      "type": "number",
      "minimum": 0,
      "description": "Left padding"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-box-3/
export const calculatePaddingShorthandThreeValueExpansion = (rawInput: unknown): ToolResult<PaddingShorthandThreeValueExpansionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly first?: unknown; readonly second?: unknown; readonly third?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "first",
  "second",
  "third"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const firstValue = candidate.first;
  if (typeof firstValue !== "number" || !Number.isFinite(firstValue)) return issue("first", "invalid_type", "Enter a finite number.");
  if (firstValue < 0) return issue("first", "out_of_range", "Value is outside the accepted range.");
  const secondValue = candidate.second;
  if (typeof secondValue !== "number" || !Number.isFinite(secondValue)) return issue("second", "invalid_type", "Enter a finite number.");
  if (secondValue < 0) return issue("second", "out_of_range", "Value is outside the accepted range.");
  const thirdValue = candidate.third;
  if (typeof thirdValue !== "number" || !Number.isFinite(thirdValue)) return issue("third", "invalid_type", "Enter a finite number.");
  if (thirdValue < 0) return issue("third", "out_of_range", "Value is outside the accepted range.");

  const input: PaddingShorthandThreeValueExpansionInput = { first: firstValue, second: secondValue, third: thirdValue };
  return toolSuccess({ top: input.first, right: input.second, bottom: input.third, left: input.second });
};
export const example = {
  input: {
    "first": 10,
    "second": 20,
    "third": 30
  },
  output: {
    "top": 10,
    "right": 20,
    "bottom": 30,
    "left": 20
  },
} satisfies ToolExample<PaddingShorthandThreeValueExpansionInput, PaddingShorthandThreeValueExpansionOutput>;
export const paddingShorthandThreeValueExpansionTool = defineTool<PaddingShorthandThreeValueExpansionInput, PaddingShorthandThreeValueExpansionOutput>({
  id: "css/padding-shorthand-three-value-expansion",
  title: "Padding 3-Value Shorthand Expansion",
  description: "Expand three nonnegative pixel paddings, using the second value for both left and right.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: paddingShorthandThreeValueExpansionInputSchema,
  outputSchema: paddingShorthandThreeValueExpansionOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "first",
        "label": "First padding",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "second",
        "label": "Second padding",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "third",
        "label": "Third padding",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ],
    "outputs": [
      {
        "id": "top",
        "label": "Top padding",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "right",
        "label": "Right padding",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "bottom",
        "label": "Bottom padding",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "left",
        "label": "Left padding",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculatePaddingShorthandThreeValueExpansion,
});
export const runPaddingShorthandThreeValueExpansion = paddingShorthandThreeValueExpansionTool.execute;
export default paddingShorthandThreeValueExpansionTool;
