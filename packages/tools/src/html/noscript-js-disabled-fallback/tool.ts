import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type NoscriptJsDisabledFallbackInput = {
  readonly scriptingEnabled: boolean;
  readonly context: "head" | "body";
};
export type NoscriptJsDisabledFallbackOutput = {
  readonly fallbackEligible: boolean;
  readonly contentsParsedAs: "text" | "markup";
  readonly headContentRestricted: boolean;
};
export const noscriptJsDisabledFallbackInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "scriptingEnabled": {
      "type": "boolean",
      "description": "Scripting Enabled"
    },
    "context": {
      "type": "string",
      "enum": [
        "head",
        "body"
      ],
      "description": "Context"
    }
  },
  "required": [
    "scriptingEnabled",
    "context"
  ]
} as const satisfies ToolJsonSchema;
export const noscriptJsDisabledFallbackOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fallbackEligible": {
      "type": "boolean",
      "description": "Fallback Eligible"
    },
    "contentsParsedAs": {
      "type": "string",
      "enum": [
        "text",
        "markup"
      ],
      "description": "Contents Parsed As"
    },
    "headContentRestricted": {
      "type": "boolean",
      "description": "Head Content Restricted"
    }
  },
  "required": [
    "fallbackEligible",
    "contentsParsedAs",
    "headContentRestricted"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/scripting.html#the-noscript-element
export const calculateNoscriptJsDisabledFallback = (rawInput: unknown): ToolResult<NoscriptJsDisabledFallbackOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly scriptingEnabled?: unknown; readonly context?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "scriptingEnabled",
  "context"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const scriptingEnabledValue = candidate.scriptingEnabled;
if (typeof scriptingEnabledValue !== "boolean") return issue("scriptingEnabled", "invalid_type", "Enter a boolean value.");
const contextValue = candidate.context;
if (typeof contextValue !== "string") return issue("context", "invalid_type", "Enter a string value.");
if (contextValue !== "head" && contextValue !== "body") return issue("context", "invalid_value", "Choose a supported value.");
  const input: NoscriptJsDisabledFallbackInput = { scriptingEnabled: scriptingEnabledValue, context: contextValue };
 return toolSuccess({ fallbackEligible: !input.scriptingEnabled, contentsParsedAs: input.scriptingEnabled ? "text" : "markup", headContentRestricted: !input.scriptingEnabled && input.context === "head" });
};
export const example = {
  "input": {
    "scriptingEnabled": false,
    "context": "body"
  },
  "output": {
    "fallbackEligible": true,
    "contentsParsedAs": "markup",
    "headContentRestricted": false
  }
} satisfies ToolExample<NoscriptJsDisabledFallbackInput, NoscriptJsDisabledFallbackOutput>;
export const noscriptJsDisabledFallbackTool = defineTool<NoscriptJsDisabledFallbackInput, NoscriptJsDisabledFallbackOutput>({
  id: "html/noscript-js-disabled-fallback",
  title: "noscript JS-Disabled Fallback",
  description: "Resolves HTML noscript fallback and parser treatment from the HTML parser scripting flag. With scripting enabled contents are text; with scripting disabled contents are markup. XML parsing and full content-model validation are outside this tool.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: noscriptJsDisabledFallbackInputSchema,
  outputSchema: noscriptJsDisabledFallbackOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "scriptingEnabled",
        "label": "Scripting Enabled",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "context",
        "label": "Context",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "fallbackEligible",
        "label": "Fallback Eligible",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "contentsParsedAs",
        "label": "Contents Parsed As",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "headContentRestricted",
        "label": "Head Content Restricted",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateNoscriptJsDisabledFallback,
});
export const runNoscriptJsDisabledFallback = noscriptJsDisabledFallbackTool.execute;
export default noscriptJsDisabledFallbackTool;
