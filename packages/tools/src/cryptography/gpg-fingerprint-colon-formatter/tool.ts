import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type GpgFingerprintColonFormatterInput = {
  readonly hex: string;
};
export type GpgFingerprintColonFormatterOutput = {
  readonly fingerprint: string;
};
export const gpgFingerprintColonFormatterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hex": {
      "type": "string",
      "maxLength": 64,
      "pattern": "^(?:[0-9A-Fa-f]{40}|[0-9A-Fa-f]{64})$(?![\\s\\S])",
      "description": "Fingerprint hexadecimal"
    }
  },
  "required": [
    "hex"
  ]
} as const satisfies ToolJsonSchema;
export const gpgFingerprintColonFormatterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fingerprint": {
      "type": "string",
      "description": "Colon-separated fingerprint"
    }
  },
  "required": [
    "fingerprint"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc9580.html#section-5.5.4
export const calculateGpgFingerprintColonFormatter = (rawInput: unknown): ToolResult<GpgFingerprintColonFormatterOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly hex?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "hex"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hexValue = candidate.hex;
if (typeof hexValue !== "string") return issue("hex", "invalid_type", "Enter a string value.");
if (hexValue.length > 64) return issue("hex", "resource_limit", "Text exceeds the 64-character resource limit.");
if (!(new RegExp("^(?:[0-9A-Fa-f]{40}|[0-9A-Fa-f]{64})$(?![\\s\\S])")).test(hexValue)) return issue("hex", "invalid_format", "Text does not match the accepted syntax.");
  const input: GpgFingerprintColonFormatterInput = { hex: hexValue };
  return toolSuccess({ fingerprint: (input.hex.toUpperCase().match(/../g) ?? []).join(":") });
};
export const example = {
  "input": {
    "hex": "00112233445566778899aabbccddeeff00112233"
  },
  "output": {
    "fingerprint": "00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33"
  }
} satisfies ToolExample<GpgFingerprintColonFormatterInput, GpgFingerprintColonFormatterOutput>;
export const gpgFingerprintColonFormatterTool = defineTool<GpgFingerprintColonFormatterInput, GpgFingerprintColonFormatterOutput>({
  id: "cryptography/gpg-fingerprint-colon-formatter",
  title: "GPG Fingerprint Colon Formatter",
  description: "Format a supplied v4 20-byte or v6 32-byte OpenPGP fingerprint as uppercase colon-separated hexadecimal byte pairs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: gpgFingerprintColonFormatterInputSchema,
  outputSchema: gpgFingerprintColonFormatterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hex",
        "label": "Fingerprint hexadecimal",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "fingerprint",
        "label": "Colon-separated fingerprint",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateGpgFingerprintColonFormatter,
});
export const runGpgFingerprintColonFormatter = gpgFingerprintColonFormatterTool.execute;
export default gpgFingerprintColonFormatterTool;
