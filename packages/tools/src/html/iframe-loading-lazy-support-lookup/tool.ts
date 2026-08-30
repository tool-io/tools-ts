import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type IframeLoadingLazySupportLookupInput = {
  readonly present: boolean;
  readonly value: string;
  readonly supportsLazy: boolean;
  readonly scriptingEnabled: boolean;
};
export type IframeLoadingLazySupportLookupOutput = {
  readonly state: "eager" | "lazy";
  readonly eligibleForLazy: boolean;
};
export const iframeLoadingLazySupportLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "present": {
      "type": "boolean",
      "description": "Present"
    },
    "value": {
      "type": "string",
      "maxLength": 100000,
      "description": "Value"
    },
    "supportsLazy": {
      "type": "boolean",
      "description": "Supports Lazy"
    },
    "scriptingEnabled": {
      "type": "boolean",
      "description": "Scripting Enabled"
    }
  },
  "required": [
    "present",
    "value",
    "supportsLazy",
    "scriptingEnabled"
  ]
} as const satisfies ToolJsonSchema;
export const iframeLoadingLazySupportLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "state": {
      "type": "string",
      "enum": [
        "eager",
        "lazy"
      ],
      "description": "State"
    },
    "eligibleForLazy": {
      "type": "boolean",
      "description": "Eligible For Lazy"
    }
  },
  "required": [
    "state",
    "eligibleForLazy"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes
export const calculateIframeLoadingLazySupportLookup = (rawInput: unknown): ToolResult<IframeLoadingLazySupportLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly present?: unknown; readonly value?: unknown; readonly supportsLazy?: unknown; readonly scriptingEnabled?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "present",
  "value",
  "supportsLazy",
  "scriptingEnabled"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const presentValue = candidate.present;
if (typeof presentValue !== "boolean") return issue("present", "invalid_type", "Enter a boolean value.");
const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue.length > 100000) return issue("value", "resource_limit", "Text exceeds the 100000-character resource limit.");
const supportsLazyValue = candidate.supportsLazy;
if (typeof supportsLazyValue !== "boolean") return issue("supportsLazy", "invalid_type", "Enter a boolean value.");
const scriptingEnabledValue = candidate.scriptingEnabled;
if (typeof scriptingEnabledValue !== "boolean") return issue("scriptingEnabled", "invalid_type", "Enter a boolean value.");
  const input: IframeLoadingLazySupportLookupInput = { present: presentValue, value: valueValue, supportsLazy: supportsLazyValue, scriptingEnabled: scriptingEnabledValue };
 const state = input.present && asciiLower(input.value) === "lazy" ? "lazy" : "eager";
 return toolSuccess({ state, eligibleForLazy: state === "lazy" && input.supportsLazy && input.scriptingEnabled });
};
export const example = {
  "input": {
    "present": true,
    "value": "lazy",
    "supportsLazy": true,
    "scriptingEnabled": true
  },
  "output": {
    "state": "lazy",
    "eligibleForLazy": true
  }
} satisfies ToolExample<IframeLoadingLazySupportLookupInput, IframeLoadingLazySupportLookupOutput>;
export const iframeLoadingLazySupportLookupTool = defineTool<IframeLoadingLazySupportLookupInput, IframeLoadingLazySupportLookupOutput>({
  id: "html/iframe-loading-lazy-support-lookup",
  title: "iframe loading=lazy Support Lookup",
  description: "Resolves an iframe loading attribute to eager or lazy and reports whether lazy loading is eligible given caller-supplied browser support and scripting state. Actual viewport scheduling remains browser controlled.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: iframeLoadingLazySupportLookupInputSchema,
  outputSchema: iframeLoadingLazySupportLookupOutputSchema,
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
        "id": "value",
        "label": "Value",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "supportsLazy",
        "label": "Supports Lazy",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "scriptingEnabled",
        "label": "Scripting Enabled",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "state",
        "label": "State",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "eligibleForLazy",
        "label": "Eligible For Lazy",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateIframeLoadingLazySupportLookup,
});
export const runIframeLoadingLazySupportLookup = iframeLoadingLazySupportLookupTool.execute;
export default iframeLoadingLazySupportLookupTool;
