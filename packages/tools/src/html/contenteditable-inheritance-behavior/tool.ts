import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type ContenteditableInheritanceBehaviorInput = {
  readonly present: boolean;
  readonly value: string;
  readonly parentEditable: boolean;
};
export type ContenteditableInheritanceBehaviorOutput = {
  readonly attributeState: "true" | "false" | "plaintext-only" | "inherit";
  readonly editable: boolean;
};
export const contenteditableInheritanceBehaviorInputSchema = {
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
    "parentEditable": {
      "type": "boolean",
      "description": "Parent Editable"
    }
  },
  "required": [
    "present",
    "value",
    "parentEditable"
  ]
} as const satisfies ToolJsonSchema;
export const contenteditableInheritanceBehaviorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "attributeState": {
      "type": "string",
      "enum": [
        "true",
        "false",
        "plaintext-only",
        "inherit"
      ],
      "description": "Attribute State"
    },
    "editable": {
      "type": "boolean",
      "description": "Editable"
    }
  },
  "required": [
    "attributeState",
    "editable"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/interaction.html#attr-contenteditable
export const calculateContenteditableInheritanceBehavior = (rawInput: unknown): ToolResult<ContenteditableInheritanceBehaviorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly present?: unknown; readonly value?: unknown; readonly parentEditable?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "present",
  "value",
  "parentEditable"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const presentValue = candidate.present;
if (typeof presentValue !== "boolean") return issue("present", "invalid_type", "Enter a boolean value.");
const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue.length > 100000) return issue("value", "resource_limit", "Text exceeds the 100000-character resource limit.");
const parentEditableValue = candidate.parentEditable;
if (typeof parentEditableValue !== "boolean") return issue("parentEditable", "invalid_type", "Enter a boolean value.");
  const input: ContenteditableInheritanceBehaviorInput = { present: presentValue, value: valueValue, parentEditable: parentEditableValue };
 const value = asciiLower(input.value);
 const attributeState = !input.present ? "inherit" : value === "" || value === "true" ? "true" : value === "false" ? "false" : value === "plaintext-only" ? "plaintext-only" : "inherit";
 return toolSuccess({ attributeState, editable: attributeState === "inherit" ? input.parentEditable : attributeState !== "false" });
};
export const example = {
  "input": {
    "present": true,
    "value": "plaintext-only",
    "parentEditable": false
  },
  "output": {
    "attributeState": "plaintext-only",
    "editable": true
  }
} satisfies ToolExample<ContenteditableInheritanceBehaviorInput, ContenteditableInheritanceBehaviorOutput>;
export const contenteditableInheritanceBehaviorTool = defineTool<ContenteditableInheritanceBehaviorInput, ContenteditableInheritanceBehaviorOutput>({
  id: "html/contenteditable-inheritance-behavior",
  title: "contenteditable Inheritance Behavior",
  description: "Resolves contenteditable attribute state and whether ordinary element contents are editable using a caller-supplied inherited editable flag. Empty means true and invalid/omitted values inherit. DesignMode, rich-formatting inheritance and unrelated inertness are separate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: contenteditableInheritanceBehaviorInputSchema,
  outputSchema: contenteditableInheritanceBehaviorOutputSchema,
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
        "id": "parentEditable",
        "label": "Parent Editable",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "attributeState",
        "label": "Attribute State",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "editable",
        "label": "Editable",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateContenteditableInheritanceBehavior,
});
export const runContenteditableInheritanceBehavior = contenteditableInheritanceBehaviorTool.execute;
export default contenteditableInheritanceBehaviorTool;
