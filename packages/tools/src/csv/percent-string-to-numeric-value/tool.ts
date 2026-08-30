import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseDecimal, decimalText } from "../currency-symbol-strip-to-number/tool.js";
export type PercentStringToNumericValueInput = {
  readonly text: string;
};
export type PercentStringToNumericValueOutput = {
  readonly value: string;
};
export const percentStringToNumericValueInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "text": {
      "type": "string",
      "maxLength": 200,
      "description": "Text"
    }
  },
  "required": [
    "text"
  ]
} as const satisfies ToolJsonSchema;
export const percentStringToNumericValueOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "value": {
      "type": "string",
      "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)?$",
      "description": "Value"
    }
  },
  "required": [
    "value"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculatePercentStringToNumericValue = (rawInput: unknown): ToolResult<PercentStringToNumericValueOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly text?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "text"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const textValue = candidate.text;
  if (typeof textValue !== "string") return issue("text", "invalid_type", "Enter a string value.");
  if (textValue.length > 200) return issue("text", "resource_limit", "Text exceeds the 200-character resource limit.");
  const input: PercentStringToNumericValueInput = { text: textValue };
  const token = input.text.trim();
  const value = token.endsWith("%") ? parseDecimal(token.slice(0, -1)) : undefined;
  if (value === undefined) return issue("text", "invalid_percent", "Enter a dot-decimal number followed by percent.");
  return toolSuccess({ value: decimalText({ coefficient: value.coefficient, scale: value.scale + 2 }) });
};
export const example = {
  input: {
    "text": "12.5%"
  },
  output: {
    "value": "0.125"
  },
} satisfies ToolExample<PercentStringToNumericValueInput, PercentStringToNumericValueOutput>;
export const percentStringToNumericValueTool = defineTool<PercentStringToNumericValueInput, PercentStringToNumericValueOutput>({
  id: "csv/percent-string-to-numeric-value",
  title: "Percent String to Numeric Value",
  description: "Convert a decimal cell ending in percent to an exact decimal fraction, using a dot decimal separator and no grouping; one percent equals one hundredth.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: percentStringToNumericValueInputSchema,
  outputSchema: percentStringToNumericValueOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "text",
        "label": "Text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "value",
        "label": "Value",
        "valueType": {
          "type": "string",
          "format": "decimal/arbitrary"
        }
      }
    ]
  },
  execute: calculatePercentStringToNumericValue,
});
export const runPercentStringToNumericValue = percentStringToNumericValueTool.execute;
export default percentStringToNumericValueTool;
