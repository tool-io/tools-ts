import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TranslatePercentSelfBoxWidthInput = {
  readonly referenceWidth: number;
  readonly percent: number;
};
export type TranslatePercentSelfBoxWidthOutput = {
  readonly translation: number;
};
export const translatePercentSelfBoxWidthInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "referenceWidth": {
      "type": "number",
      "minimum": 0,
      "description": "Reference width"
    },
    "percent": {
      "type": "number",
      "description": "Percent"
    }
  },
  "required": [
    "referenceWidth",
    "percent"
  ]
} as const satisfies ToolJsonSchema;
export const translatePercentSelfBoxWidthOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "translation": {
      "type": "number",
      "description": "Translation"
    }
  },
  "required": [
    "translation"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const percentagePixels = (length: number, percent: number): number => {
  let value = length * (percent / 100);
  if (value === 0 && length !== 0 && percent !== 0) value = (length / 100) * percent;
  return Object.is(value, -0) ? 0 : value;
};

// Reference: https://www.w3.org/TR/css-transforms-1/#funcdef-transform-translatex
export const calculateTranslatePercentSelfBoxWidth = (rawInput: unknown): ToolResult<TranslatePercentSelfBoxWidthOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly referenceWidth?: unknown; readonly percent?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "referenceWidth",
  "percent"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const referenceWidthValue = candidate.referenceWidth;
  if (typeof referenceWidthValue !== "number" || !Number.isFinite(referenceWidthValue)) return issue("referenceWidth", "invalid_type", "Enter a finite number.");
  if (referenceWidthValue < 0) return issue("referenceWidth", "out_of_range", "Value is outside the accepted range.");
  const percentValue = candidate.percent;
  if (typeof percentValue !== "number" || !Number.isFinite(percentValue)) return issue("percent", "invalid_type", "Enter a finite number.");
  const input: TranslatePercentSelfBoxWidthInput = { referenceWidth: referenceWidthValue, percent: percentValue };
  const translation = percentagePixels(input.referenceWidth, input.percent);
  if (!Number.isFinite(translation) || (translation === 0 && input.referenceWidth !== 0 && input.percent !== 0)) return issue("percent", "numeric_range", "Pixel translation is outside representable number range.");
  return toolSuccess({ translation });
};
export const example = {
  input: {
    "referenceWidth": 240,
    "percent": -25
  },
  output: {
    "translation": -60
  },
} satisfies ToolExample<TranslatePercentSelfBoxWidthInput, TranslatePercentSelfBoxWidthOutput>;
export const translatePercentSelfBoxWidthTool = defineTool<TranslatePercentSelfBoxWidthInput, TranslatePercentSelfBoxWidthOutput>({
  id: "css/translate-percent-self-box-width",
  title: "Translate % Relative To Own Box Width",
  description: "Resolve a signed horizontal translate percentage against an explicitly supplied reference-box width in pixels; the caller chooses the transform reference box.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: translatePercentSelfBoxWidthInputSchema,
  outputSchema: translatePercentSelfBoxWidthOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "referenceWidth",
        "label": "Reference width",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "percent",
        "label": "Percent",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "percent"
        }
      }
    ],
    "outputs": [
      {
        "id": "translation",
        "label": "Translation",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateTranslatePercentSelfBoxWidth,
});
export const runTranslatePercentSelfBoxWidth = translatePercentSelfBoxWidthTool.execute;
export default translatePercentSelfBoxWidthTool;
