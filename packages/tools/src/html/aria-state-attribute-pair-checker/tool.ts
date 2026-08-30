import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AriaStateAttributePairCheckerInput = {
  readonly attribute: string;
  readonly value: string;
};
export type AriaStateAttributePairCheckerOutput = {
  readonly knownState: boolean;
  readonly definedValue: boolean;
};
export const ariaStateAttributePairCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "attribute": {
      "type": "string",
      "maxLength": 100,
      "description": "Attribute"
    },
    "value": {
      "type": "string",
      "maxLength": 100,
      "description": "Value"
    }
  },
  "required": [
    "attribute",
    "value"
  ]
} as const satisfies ToolJsonSchema;
export const ariaStateAttributePairCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "knownState": {
      "type": "boolean",
      "description": "Known State"
    },
    "definedValue": {
      "type": "boolean",
      "description": "Defined Value"
    }
  },
  "required": [
    "knownState",
    "definedValue"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/wai-aria-1.2/#state_prop_def; https://www.w3.org/TR/html-aria/#case-requirements-for-aria-role-state-and-property-attributes
export const calculateAriaStateAttributePairChecker = (rawInput: unknown): ToolResult<AriaStateAttributePairCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly attribute?: unknown; readonly value?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "attribute",
  "value"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const attributeValue = candidate.attribute;
if (typeof attributeValue !== "string") return issue("attribute", "invalid_type", "Enter a string value.");
if (attributeValue.length > 100) return issue("attribute", "resource_limit", "Text exceeds the 100-character resource limit.");
const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue.length > 100) return issue("value", "resource_limit", "Text exceeds the 100-character resource limit.");
  const input: AriaStateAttributePairCheckerInput = { attribute: attributeValue, value: valueValue };
  const states: Readonly<Record<string, ReadonlyArray<string>>> = {
    "aria-busy": ["true", "false"], "aria-checked": ["true", "false", "mixed", "undefined"],
    "aria-current": ["page", "step", "location", "date", "time", "true", "false"],
    "aria-disabled": ["true", "false"], "aria-expanded": ["true", "false", "undefined"],
    "aria-grabbed": ["true", "false", "undefined"], "aria-hidden": ["true", "false", "undefined"],
    "aria-invalid": ["grammar", "spelling", "true", "false"],
    "aria-pressed": ["true", "false", "mixed", "undefined"], "aria-selected": ["true", "false", "undefined"]
  };
  const tokens = Object.prototype.hasOwnProperty.call(states, input.attribute) ? states[input.attribute] : undefined;
  return toolSuccess({ knownState: tokens !== undefined, definedValue: tokens?.includes(input.value) ?? false });
};
export const example = {
  "input": {
    "attribute": "aria-checked",
    "value": "mixed"
  },
  "output": {
    "knownState": true,
    "definedValue": true
  }
} satisfies ToolExample<AriaStateAttributePairCheckerInput, AriaStateAttributePairCheckerOutput>;
export const ariaStateAttributePairCheckerTool = defineTool<AriaStateAttributePairCheckerInput, AriaStateAttributePairCheckerOutput>({
  id: "html/aria-state-attribute-pair-checker",
  title: "ARIA State Attribute Pair Check",
  description: "Checks a WAI-ARIA 1.2 state attribute name and a defined value token in recommended lowercase author spelling. This exact-spelling lexical pair check does not evaluate browser error recovery, role applicability or accessibility.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: ariaStateAttributePairCheckerInputSchema,
  outputSchema: ariaStateAttributePairCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "attribute",
        "label": "Attribute",
        "required": true,
        "valueType": {
          "type": "string"
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
        "id": "knownState",
        "label": "Known State",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "definedValue",
        "label": "Defined Value",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateAriaStateAttributePairChecker,
});
export const runAriaStateAttributePairChecker = ariaStateAttributePairCheckerTool.execute;
export default ariaStateAttributePairCheckerTool;
