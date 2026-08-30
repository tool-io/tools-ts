import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CertificateValidityWindowDaysLeftInput = {
  readonly notBefore: number;
  readonly notAfter: number;
  readonly now: number;
};
export type CertificateValidityWindowDaysLeftOutput = {
  readonly status: "not-yet-valid" | "valid" | "expired";
  readonly daysLeft: number;
};
export const certificateValidityWindowDaysLeftInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "notBefore": {
      "type": "integer",
      "minimum": -9007199254740991,
      "maximum": 9007199254740991,
      "description": "Certificate start time"
    },
    "notAfter": {
      "type": "integer",
      "minimum": -9007199254740991,
      "maximum": 9007199254740991,
      "description": "Certificate end time"
    },
    "now": {
      "type": "integer",
      "minimum": -9007199254740991,
      "maximum": 9007199254740991,
      "description": "Reference time"
    }
  },
  "required": [
    "notBefore",
    "notAfter",
    "now"
  ]
} as const satisfies ToolJsonSchema;
export const certificateValidityWindowDaysLeftOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "not-yet-valid",
        "valid",
        "expired"
      ],
      "description": "Validity status"
    },
    "daysLeft": {
      "type": "number",
      "description": "Fractional days until expiration"
    }
  },
  "required": [
    "status",
    "daysLeft"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc5280#section-4.1.2.5
export const calculateCertificateValidityWindowDaysLeft = (rawInput: unknown): ToolResult<CertificateValidityWindowDaysLeftOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly notBefore?: unknown; readonly notAfter?: unknown; readonly now?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "notBefore",
  "notAfter",
  "now"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const notBeforeValue = candidate.notBefore;
if (typeof notBeforeValue !== "number" || !Number.isSafeInteger(notBeforeValue)) return issue("notBefore", "invalid_type", "Enter a finite safe integer.");
if (notBeforeValue < -9007199254740991) return issue("notBefore", "out_of_range", "Value is outside the accepted range.");
if (notBeforeValue > 9007199254740991) return issue("notBefore", "out_of_range", "Value is outside the accepted range.");
const notAfterValue = candidate.notAfter;
if (typeof notAfterValue !== "number" || !Number.isSafeInteger(notAfterValue)) return issue("notAfter", "invalid_type", "Enter a finite safe integer.");
if (notAfterValue < -9007199254740991) return issue("notAfter", "out_of_range", "Value is outside the accepted range.");
if (notAfterValue > 9007199254740991) return issue("notAfter", "out_of_range", "Value is outside the accepted range.");
const nowValue = candidate.now;
if (typeof nowValue !== "number" || !Number.isSafeInteger(nowValue)) return issue("now", "invalid_type", "Enter a finite safe integer.");
if (nowValue < -9007199254740991) return issue("now", "out_of_range", "Value is outside the accepted range.");
if (nowValue > 9007199254740991) return issue("now", "out_of_range", "Value is outside the accepted range.");
  const input: CertificateValidityWindowDaysLeftInput = { notBefore: notBeforeValue, notAfter: notAfterValue, now: nowValue };
  if (input.notBefore > input.notAfter) return issue("notAfter", "reversed_interval", "notAfter must not precede notBefore.");
  const status = input.now < input.notBefore ? "not-yet-valid" : input.now > input.notAfter ? "expired" : "valid";
  return toolSuccess({ status, daysLeft: Number(BigInt(input.notAfter) - BigInt(input.now)) / 86400000 });
};
export const example = {
  "input": {
    "notBefore": 0,
    "notAfter": 259200000,
    "now": 86400000
  },
  "output": {
    "status": "valid",
    "daysLeft": 2
  }
} satisfies ToolExample<CertificateValidityWindowDaysLeftInput, CertificateValidityWindowDaysLeftOutput>;
export const certificateValidityWindowDaysLeftTool = defineTool<CertificateValidityWindowDaysLeftInput, CertificateValidityWindowDaysLeftOutput>({
  id: "cryptography/certificate-validity-window-days-left",
  title: "Certificate Validity Days Left",
  description: "Classify an explicitly supplied certificate validity interval and calculate fractional days until notAfter using epoch milliseconds.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: certificateValidityWindowDaysLeftInputSchema,
  outputSchema: certificateValidityWindowDaysLeftOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "notBefore",
        "label": "Certificate start time",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "ms"
        }
      },
      {
        "id": "notAfter",
        "label": "Certificate end time",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "ms"
        }
      },
      {
        "id": "now",
        "label": "Reference time",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "ms"
        }
      }
    ],
    "outputs": [
      {
        "id": "status",
        "label": "Validity status",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "daysLeft",
        "label": "Fractional days until expiration",
        "valueType": {
          "type": "number",
          "unit": "day"
        }
      }
    ]
  },
  execute: calculateCertificateValidityWindowDaysLeft,
});
export const runCertificateValidityWindowDaysLeft = certificateValidityWindowDaysLeftTool.execute;
export default certificateValidityWindowDaysLeftTool;
