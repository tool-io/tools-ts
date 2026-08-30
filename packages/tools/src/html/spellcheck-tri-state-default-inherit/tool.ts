import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type SpellcheckTriStateDefaultInheritInput = {
  readonly present: boolean;
  readonly value: string;
  readonly defaultBehavior: "true" | "false" | "inherit";
  readonly parentSpellcheck: boolean;
};
export type SpellcheckTriStateDefaultInheritOutput = {
  readonly attributeState: "true" | "false" | "default";
  readonly spellcheck: boolean;
};
export const spellcheckTriStateDefaultInheritInputSchema = {
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
    "defaultBehavior": {
      "type": "string",
      "enum": [
        "true",
        "false",
        "inherit"
      ],
      "description": "Default Behavior"
    },
    "parentSpellcheck": {
      "type": "boolean",
      "description": "Parent Spellcheck"
    }
  },
  "required": [
    "present",
    "value",
    "defaultBehavior",
    "parentSpellcheck"
  ]
} as const satisfies ToolJsonSchema;
export const spellcheckTriStateDefaultInheritOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "attributeState": {
      "type": "string",
      "enum": [
        "true",
        "false",
        "default"
      ],
      "description": "Attribute State"
    },
    "spellcheck": {
      "type": "boolean",
      "description": "Spellcheck"
    }
  },
  "required": [
    "attributeState",
    "spellcheck"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/interaction.html#spelling-and-grammar-checking
export const calculateSpellcheckTriStateDefaultInherit = (rawInput: unknown): ToolResult<SpellcheckTriStateDefaultInheritOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly present?: unknown; readonly value?: unknown; readonly defaultBehavior?: unknown; readonly parentSpellcheck?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "present",
  "value",
  "defaultBehavior",
  "parentSpellcheck"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const presentValue = candidate.present;
if (typeof presentValue !== "boolean") return issue("present", "invalid_type", "Enter a boolean value.");
const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue.length > 100000) return issue("value", "resource_limit", "Text exceeds the 100000-character resource limit.");
const defaultBehaviorValue = candidate.defaultBehavior;
if (typeof defaultBehaviorValue !== "string") return issue("defaultBehavior", "invalid_type", "Enter a string value.");
if (defaultBehaviorValue !== "true" && defaultBehaviorValue !== "false" && defaultBehaviorValue !== "inherit") return issue("defaultBehavior", "invalid_value", "Choose a supported value.");
const parentSpellcheckValue = candidate.parentSpellcheck;
if (typeof parentSpellcheckValue !== "boolean") return issue("parentSpellcheck", "invalid_type", "Enter a boolean value.");
  const input: SpellcheckTriStateDefaultInheritInput = { present: presentValue, value: valueValue, defaultBehavior: defaultBehaviorValue, parentSpellcheck: parentSpellcheckValue };
 const value = asciiLower(input.value);
 const attributeState = !input.present ? "default" : value === "" || value === "true" ? "true" : value === "false" ? "false" : "default";
 const spellcheck = attributeState === "default" ? input.defaultBehavior === "inherit" ? input.parentSpellcheck : input.defaultBehavior === "true" : attributeState === "true";
 return toolSuccess({ attributeState, spellcheck });
};
export const example = {
  "input": {
    "present": false,
    "value": "",
    "defaultBehavior": "false",
    "parentSpellcheck": true
  },
  "output": {
    "attributeState": "default",
    "spellcheck": false
  }
} satisfies ToolExample<SpellcheckTriStateDefaultInheritInput, SpellcheckTriStateDefaultInheritOutput>;
export const spellcheckTriStateDefaultInheritTool = defineTool<SpellcheckTriStateDefaultInheritInput, SpellcheckTriStateDefaultInheritOutput>({
  id: "html/spellcheck-tri-state-default-inherit",
  title: "spellcheck Tri-State Inherit Default",
  description: "Resolves spellcheck attribute and IDL flag using caller-supplied true, false or inherit default behavior and parent flag. Missing/invalid attributes use the default behavior, which need not inherit. This does not override user preferences or decide which text is checkable.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: spellcheckTriStateDefaultInheritInputSchema,
  outputSchema: spellcheckTriStateDefaultInheritOutputSchema,
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
        "id": "defaultBehavior",
        "label": "Default Behavior",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "parentSpellcheck",
        "label": "Parent Spellcheck",
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
        "id": "spellcheck",
        "label": "Spellcheck",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSpellcheckTriStateDefaultInherit,
});
export const runSpellcheckTriStateDefaultInherit = spellcheckTriStateDefaultInheritTool.execute;
export default spellcheckTriStateDefaultInheritTool;
