import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type UUnarticulatedAnnotationUsageInput = {
  readonly tags: ReadonlyArray<string>;
};
export type UUnarticulatedAnnotationUsageOutput = {
  readonly unarticulatedAnnotation: ReadonlyArray<boolean>;
  readonly annotationCount: number;
};
export const uUnarticulatedAnnotationUsageInputSchema = {
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
export const uUnarticulatedAnnotationUsageOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "unarticulatedAnnotation": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Unarticulated Annotation"
    },
    "annotationCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Annotation Count"
    }
  },
  "required": [
    "unarticulatedAnnotation",
    "annotationCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-u-element
export const calculateUUnarticulatedAnnotationUsage = (rawInput: unknown): ToolResult<UUnarticulatedAnnotationUsageOutput> => {
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
  const input: UUnarticulatedAnnotationUsageInput = { tags: validatedTags };
 const unarticulatedAnnotation = input.tags.map(tag => asciiLower(tag) === "u");
 return toolSuccess({ unarticulatedAnnotation, annotationCount: unarticulatedAnnotation.filter(Boolean).length });
};
export const example = {
  "input": {
    "tags": [
      "u",
      "a",
      "U"
    ]
  },
  "output": {
    "unarticulatedAnnotation": [
      true,
      false,
      true
    ],
    "annotationCount": 2
  }
} satisfies ToolExample<UUnarticulatedAnnotationUsageInput, UUnarticulatedAnnotationUsageOutput>;
export const uUnarticulatedAnnotationUsageTool = defineTool<UUnarticulatedAnnotationUsageInput, UUnarticulatedAnnotationUsageOutput>({
  id: "html/u-unarticulated-annotation-usage",
  title: "u Unarticulated Annotation Usage",
  description: "Identifies u as unarticulated non-textual annotation in parsed element names. Underlining does not give u hyperlink semantics.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: uUnarticulatedAnnotationUsageInputSchema,
  outputSchema: uUnarticulatedAnnotationUsageOutputSchema,
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
        "id": "unarticulatedAnnotation",
        "label": "Unarticulated Annotation",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "annotationCount",
        "label": "Annotation Count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateUUnarticulatedAnnotationUsage,
});
export const runUUnarticulatedAnnotationUsage = uUnarticulatedAnnotationUsageTool.execute;
export default uUnarticulatedAnnotationUsageTool;
