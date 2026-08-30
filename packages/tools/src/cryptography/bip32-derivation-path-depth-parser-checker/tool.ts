import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Bip32DerivationPathDepthParserCheckerInput = {
  readonly path: string;
};
export type Bip32DerivationPathDepthParserCheckerOutput = {
  readonly root: "private" | "public";
  readonly depth: number;
  readonly indices: ReadonlyArray<number>;
  readonly hardened: ReadonlyArray<boolean>;
};
export const bip32DerivationPathDepthParserCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "path": {
      "type": "string",
      "maxLength": 10000,
      "description": "BIP32 derivation path"
    }
  },
  "required": [
    "path"
  ]
} as const satisfies ToolJsonSchema;
export const bip32DerivationPathDepthParserCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "root": {
      "type": "string",
      "enum": [
        "private",
        "public"
      ],
      "description": "Path root"
    },
    "depth": {
      "type": "integer",
      "minimum": 0,
      "maximum": 255,
      "description": "Derivation depth"
    },
    "indices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "description": "Encoded child indices"
    },
    "hardened": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Hardened derivation flags"
    }
  },
  "required": [
    "root",
    "depth",
    "indices",
    "hardened"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://bips.dev/32/
export const calculateBip32DerivationPathDepthParserChecker = (rawInput: unknown): ToolResult<Bip32DerivationPathDepthParserCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly path?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "path"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const pathValue = candidate.path;
if (typeof pathValue !== "string") return issue("path", "invalid_type", "Enter a string value.");
if (pathValue.length > 10000) return issue("path", "resource_limit", "Text exceeds the 10000-character resource limit.");
  const input: Bip32DerivationPathDepthParserCheckerInput = { path: pathValue };
  const parts = input.path.split("/");
  const root = parts[0] === "m" ? "private" : parts[0] === "M" ? "public" : undefined;
  if (root === undefined) return issue("path", "invalid_root", "A path must begin with m or M.");
  if (parts.length > 256) return issue("path", "depth_limit", "BIP32 serialized depth is limited to 255 levels.");
  const indices: number[] = [], hardened: boolean[] = [];
  for (let index = 1; index < parts.length; index++) {
    const part = parts[index] ?? "";
    if (!/^[0-9]+'?$(?![\s\S])/.test(part)) return issue("path", "invalid_component", "Use unsigned decimal indices and optional apostrophes.");
    const hard = part.endsWith("'");
    const number = Number(hard ? part.slice(0, -1) : part);
    if (!Number.isSafeInteger(number) || number >= 2147483648) return issue("path", "index_range", "Each unencoded child index must be below 2^31.");
    if (hard && root === "public") return issue("path", "hardened_public", "A public root cannot derive a hardened child.");
    indices.push(number + (hard ? 2147483648 : 0)); hardened.push(hard);
  }
  return toolSuccess({ root, depth: indices.length, indices, hardened });
};
export const example = {
  "input": {
    "path": "m/44'/0'/0'/0/5"
  },
  "output": {
    "root": "private",
    "depth": 5,
    "indices": [
      2147483692,
      2147483648,
      2147483648,
      0,
      5
    ],
    "hardened": [
      true,
      true,
      true,
      false,
      false
    ]
  }
} satisfies ToolExample<Bip32DerivationPathDepthParserCheckerInput, Bip32DerivationPathDepthParserCheckerOutput>;
export const bip32DerivationPathDepthParserCheckerTool = defineTool<Bip32DerivationPathDepthParserCheckerInput, Bip32DerivationPathDepthParserCheckerOutput>({
  id: "cryptography/bip32-derivation-path-depth-parser-checker",
  title: "BIP32 Path Depth Parser Check",
  description: "Parse a BIP32 path with m or M root and apostrophe-marked hardened indices, enforcing depth and public-derivation restrictions.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bip32DerivationPathDepthParserCheckerInputSchema,
  outputSchema: bip32DerivationPathDepthParserCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "path",
        "label": "BIP32 derivation path",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "root",
        "label": "Path root",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "depth",
        "label": "Derivation depth",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "indices",
        "label": "Encoded child indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "hardened",
        "label": "Hardened derivation flags",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ]
  },
  execute: calculateBip32DerivationPathDepthParserChecker,
});
export const runBip32DerivationPathDepthParserChecker = bip32DerivationPathDepthParserCheckerTool.execute;
export default bip32DerivationPathDepthParserCheckerTool;
