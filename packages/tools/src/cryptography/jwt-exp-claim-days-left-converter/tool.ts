import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type JwtExpClaimDaysLeftConverterInput = {
  readonly expiration: number;
  readonly now: number;
};
export type JwtExpClaimDaysLeftConverterOutput = {
  readonly daysLeft: number;
  readonly expired: boolean;
};
export const jwtExpClaimDaysLeftConverterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "expiration": {
      "type": "number",
      "description": "Expiration NumericDate"
    },
    "now": {
      "type": "number",
      "description": "Reference NumericDate"
    }
  },
  "required": [
    "expiration",
    "now"
  ]
} as const satisfies ToolJsonSchema;
export const jwtExpClaimDaysLeftConverterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "daysLeft": {
      "type": "number",
      "description": "Fractional days remaining"
    },
    "expired": {
      "type": "boolean",
      "description": "Expiration reached"
    }
  },
  "required": [
    "daysLeft",
    "expired"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4
export const calculateJwtExpClaimDaysLeftConverter = (rawInput: unknown): ToolResult<JwtExpClaimDaysLeftConverterOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly expiration?: unknown; readonly now?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "expiration",
  "now"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const expirationValue = candidate.expiration;
if (typeof expirationValue !== "number" || !Number.isFinite(expirationValue)) return issue("expiration", "invalid_type", "Enter a finite number.");
const nowValue = candidate.now;
if (typeof nowValue !== "number" || !Number.isFinite(nowValue)) return issue("now", "invalid_type", "Enter a finite number.");
  const input: JwtExpClaimDaysLeftConverterInput = { expiration: expirationValue, now: nowValue };
  let daysLeft = (input.expiration - input.now) / 86400;
  if (!Number.isFinite(daysLeft)) daysLeft = input.expiration / 86400 - input.now / 86400;
  if (!Number.isFinite(daysLeft)) return issue("expiration", "numeric_overflow", "The time difference exceeds finite number range.");
  return toolSuccess({ daysLeft: daysLeft === 0 ? 0 : daysLeft, expired: input.now >= input.expiration });
};
export const example = {
  "input": {
    "expiration": 259200,
    "now": 86400
  },
  "output": {
    "daysLeft": 2,
    "expired": false
  }
} satisfies ToolExample<JwtExpClaimDaysLeftConverterInput, JwtExpClaimDaysLeftConverterOutput>;
export const jwtExpClaimDaysLeftConverterTool = defineTool<JwtExpClaimDaysLeftConverterInput, JwtExpClaimDaysLeftConverterOutput>({
  id: "cryptography/jwt-exp-claim-days-left-converter",
  title: "JWT exp Days-Left Converter",
  description: "Convert a supplied JWT exp NumericDate and reference NumericDate into signed fractional days remaining and expiry status.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: jwtExpClaimDaysLeftConverterInputSchema,
  outputSchema: jwtExpClaimDaysLeftConverterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "expiration",
        "label": "Expiration NumericDate",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "s"
        }
      },
      {
        "id": "now",
        "label": "Reference NumericDate",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "s"
        }
      }
    ],
    "outputs": [
      {
        "id": "daysLeft",
        "label": "Fractional days remaining",
        "valueType": {
          "type": "number",
          "unit": "day"
        }
      },
      {
        "id": "expired",
        "label": "Expiration reached",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateJwtExpClaimDaysLeftConverter,
});
export const runJwtExpClaimDaysLeftConverter = jwtExpClaimDaysLeftConverterTool.execute;
export default jwtExpClaimDaysLeftConverterTool;
