import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type ImgDecodingAsyncSyncAutoHintInput = {
  readonly present: boolean;
  readonly value: string;
};
export type ImgDecodingAsyncSyncAutoHintOutput = {
  readonly state: "sync" | "async" | "auto";
  readonly validKeyword: boolean;
};
export const imgDecodingAsyncSyncAutoHintInputSchema = {
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
export const imgDecodingAsyncSyncAutoHintOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "state": {
      "type": "string",
      "enum": [
        "sync",
        "async",
        "auto"
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

// Reference: https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-decoding
export const calculateImgDecodingAsyncSyncAutoHint = (rawInput: unknown): ToolResult<ImgDecodingAsyncSyncAutoHintOutput> => {
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
  const input: ImgDecodingAsyncSyncAutoHintInput = { present: presentValue, value: valueValue };
 const value = asciiLower(input.value);
 const validKeyword = input.present && (value === "sync" || value === "async" || value === "auto");
 const state = validKeyword ? value as "sync" | "async" | "auto" : "auto";
 return toolSuccess({ state, validKeyword });
};
export const example = {
  "input": {
    "present": true,
    "value": "ASYNC"
  },
  "output": {
    "state": "async",
    "validKeyword": true
  }
} satisfies ToolExample<ImgDecodingAsyncSyncAutoHintInput, ImgDecodingAsyncSyncAutoHintOutput>;
export const imgDecodingAsyncSyncAutoHintTool = defineTool<ImgDecodingAsyncSyncAutoHintInput, ImgDecodingAsyncSyncAutoHintOutput>({
  id: "html/img-decoding-async-sync-auto-hint",
  title: "img decoding async/sync/auto Hint",
  description: "Resolves img decoding sync, async or auto hints with auto as missing and invalid default. Actual decoding strategy remains a user-agent decision.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: imgDecodingAsyncSyncAutoHintInputSchema,
  outputSchema: imgDecodingAsyncSyncAutoHintOutputSchema,
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
  execute: calculateImgDecodingAsyncSyncAutoHint,
});
export const runImgDecodingAsyncSyncAutoHint = imgDecodingAsyncSyncAutoHintTool.execute;
export default imgDecodingAsyncSyncAutoHintTool;
