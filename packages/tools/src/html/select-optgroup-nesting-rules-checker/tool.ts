import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type SelectOptgroupNestingRulesCheckerInput = {
  readonly tags: ReadonlyArray<string>;
  readonly parents: ReadonlyArray<string>;
};
export type SelectOptgroupNestingRulesCheckerOutput = {
  readonly invalidAt: ReadonlyArray<number>;
  readonly valid: boolean;
};
export const selectOptgroupNestingRulesCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Tags"
    },
    "parents": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Parents"
    }
  },
  "required": [
    "tags",
    "parents"
  ]
} as const satisfies ToolJsonSchema;
export const selectOptgroupNestingRulesCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "invalidAt": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "description": "Invalid At"
    },
    "valid": {
      "type": "boolean",
      "description": "Valid"
    }
  },
  "required": [
    "invalidAt",
    "valid"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/form-elements.html#the-optgroup-element; https://html.spec.whatwg.org/multipage/form-elements.html#the-option-element
export const calculateSelectOptgroupNestingRulesChecker = (rawInput: unknown): ToolResult<SelectOptgroupNestingRulesCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly tags?: unknown; readonly parents?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "tags",
  "parents"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const tagsValue = candidate.tags;
if (!Array.isArray(tagsValue)) return issue("tags", "invalid_type", "Enter a dense array.");
if (tagsValue.length < 0) return issue("tags", "out_of_range", "Too few entries.");
if (tagsValue.length > 10000) return issue("tags", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedTags: string[] = [];
for (let index = 0; index < tagsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(tagsValue, index)) return issue(`tags.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = tagsValue[index];
if (typeof item !== "string") return issue(`tags.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`tags.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedTags.push(item);
}
if (validatedTags.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("tags", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
const parentsValue = candidate.parents;
if (!Array.isArray(parentsValue)) return issue("parents", "invalid_type", "Enter a dense array.");
if (parentsValue.length < 0) return issue("parents", "out_of_range", "Too few entries.");
if (parentsValue.length > 10000) return issue("parents", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedParents: string[] = [];
for (let index = 0; index < parentsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(parentsValue, index)) return issue(`parents.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = parentsValue[index];
if (typeof item !== "string") return issue(`parents.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`parents.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedParents.push(item);
}
if (validatedParents.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("parents", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: SelectOptgroupNestingRulesCheckerInput = { tags: validatedTags, parents: validatedParents };
 if (input.tags.length !== input.parents.length) return issue("parents", "length_mismatch", "Tags and parent names must have equal lengths.");
 const invalidAt: number[] = [];
 input.tags.forEach((raw, index) => {
   const tag = asciiLower(raw), parent = asciiLower(input.parents[index] ?? "");
   if (tag === "optgroup" ? parent !== "select" : tag === "option" ? parent !== "select" && parent !== "optgroup" : true) invalidAt.push(index);
 });
 return toolSuccess({ invalidAt, valid: invalidAt.length === 0 });
};
export const example = {
  "input": {
    "tags": [
      "optgroup",
      "option",
      "optgroup"
    ],
    "parents": [
      "select",
      "optgroup",
      "optgroup"
    ]
  },
  "output": {
    "invalidAt": [
      2
    ],
    "valid": false
  }
} satisfies ToolExample<SelectOptgroupNestingRulesCheckerInput, SelectOptgroupNestingRulesCheckerOutput>;
export const selectOptgroupNestingRulesCheckerTool = defineTool<SelectOptgroupNestingRulesCheckerInput, SelectOptgroupNestingRulesCheckerOutput>({
  id: "html/select-optgroup-nesting-rules-checker",
  title: "select/optgroup Nesting Rules Check",
  description: "Checks direct parent relationships for option and optgroup elements in the classic select profile. Customizable selects, datalist options and intervening div elements are outside this explicitly restricted profile.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: selectOptgroupNestingRulesCheckerInputSchema,
  outputSchema: selectOptgroupNestingRulesCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "tags",
        "label": "Tags",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "parents",
        "label": "Parents",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "invalidAt",
        "label": "Invalid At",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSelectOptgroupNestingRulesChecker,
});
export const runSelectOptgroupNestingRulesChecker = selectOptgroupNestingRulesCheckerTool.execute;
export default selectOptgroupNestingRulesCheckerTool;
