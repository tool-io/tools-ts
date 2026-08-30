import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SmallFinePrintVsEmNoteInput = {
  readonly tag: "small" | "em";
};
export type SmallFinePrintVsEmNoteOutput = {
  readonly sideComment: boolean;
  readonly stressEmphasis: boolean;
};
export const smallFinePrintVsEmNoteInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tag": {
      "type": "string",
      "enum": [
        "small",
        "em"
      ],
      "description": "Tag"
    }
  },
  "required": [
    "tag"
  ]
} as const satisfies ToolJsonSchema;
export const smallFinePrintVsEmNoteOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "sideComment": {
      "type": "boolean",
      "description": "Side Comment"
    },
    "stressEmphasis": {
      "type": "boolean",
      "description": "Stress Emphasis"
    }
  },
  "required": [
    "sideComment",
    "stressEmphasis"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-small-element; https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-em-element
export const calculateSmallFinePrintVsEmNote = (rawInput: unknown): ToolResult<SmallFinePrintVsEmNoteOutput> => {
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
if (tagValue !== "small" && tagValue !== "em") return issue("tag", "invalid_value", "Choose a supported value.");
  const input: SmallFinePrintVsEmNoteInput = { tag: tagValue };
 return toolSuccess({ sideComment: input.tag === "small", stressEmphasis: input.tag === "em" });
};
export const example = {
  "input": {
    "tag": "small"
  },
  "output": {
    "sideComment": true,
    "stressEmphasis": false
  }
} satisfies ToolExample<SmallFinePrintVsEmNoteInput, SmallFinePrintVsEmNoteOutput>;
export const smallFinePrintVsEmNoteTool = defineTool<SmallFinePrintVsEmNoteInput, SmallFinePrintVsEmNoteOutput>({
  id: "html/small-fine-print-vs-em-note",
  title: "small Fine-Print vs em Note",
  description: "Distinguishes small side comments and fine print from em stress emphasis using standard semantic flags.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: smallFinePrintVsEmNoteInputSchema,
  outputSchema: smallFinePrintVsEmNoteOutputSchema,
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
        "id": "sideComment",
        "label": "Side Comment",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "stressEmphasis",
        "label": "Stress Emphasis",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSmallFinePrintVsEmNote,
});
export const runSmallFinePrintVsEmNote = smallFinePrintVsEmNoteTool.execute;
export default smallFinePrintVsEmNoteTool;
