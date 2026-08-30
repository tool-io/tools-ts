import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SDelInsEditedContentDiffInput = {
  readonly tag: "s" | "strike" | "del" | "ins";
};
export type SDelInsEditedContentDiffOutput = {
  readonly meaning: "inaccurate" | "obsolete" | "deletion" | "insertion";
  readonly conforming: boolean;
};
export const sDelInsEditedContentDiffInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tag": {
      "type": "string",
      "enum": [
        "s",
        "strike",
        "del",
        "ins"
      ],
      "description": "Tag"
    }
  },
  "required": [
    "tag"
  ]
} as const satisfies ToolJsonSchema;
export const sDelInsEditedContentDiffOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "meaning": {
      "type": "string",
      "enum": [
        "inaccurate",
        "obsolete",
        "deletion",
        "insertion"
      ],
      "description": "Meaning"
    },
    "conforming": {
      "type": "boolean",
      "description": "Conforming"
    }
  },
  "required": [
    "meaning",
    "conforming"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/edits.html; https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-s-element; https://html.spec.whatwg.org/multipage/obsolete.html
export const calculateSDelInsEditedContentDiff = (rawInput: unknown): ToolResult<SDelInsEditedContentDiffOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly tag?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "tag"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const tagValue = candidate.tag;
if (typeof tagValue !== "string") return issue("tag", "invalid_type", "Enter a string value.");
if (tagValue !== "s" && tagValue !== "strike" && tagValue !== "del" && tagValue !== "ins") return issue("tag", "invalid_value", "Choose a supported value.");
  const input: SDelInsEditedContentDiffInput = { tag: tagValue };
 const meaning = input.tag === "s" ? "inaccurate" : input.tag === "strike" ? "obsolete" : input.tag === "del" ? "deletion" : "insertion";
 return toolSuccess({ meaning, conforming: input.tag !== "strike" });
};
export const example = {
  "input": {
    "tag": "del"
  },
  "output": {
    "meaning": "deletion",
    "conforming": true
  }
} satisfies ToolExample<SDelInsEditedContentDiffInput, SDelInsEditedContentDiffOutput>;
export const sDelInsEditedContentDiffTool = defineTool<SDelInsEditedContentDiffInput, SDelInsEditedContentDiffOutput>({
  id: "html/s-del-ins-edited-content-diff",
  title: "s/strike vs del/ins Edited Content Diff",
  description: "Classifies s as no-longer-accurate content, del/ins as edits, and obsolete strike as nonconforming. Strikethrough appearance is not interpreted as edit semantics.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sDelInsEditedContentDiffInputSchema,
  outputSchema: sDelInsEditedContentDiffOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "tag",
        "label": "Tag",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "meaning",
        "label": "Meaning",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conforming",
        "label": "Conforming",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSDelInsEditedContentDiff,
});
export const runSDelInsEditedContentDiff = sDelInsEditedContentDiffTool.execute;
export default sDelInsEditedContentDiffTool;
