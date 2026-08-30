import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type TranslateAttributeInheritanceInput = {
  readonly present: boolean;
  readonly value: string;
  readonly parentTranslate: boolean;
};
export type TranslateAttributeInheritanceOutput = {
  readonly attributeState: "yes" | "no" | "inherit";
  readonly translate: boolean;
};
export const translateAttributeInheritanceInputSchema = {
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
    "parentTranslate": {
      "type": "boolean",
      "description": "Parent Translate"
    }
  },
  "required": [
    "present",
    "value",
    "parentTranslate"
  ]
} as const satisfies ToolJsonSchema;
export const translateAttributeInheritanceOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "attributeState": {
      "type": "string",
      "enum": [
        "yes",
        "no",
        "inherit"
      ],
      "description": "Attribute State"
    },
    "translate": {
      "type": "boolean",
      "description": "Translate"
    }
  },
  "required": [
    "attributeState",
    "translate"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/dom.html#attr-translate
export const calculateTranslateAttributeInheritance = (rawInput: unknown): ToolResult<TranslateAttributeInheritanceOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly present?: unknown; readonly value?: unknown; readonly parentTranslate?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "present",
  "value",
  "parentTranslate"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const presentValue = candidate.present;
if (typeof presentValue !== "boolean") return issue("present", "invalid_type", "Enter a boolean value.");
const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue.length > 100000) return issue("value", "resource_limit", "Text exceeds the 100000-character resource limit.");
const parentTranslateValue = candidate.parentTranslate;
if (typeof parentTranslateValue !== "boolean") return issue("parentTranslate", "invalid_type", "Enter a boolean value.");
  const input: TranslateAttributeInheritanceInput = { present: presentValue, value: valueValue, parentTranslate: parentTranslateValue };
 const value = asciiLower(input.value);
 const attributeState = !input.present ? "inherit" : value === "" || value === "yes" ? "yes" : value === "no" ? "no" : "inherit";
 return toolSuccess({ attributeState, translate: attributeState === "inherit" ? input.parentTranslate : attributeState === "yes" });
};
export const example = {
  "input": {
    "present": false,
    "value": "",
    "parentTranslate": false
  },
  "output": {
    "attributeState": "inherit",
    "translate": false
  }
} satisfies ToolExample<TranslateAttributeInheritanceInput, TranslateAttributeInheritanceOutput>;
export const translateAttributeInheritanceTool = defineTool<TranslateAttributeInheritanceInput, TranslateAttributeInheritanceOutput>({
  id: "html/translate-attribute-inheritance",
  title: "translate Attribute Inheritance",
  description: "Resolves translate yes/no and inherited translation mode. Empty means yes, invalid and omitted values inherit; supply true as the parent mode for a root element without an ancestor.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: translateAttributeInheritanceInputSchema,
  outputSchema: translateAttributeInheritanceOutputSchema,
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
        "id": "parentTranslate",
        "label": "Parent Translate",
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
        "id": "translate",
        "label": "Translate",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateTranslateAttributeInheritance,
});
export const runTranslateAttributeInheritance = translateAttributeInheritanceTool.execute;
export default translateAttributeInheritanceTool;
