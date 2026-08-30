import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SshKeyFingerprintMd5StyleFormatterInput = {
  readonly hex: string;
};
export type SshKeyFingerprintMd5StyleFormatterOutput = {
  readonly fingerprint: string;
};
export const sshKeyFingerprintMd5StyleFormatterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hex": {
      "type": "string",
      "maxLength": 32,
      "pattern": "^[0-9A-Fa-f]{32}$(?![\\s\\S])",
      "description": "MD5 fingerprint hexadecimal"
    }
  },
  "required": [
    "hex"
  ]
} as const satisfies ToolJsonSchema;
export const sshKeyFingerprintMd5StyleFormatterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fingerprint": {
      "type": "string",
      "description": "SSH-style MD5 fingerprint"
    }
  },
  "required": [
    "fingerprint"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://man.openbsd.org/ssh-keygen
export const calculateSshKeyFingerprintMd5StyleFormatter = (rawInput: unknown): ToolResult<SshKeyFingerprintMd5StyleFormatterOutput> => {
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
if (hexValue.length > 32) return issue("hex", "resource_limit", "Text exceeds the 32-character resource limit.");
if (!(new RegExp("^[0-9A-Fa-f]{32}$(?![\\s\\S])")).test(hexValue)) return issue("hex", "invalid_format", "Text does not match the accepted syntax.");
  const input: SshKeyFingerprintMd5StyleFormatterInput = { hex: hexValue };
  return toolSuccess({ fingerprint: "MD5:" + (input.hex.toLowerCase().match(/../g) ?? []).join(":") });
};
export const example = {
  "input": {
    "hex": "00112233445566778899AABBCCDDEEFF"
  },
  "output": {
    "fingerprint": "MD5:00:11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff"
  }
} satisfies ToolExample<SshKeyFingerprintMd5StyleFormatterInput, SshKeyFingerprintMd5StyleFormatterOutput>;
export const sshKeyFingerprintMd5StyleFormatterTool = defineTool<SshKeyFingerprintMd5StyleFormatterInput, SshKeyFingerprintMd5StyleFormatterOutput>({
  id: "cryptography/ssh-key-fingerprint-md5-style-formatter",
  title: "SSH Key MD5-Style Fingerprint Formatter",
  description: "Format a supplied 16-byte MD5 fingerprint as the lowercase colon-separated form used by SSH tooling.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sshKeyFingerprintMd5StyleFormatterInputSchema,
  outputSchema: sshKeyFingerprintMd5StyleFormatterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hex",
        "label": "MD5 fingerprint hexadecimal",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "fingerprint",
        "label": "SSH-style MD5 fingerprint",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateSshKeyFingerprintMd5StyleFormatter,
});
export const runSshKeyFingerprintMd5StyleFormatter = sshKeyFingerprintMd5StyleFormatterTool.execute;
export default sshKeyFingerprintMd5StyleFormatterTool;
