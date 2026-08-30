import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type ReferrerpolicyValuesTableLookupInput = {
  readonly present: boolean;
  readonly value: string;
};
export type ReferrerpolicyValuesTableLookupOutput = {
  readonly state: string;
  readonly validKeyword: boolean;
  readonly inheritsPolicy: boolean;
};
export const referrerpolicyValuesTableLookupInputSchema = {
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
export const referrerpolicyValuesTableLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "state": {
      "type": "string",
      "description": "State"
    },
    "validKeyword": {
      "type": "boolean",
      "description": "Valid Keyword"
    },
    "inheritsPolicy": {
      "type": "boolean",
      "description": "Inherits Policy"
    }
  },
  "required": [
    "state",
    "validKeyword",
    "inheritsPolicy"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#referrer-policy-attributes; https://www.w3.org/TR/referrer-policy/
export const calculateReferrerpolicyValuesTableLookup = (rawInput: unknown): ToolResult<ReferrerpolicyValuesTableLookupOutput> => {
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
  const input: ReferrerpolicyValuesTableLookupInput = { present: presentValue, value: valueValue };
 const value = asciiLower(input.value);
 const validKeyword = input.present && [
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
].includes(value);
 const state = validKeyword ? value : "";
 return toolSuccess({ state, validKeyword, inheritsPolicy: state === "" });
};
export const example = {
  "input": {
    "present": true,
    "value": "strict-origin-when-cross-origin"
  },
  "output": {
    "state": "strict-origin-when-cross-origin",
    "validKeyword": true,
    "inheritsPolicy": false
  }
} satisfies ToolExample<ReferrerpolicyValuesTableLookupInput, ReferrerpolicyValuesTableLookupOutput>;
export const referrerpolicyValuesTableLookupTool = defineTool<ReferrerpolicyValuesTableLookupInput, ReferrerpolicyValuesTableLookupOutput>({
  id: "html/referrerpolicy-values-table-lookup",
  title: "referrerpolicy Values Table",
  description: "Resolves a referrerpolicy attribute to its standard keyword or the empty inherited-policy state. It does not compute referrer URLs or combine document headers and noreferrer.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: referrerpolicyValuesTableLookupInputSchema,
  outputSchema: referrerpolicyValuesTableLookupOutputSchema,
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
      },
      {
        "id": "inheritsPolicy",
        "label": "Inherits Policy",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateReferrerpolicyValuesTableLookup,
});
export const runReferrerpolicyValuesTableLookup = referrerpolicyValuesTableLookupTool.execute;
export default referrerpolicyValuesTableLookupTool;
