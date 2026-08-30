import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type CrossoriginAnonymousCredentialsTableInput = {
  readonly present: boolean;
  readonly value: string;
};
export type CrossoriginAnonymousCredentialsTableOutput = {
  readonly state: "no-cors" | "anonymous" | "use-credentials";
  readonly requestMode: "no-cors" | "cors";
  readonly credentialsMode: "include" | "same-origin";
};
export const crossoriginAnonymousCredentialsTableInputSchema = {
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
    }
  },
  "required": [
    "present",
    "value"
  ]
} as const satisfies ToolJsonSchema;
export const crossoriginAnonymousCredentialsTableOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "state": {
      "type": "string",
      "enum": [
        "no-cors",
        "anonymous",
        "use-credentials"
      ],
      "description": "State"
    },
    "requestMode": {
      "type": "string",
      "enum": [
        "no-cors",
        "cors"
      ],
      "description": "Request Mode"
    },
    "credentialsMode": {
      "type": "string",
      "enum": [
        "include",
        "same-origin"
      ],
      "description": "Credentials Mode"
    }
  },
  "required": [
    "state",
    "requestMode",
    "credentialsMode"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
export const calculateCrossoriginAnonymousCredentialsTable = (rawInput: unknown): ToolResult<CrossoriginAnonymousCredentialsTableOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly present?: unknown; readonly value?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "present",
  "value"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const presentValue = candidate.present;
if (typeof presentValue !== "boolean") return issue("present", "invalid_type", "Enter a boolean value.");
const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue.length > 100000) return issue("value", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: CrossoriginAnonymousCredentialsTableInput = { present: presentValue, value: valueValue };
 const state = !input.present ? "no-cors" : asciiLower(input.value) === "use-credentials" ? "use-credentials" : "anonymous";
 return toolSuccess({ state, requestMode: state === "no-cors" ? "no-cors" : "cors", credentialsMode: state === "anonymous" ? "same-origin" : "include" });
};
export const example = {
  "input": {
    "present": true,
    "value": ""
  },
  "output": {
    "state": "anonymous",
    "requestMode": "cors",
    "credentialsMode": "same-origin"
  }
} satisfies ToolExample<CrossoriginAnonymousCredentialsTableInput, CrossoriginAnonymousCredentialsTableOutput>;
export const crossoriginAnonymousCredentialsTableTool = defineTool<CrossoriginAnonymousCredentialsTableInput, CrossoriginAnonymousCredentialsTableOutput>({
  id: "html/crossorigin-anonymous-credentials-table",
  title: "crossorigin anonymous/use-credentials Table",
  description: "Resolves a CORS settings attribute and potential-CORS request credentials mode for img/media without the same-origin fallback flag. Missing attribute means no-cors/include; empty or invalid present values mean cors/same-origin. Always-CORS features use a different mapping.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: crossoriginAnonymousCredentialsTableInputSchema,
  outputSchema: crossoriginAnonymousCredentialsTableOutputSchema,
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
        "id": "requestMode",
        "label": "Request Mode",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "credentialsMode",
        "label": "Credentials Mode",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateCrossoriginAnonymousCredentialsTable,
});
export const runCrossoriginAnonymousCredentialsTable = crossoriginAnonymousCredentialsTableTool.execute;
export default crossoriginAnonymousCredentialsTableTool;
