import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type IframeSandboxTokenListLookupInput = {
  readonly present: boolean;
  readonly tokens: string;
};
export type IframeSandboxTokenListLookupOutput = {
  readonly unknown: ReadonlyArray<string>;
  readonly scriptsRestricted: boolean;
  readonly opaqueOriginRequired: boolean;
};
export const iframeSandboxTokenListLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "present": {
      "type": "boolean",
      "description": "Present"
    },
    "tokens": {
      "type": "string",
      "maxLength": 100000,
      "description": "Tokens"
    }
  },
  "required": [
    "present",
    "tokens"
  ]
} as const satisfies ToolJsonSchema;
export const iframeSandboxTokenListLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "unknown": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Unknown"
    },
    "scriptsRestricted": {
      "type": "boolean",
      "description": "Scripts Restricted"
    },
    "opaqueOriginRequired": {
      "type": "boolean",
      "description": "Opaque Origin Required"
    }
  },
  "required": [
    "unknown",
    "scriptsRestricted",
    "opaqueOriginRequired"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox
export const calculateIframeSandboxTokenListLookup = (rawInput: unknown): ToolResult<IframeSandboxTokenListLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly present?: unknown; readonly tokens?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "present",
  "tokens"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const presentValue = candidate.present;
if (typeof presentValue !== "boolean") return issue("present", "invalid_type", "Enter a boolean value.");
const tokensValue = candidate.tokens;
if (typeof tokensValue !== "string") return issue("tokens", "invalid_type", "Enter a string value.");
if (tokensValue.length > 100000) return issue("tokens", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: IframeSandboxTokenListLookupInput = { present: presentValue, tokens: tokensValue };
 const tokens = htmlTokens(input.tokens).map(asciiLower);
 const known = new Set([
  "allow-downloads",
  "allow-forms",
  "allow-modals",
  "allow-orientation-lock",
  "allow-pointer-lock",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
  "allow-presentation",
  "allow-same-origin",
  "allow-scripts",
  "allow-top-navigation",
  "allow-top-navigation-by-user-activation",
  "allow-top-navigation-to-custom-protocols"
]);
 return toolSuccess({ unknown: input.present ? [...new Set(tokens.filter(token => !known.has(token)))] : [], scriptsRestricted: input.present && !tokens.includes("allow-scripts"), opaqueOriginRequired: input.present && !tokens.includes("allow-same-origin") });
};
export const example = {
  "input": {
    "present": true,
    "tokens": "allow-scripts allow-forms"
  },
  "output": {
    "unknown": [],
    "scriptsRestricted": false,
    "opaqueOriginRequired": true
  }
} satisfies ToolExample<IframeSandboxTokenListLookupInput, IframeSandboxTokenListLookupOutput>;
export const iframeSandboxTokenListLookupTool = defineTool<IframeSandboxTokenListLookupInput, IframeSandboxTokenListLookupOutput>({
  id: "html/iframe-sandbox-token-list-lookup",
  title: "iframe sandbox Token List Lookup",
  description: "Classifies standard iframe sandbox tokens and resolves the scripts and origin restrictions imposed by this attribute alone. Omitted sandbox differs from an empty sandbox; inherited and CSP restrictions are outside this check.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: iframeSandboxTokenListLookupInputSchema,
  outputSchema: iframeSandboxTokenListLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "present",
        "label": "Present",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "tokens",
        "label": "Tokens",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "unknown",
        "label": "Unknown",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "scriptsRestricted",
        "label": "Scripts Restricted",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "opaqueOriginRequired",
        "label": "Opaque Origin Required",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateIframeSandboxTokenListLookup,
});
export const runIframeSandboxTokenListLookup = iframeSandboxTokenListLookupTool.execute;
export default iframeSandboxTokenListLookupTool;
