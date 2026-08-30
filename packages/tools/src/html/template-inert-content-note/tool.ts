import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TemplateInertContentNoteInput = {
  readonly location: "template-content" | "inserted-content" | "declarative-shadow-root-content";
};
export type TemplateInertContentNoteOutput = {
  readonly inertTemplateContents: boolean;
  readonly participatesInDocument: boolean;
};
export const templateInertContentNoteInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "location": {
      "type": "string",
      "enum": [
        "template-content",
        "inserted-content",
        "declarative-shadow-root-content"
      ],
      "description": "Location"
    }
  },
  "required": [
    "location"
  ]
} as const satisfies ToolJsonSchema;
export const templateInertContentNoteOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "inertTemplateContents": {
      "type": "boolean",
      "description": "Inert Template Contents"
    },
    "participatesInDocument": {
      "type": "boolean",
      "description": "Participates In Document"
    }
  },
  "required": [
    "inertTemplateContents",
    "participatesInDocument"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
export const calculateTemplateInertContentNote = (rawInput: unknown): ToolResult<TemplateInertContentNoteOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly location?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "location"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const locationValue = candidate.location;
if (typeof locationValue !== "string") return issue("location", "invalid_type", "Enter a string value.");
if (locationValue !== "template-content" && locationValue !== "inserted-content" && locationValue !== "declarative-shadow-root-content") return issue("location", "invalid_value", "Choose a supported value.");
  const input: TemplateInertContentNoteInput = { location: locationValue };
 const inertTemplateContents = input.location === "template-content";
 return toolSuccess({ inertTemplateContents, participatesInDocument: !inertTemplateContents });
};
export const example = {
  "input": {
    "location": "template-content"
  },
  "output": {
    "inertTemplateContents": true,
    "participatesInDocument": false
  }
} satisfies ToolExample<TemplateInertContentNoteInput, TemplateInertContentNoteOutput>;
export const templateInertContentNoteTool = defineTool<TemplateInertContentNoteInput, TemplateInertContentNoteOutput>({
  id: "html/template-inert-content-note",
  title: "template Inert Content Note",
  description: "Classifies ordinary template DocumentFragment contents versus content already inserted into a document or a processed declarative shadow root. Only ordinary template contents remain in the inert template owner document; other reasons for inertness are not evaluated.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: templateInertContentNoteInputSchema,
  outputSchema: templateInertContentNoteOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "location",
        "label": "Location",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "inertTemplateContents",
        "label": "Inert Template Contents",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "participatesInDocument",
        "label": "Participates In Document",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateTemplateInertContentNote,
});
export const runTemplateInertContentNote = templateInertContentNoteTool.execute;
export default templateInertContentNoteTool;
