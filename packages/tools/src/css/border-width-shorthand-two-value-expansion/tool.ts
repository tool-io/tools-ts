import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BorderWidthShorthandTwoValueExpansionInput = {
  readonly vertical: number;
  readonly horizontal: number;
};
export type BorderWidthShorthandTwoValueExpansionOutput = {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};
export const borderWidthShorthandTwoValueExpansionInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "vertical": {
      "type": "number",
      "minimum": 0,
      "description": "Vertical border width"
    },
    "horizontal": {
      "type": "number",
      "minimum": 0,
      "description": "Horizontal border width"
    }
  },
  "required": [
    "vertical",
    "horizontal"
  ]
} as const satisfies ToolJsonSchema;
export const borderWidthShorthandTwoValueExpansionOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "top": {
      "type": "number",
      "minimum": 0,
      "description": "Top width"
    },
    "right": {
      "type": "number",
      "minimum": 0,
      "description": "Right width"
    },
    "bottom": {
      "type": "number",
      "minimum": 0,
      "description": "Bottom width"
    },
    "left": {
      "type": "number",
      "minimum": 0,
      "description": "Left width"
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

// Reference: https://www.w3.org/TR/css-backgrounds-3/#the-border-width
export const calculateBorderWidthShorthandTwoValueExpansion = (rawInput: unknown): ToolResult<BorderWidthShorthandTwoValueExpansionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly vertical?: unknown; readonly horizontal?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "vertical",
  "horizontal"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const verticalValue = candidate.vertical;
  if (typeof verticalValue !== "number" || !Number.isFinite(verticalValue)) return issue("vertical", "invalid_type", "Enter a finite number.");
  if (verticalValue < 0) return issue("vertical", "out_of_range", "Value is outside the accepted range.");
  const horizontalValue = candidate.horizontal;
  if (typeof horizontalValue !== "number" || !Number.isFinite(horizontalValue)) return issue("horizontal", "invalid_type", "Enter a finite number.");
  if (horizontalValue < 0) return issue("horizontal", "out_of_range", "Value is outside the accepted range.");

  const input: BorderWidthShorthandTwoValueExpansionInput = { vertical: verticalValue, horizontal: horizontalValue };
  return toolSuccess({ top: input.vertical, right: input.horizontal, bottom: input.vertical, left: input.horizontal });
};
export const example = {
  input: {
    "vertical": 2,
    "horizontal": 5
  },
  output: {
    "top": 2,
    "right": 5,
    "bottom": 2,
    "left": 5
  },
} satisfies ToolExample<BorderWidthShorthandTwoValueExpansionInput, BorderWidthShorthandTwoValueExpansionOutput>;
export const borderWidthShorthandTwoValueExpansionTool = defineTool<BorderWidthShorthandTwoValueExpansionInput, BorderWidthShorthandTwoValueExpansionOutput>({
  id: "css/border-width-shorthand-two-value-expansion",
  title: "Border-Width 2-Value Expansion",
  description: "Expand two nonnegative pixel border widths into vertical and horizontal sides.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: borderWidthShorthandTwoValueExpansionInputSchema,
  outputSchema: borderWidthShorthandTwoValueExpansionOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "vertical",
        "label": "Vertical border width",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "horizontal",
        "label": "Horizontal border width",
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
        "label": "Top width",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "right",
        "label": "Right width",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "bottom",
        "label": "Bottom width",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "left",
        "label": "Left width",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateBorderWidthShorthandTwoValueExpansion,
});
export const runBorderWidthShorthandTwoValueExpansion = borderWidthShorthandTwoValueExpansionTool.execute;
export default borderWidthShorthandTwoValueExpansionTool;
