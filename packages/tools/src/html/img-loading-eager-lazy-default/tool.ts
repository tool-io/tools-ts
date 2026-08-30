import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type ImgLoadingEagerLazyDefaultInput = {
  readonly present: boolean;
  readonly value: string;
};
export type ImgLoadingEagerLazyDefaultOutput = {
  readonly state: "eager" | "lazy";
  readonly validKeyword: boolean;
};
export const imgLoadingEagerLazyDefaultInputSchema = {
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
export const imgLoadingEagerLazyDefaultOutputSchema = {
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
    "validKeyword": {
      "type": "boolean",
      "description": "Valid Keyword"
    }
  },
  "required": [
    "state",
    "validKeyword"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes
export const calculateImgLoadingEagerLazyDefault = (rawInput: unknown): ToolResult<ImgLoadingEagerLazyDefaultOutput> => {
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
  const input: ImgLoadingEagerLazyDefaultInput = { present: presentValue, value: valueValue };
 const value = asciiLower(input.value);
 return toolSuccess({ state: input.present && value === "lazy" ? "lazy" : "eager", validKeyword: input.present && (value === "eager" || value === "lazy") });
};
export const example = {
  "input": {
    "present": true,
    "value": "LAZY"
  },
  "output": {
    "state": "lazy",
    "validKeyword": true
  }
} satisfies ToolExample<ImgLoadingEagerLazyDefaultInput, ImgLoadingEagerLazyDefaultOutput>;
export const imgLoadingEagerLazyDefaultTool = defineTool<ImgLoadingEagerLazyDefaultInput, ImgLoadingEagerLazyDefaultOutput>({
  id: "html/img-loading-eager-lazy-default",
  title: "img loading eager/lazy Default",
  description: "Resolves img loading keywords with eager as both missing and invalid default. This reports the hint and does not guarantee actual lazy deferral.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: imgLoadingEagerLazyDefaultInputSchema,
  outputSchema: imgLoadingEagerLazyDefaultOutputSchema,
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
        "id": "validKeyword",
        "label": "Valid Keyword",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateImgLoadingEagerLazyDefault,
});
export const runImgLoadingEagerLazyDefault = imgLoadingEagerLazyDefaultTool.execute;
export default imgLoadingEagerLazyDefaultTool;
