import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ImgAltPresenceCheckerInput = {
  readonly hasAlt: boolean;
  readonly alt: string;
};
export type ImgAltPresenceCheckerOutput = {
  readonly present: boolean;
  readonly emptyAlternative: boolean;
};
export const imgAltPresenceCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hasAlt": {
      "type": "boolean",
      "description": "Has Alt"
    },
    "alt": {
      "type": "string",
      "maxLength": 100000,
      "description": "Alt"
    }
  },
  "required": [
    "hasAlt",
    "alt"
  ]
} as const satisfies ToolJsonSchema;
export const imgAltPresenceCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "present": {
      "type": "boolean",
      "description": "Present"
    },
    "emptyAlternative": {
      "type": "boolean",
      "description": "Empty Alternative"
    }
  },
  "required": [
    "present",
    "emptyAlternative"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/images.html#alt
export const calculateImgAltPresenceChecker = (rawInput: unknown): ToolResult<ImgAltPresenceCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly hasAlt?: unknown; readonly alt?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "hasAlt",
  "alt"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hasAltValue = candidate.hasAlt;
if (typeof hasAltValue !== "boolean") return issue("hasAlt", "invalid_type", "Enter a boolean value.");
const altValue = candidate.alt;
if (typeof altValue !== "string") return issue("alt", "invalid_type", "Enter a string value.");
if (altValue.length > 100000) return issue("alt", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: ImgAltPresenceCheckerInput = { hasAlt: hasAltValue, alt: altValue };
 return toolSuccess({ present: input.hasAlt, emptyAlternative: input.hasAlt && input.alt.length === 0 });
};
export const example = {
  "input": {
    "hasAlt": true,
    "alt": "Map of the campus"
  },
  "output": {
    "present": true,
    "emptyAlternative": false
  }
} satisfies ToolExample<ImgAltPresenceCheckerInput, ImgAltPresenceCheckerOutput>;
export const imgAltPresenceCheckerTool = defineTool<ImgAltPresenceCheckerInput, ImgAltPresenceCheckerOutput>({
  id: "html/img-alt-presence-checker",
  title: "img alt Presence Checker",
  description: "Checks whether a parsed img has an alt attribute and whether its value is empty. Empty alternative text can be appropriate for decorative images; this is a presence check only.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: imgAltPresenceCheckerInputSchema,
  outputSchema: imgAltPresenceCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hasAlt",
        "label": "Has Alt",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "alt",
        "label": "Alt",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "present",
        "label": "Present",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "emptyAlternative",
        "label": "Empty Alternative",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateImgAltPresenceChecker,
});
export const runImgAltPresenceChecker = imgAltPresenceCheckerTool.execute;
export default imgAltPresenceCheckerTool;
