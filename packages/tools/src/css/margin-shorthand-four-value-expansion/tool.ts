import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MarginShorthandFourValueExpansionInput = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
  readonly fourth: number;
};
export type MarginShorthandFourValueExpansionOutput = {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};
export const marginShorthandFourValueExpansionInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "first": {
      "type": "number",
      "description": "First margin"
    },
    "second": {
      "type": "number",
      "description": "Second margin"
    },
    "third": {
      "type": "number",
      "description": "Third margin"
    },
    "fourth": {
      "type": "number",
      "description": "Fourth margin"
    }
  },
  "required": [
    "first",
    "second",
    "third",
    "fourth"
  ]
} as const satisfies ToolJsonSchema;
export const marginShorthandFourValueExpansionOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "top": {
      "type": "number",
      "description": "Top margin"
    },
    "right": {
      "type": "number",
      "description": "Right margin"
    },
    "bottom": {
      "type": "number",
      "description": "Bottom margin"
    },
    "left": {
      "type": "number",
      "description": "Left margin"
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
export const calculateMarginShorthandFourValueExpansion = (rawInput: unknown): ToolResult<MarginShorthandFourValueExpansionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly first?: unknown; readonly second?: unknown; readonly third?: unknown; readonly fourth?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "first",
  "second",
  "third",
  "fourth"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const firstValue = candidate.first;
  if (typeof firstValue !== "number" || !Number.isFinite(firstValue)) return issue("first", "invalid_type", "Enter a finite number.");
  const secondValue = candidate.second;
  if (typeof secondValue !== "number" || !Number.isFinite(secondValue)) return issue("second", "invalid_type", "Enter a finite number.");
  const thirdValue = candidate.third;
  if (typeof thirdValue !== "number" || !Number.isFinite(thirdValue)) return issue("third", "invalid_type", "Enter a finite number.");
  const fourthValue = candidate.fourth;
  if (typeof fourthValue !== "number" || !Number.isFinite(fourthValue)) return issue("fourth", "invalid_type", "Enter a finite number.");

  const input: MarginShorthandFourValueExpansionInput = { first: firstValue, second: secondValue, third: thirdValue, fourth: fourthValue };
  return toolSuccess({ top: input.first, right: input.second, bottom: input.third, left: input.fourth });
};
export const example = {
  input: {
    "first": 1,
    "second": 2,
    "third": 3,
    "fourth": 4
  },
  output: {
    "top": 1,
    "right": 2,
    "bottom": 3,
    "left": 4
  },
} satisfies ToolExample<MarginShorthandFourValueExpansionInput, MarginShorthandFourValueExpansionOutput>;
export const marginShorthandFourValueExpansionTool = defineTool<MarginShorthandFourValueExpansionInput, MarginShorthandFourValueExpansionOutput>({
  id: "css/margin-shorthand-four-value-expansion",
  title: "Margin 4-Value Shorthand Expansion",
  description: "Expand four finite pixel margins in top, right, bottom, left order.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: marginShorthandFourValueExpansionInputSchema,
  outputSchema: marginShorthandFourValueExpansionOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "first",
        "label": "First margin",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "second",
        "label": "Second margin",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "third",
        "label": "Third margin",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "fourth",
        "label": "Fourth margin",
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
        "label": "Top margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "right",
        "label": "Right margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "bottom",
        "label": "Bottom margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "left",
        "label": "Left margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateMarginShorthandFourValueExpansion,
});
export const runMarginShorthandFourValueExpansion = marginShorthandFourValueExpansionTool.execute;
export default marginShorthandFourValueExpansionTool;
