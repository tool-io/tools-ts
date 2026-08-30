import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type AudioPreloadMetadataNoneAutoValuesInput = {
  readonly present: boolean;
  readonly value: string;
};
export type AudioPreloadMetadataNoneAutoValuesOutput = {
  readonly state: "none" | "metadata" | "auto" | "implementation-defined";
  readonly validKeyword: boolean;
};
export const audioPreloadMetadataNoneAutoValuesInputSchema = {
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
export const audioPreloadMetadataNoneAutoValuesOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "state": {
      "type": "string",
      "enum": [
        "none",
        "metadata",
        "auto",
        "implementation-defined"
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

// Reference: https://html.spec.whatwg.org/multipage/media.html#attr-media-preload
export const calculateAudioPreloadMetadataNoneAutoValues = (rawInput: unknown): ToolResult<AudioPreloadMetadataNoneAutoValuesOutput> => {
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
  const input: AudioPreloadMetadataNoneAutoValuesInput = { present: presentValue, value: valueValue };
 const value = asciiLower(input.value);
 const validKeyword = input.present && ["", "none", "metadata", "auto"].includes(value);
 const state = !validKeyword ? "implementation-defined" : value === "none" ? "none" : value === "metadata" ? "metadata" : "auto";
 return toolSuccess({ state, validKeyword });
};
export const example = {
  "input": {
    "present": true,
    "value": "metadata"
  },
  "output": {
    "state": "metadata",
    "validKeyword": true
  }
} satisfies ToolExample<AudioPreloadMetadataNoneAutoValuesInput, AudioPreloadMetadataNoneAutoValuesOutput>;
export const audioPreloadMetadataNoneAutoValuesTool = defineTool<AudioPreloadMetadataNoneAutoValuesInput, AudioPreloadMetadataNoneAutoValuesOutput>({
  id: "html/audio-preload-metadata-none-auto-values",
  title: "audio preload metadata/none/auto Values",
  description: "Resolves audio preload hints none, metadata or auto, with empty present value mapping to auto. Both omitted and invalid attributes are implementation-defined; this does not predict network buffering.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: audioPreloadMetadataNoneAutoValuesInputSchema,
  outputSchema: audioPreloadMetadataNoneAutoValuesOutputSchema,
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
  execute: calculateAudioPreloadMetadataNoneAutoValues,
});
export const runAudioPreloadMetadataNoneAutoValues = audioPreloadMetadataNoneAutoValuesTool.execute;
export default audioPreloadMetadataNoneAutoValuesTool;
