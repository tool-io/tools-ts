import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type TableThScopeA11yCheckerInput = {
  readonly present: boolean;
  readonly value: string;
};
export type TableThScopeA11yCheckerOutput = {
  readonly state: "auto" | "row" | "col" | "rowgroup" | "colgroup";
  readonly validKeyword: boolean;
};
export const tableThScopeA11yCheckerInputSchema = {
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
export const tableThScopeA11yCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "state": {
      "type": "string",
      "enum": [
        "auto",
        "row",
        "col",
        "rowgroup",
        "colgroup"
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

// Reference: https://html.spec.whatwg.org/multipage/tables.html#attr-th-scope
export const calculateTableThScopeA11yChecker = (rawInput: unknown): ToolResult<TableThScopeA11yCheckerOutput> => {
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
  const input: TableThScopeA11yCheckerInput = { present: presentValue, value: valueValue };
 const value = asciiLower(input.value);
 const validKeyword = input.present && ["row", "col", "rowgroup", "colgroup"].includes(value);
 const state = validKeyword ? value as "row" | "col" | "rowgroup" | "colgroup" : "auto";
 return toolSuccess({ state, validKeyword });
};
export const example = {
  "input": {
    "present": true,
    "value": "COL"
  },
  "output": {
    "state": "col",
    "validKeyword": true
  }
} satisfies ToolExample<TableThScopeA11yCheckerInput, TableThScopeA11yCheckerOutput>;
export const tableThScopeA11yCheckerTool = defineTool<TableThScopeA11yCheckerInput, TableThScopeA11yCheckerOutput>({
  id: "html/table-th-scope-a11y-checker",
  title: "Table th scope A11y Check",
  description: "Resolves th scope keywords to row, col, rowgroup, colgroup or automatic. Valid lexical scope does not establish correct header associations or group anchoring.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: tableThScopeA11yCheckerInputSchema,
  outputSchema: tableThScopeA11yCheckerOutputSchema,
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
  execute: calculateTableThScopeA11yChecker,
});
export const runTableThScopeA11yChecker = tableThScopeA11yCheckerTool.execute;
export default tableThScopeA11yCheckerTool;
