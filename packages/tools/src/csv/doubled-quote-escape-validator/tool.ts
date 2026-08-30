import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DoubledQuoteEscapeValidatorInput = {
  readonly token: string;
};
export type DoubledQuoteEscapeValidatorOutput = {
  readonly valid: boolean;
};
export const doubledQuoteEscapeValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "token": {
      "type": "string",
      "maxLength": 100000,
      "description": "Token"
    }
  },
  "required": [
    "token"
  ]
} as const satisfies ToolJsonSchema;
export const doubledQuoteEscapeValidatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "boolean",
      "description": "Valid"
    }
  },
  "required": [
    "valid"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateDoubledQuoteEscapeValidator = (rawInput: unknown): ToolResult<DoubledQuoteEscapeValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly token?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "token"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const tokenValue = candidate.token;
  if (typeof tokenValue !== "string") return issue("token", "invalid_type", "Enter a string value.");
  if (tokenValue.length > 100000) return issue("token", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: DoubledQuoteEscapeValidatorInput = { token: tokenValue };
  return toolSuccess({ valid: /^"(?:[^"]|"")*"$/.test(input.token) });
};
export const example = {
  input: {
    "token": "\"She said \"\"hello\"\"\""
  },
  output: {
    "valid": true
  },
} satisfies ToolExample<DoubledQuoteEscapeValidatorInput, DoubledQuoteEscapeValidatorOutput>;
export const doubledQuoteEscapeValidatorTool = defineTool<DoubledQuoteEscapeValidatorInput, DoubledQuoteEscapeValidatorOutput>({
  id: "csv/doubled-quote-escape-validator",
  title: "Doubled-Quote Escape Validator",
  description: "Validate one double-quoted CSV field token, accepting interior quotes only in doubled pairs; this does not validate an entire CSV document.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: doubledQuoteEscapeValidatorInputSchema,
  outputSchema: doubledQuoteEscapeValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "token",
        "label": "Token",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateDoubledQuoteEscapeValidator,
});
export const runDoubledQuoteEscapeValidator = doubledQuoteEscapeValidatorTool.execute;
export default doubledQuoteEscapeValidatorTool;
