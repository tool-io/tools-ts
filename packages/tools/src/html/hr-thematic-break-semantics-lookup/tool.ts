import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type HrThematicBreakSemanticsLookupInput = {
  readonly tags: ReadonlyArray<string>;
};
export type HrThematicBreakSemanticsLookupOutput = {
  readonly thematicBreak: ReadonlyArray<boolean>;
  readonly breakCount: number;
};
export const hrThematicBreakSemanticsLookupInputSchema = {
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
    }
  },
  "required": [
    "tags"
  ]
} as const satisfies ToolJsonSchema;
export const hrThematicBreakSemanticsLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "thematicBreak": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Thematic Break"
    },
    "breakCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Break Count"
    }
  },
  "required": [
    "thematicBreak",
    "breakCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/grouping-content.html#the-hr-element
export const calculateHrThematicBreakSemanticsLookup = (rawInput: unknown): ToolResult<HrThematicBreakSemanticsLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly tags?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "tags"
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
  const input: HrThematicBreakSemanticsLookupInput = { tags: validatedTags };
 const thematicBreak = input.tags.map(tag => asciiLower(tag) === "hr");
 return toolSuccess({ thematicBreak, breakCount: thematicBreak.filter(Boolean).length });
};
export const example = {
  "input": {
    "tags": [
      "hr",
      "div",
      "HR"
    ]
  },
  "output": {
    "thematicBreak": [
      true,
      false,
      true
    ],
    "breakCount": 2
  }
} satisfies ToolExample<HrThematicBreakSemanticsLookupInput, HrThematicBreakSemanticsLookupOutput>;
export const hrThematicBreakSemanticsLookupTool = defineTool<HrThematicBreakSemanticsLookupInput, HrThematicBreakSemanticsLookupOutput>({
  id: "html/hr-thematic-break-semantics-lookup",
  title: "hr Thematic Break Semantics",
  description: "Identifies hr as a paragraph-level thematic break in a list of parsed HTML element names. A rendered horizontal line alone does not establish these semantics.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: hrThematicBreakSemanticsLookupInputSchema,
  outputSchema: hrThematicBreakSemanticsLookupOutputSchema,
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
      }
    ],
    "outputs": [
      {
        "id": "thematicBreak",
        "label": "Thematic Break",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "breakCount",
        "label": "Break Count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateHrThematicBreakSemanticsLookup,
});
export const runHrThematicBreakSemanticsLookup = hrThematicBreakSemanticsLookupTool.execute;
export default hrThematicBreakSemanticsLookupTool;
