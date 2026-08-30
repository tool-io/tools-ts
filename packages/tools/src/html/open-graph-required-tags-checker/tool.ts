import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type OpenGraphRequiredTagsCheckerInput = {
  readonly properties: ReadonlyArray<string>;
  readonly contents: ReadonlyArray<string>;
};
export type OpenGraphRequiredTagsCheckerOutput = {
  readonly missing: ReadonlyArray<string>;
  readonly complete: boolean;
};
export const openGraphRequiredTagsCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "properties": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Properties"
    },
    "contents": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Contents"
    }
  },
  "required": [
    "properties",
    "contents"
  ]
} as const satisfies ToolJsonSchema;
export const openGraphRequiredTagsCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "missing": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Missing"
    },
    "complete": {
      "type": "boolean",
      "description": "Complete"
    }
  },
  "required": [
    "missing",
    "complete"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://ogp.me/
export const calculateOpenGraphRequiredTagsChecker = (rawInput: unknown): ToolResult<OpenGraphRequiredTagsCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly properties?: unknown; readonly contents?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "properties",
  "contents"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const propertiesValue = candidate.properties;
if (!Array.isArray(propertiesValue)) return issue("properties", "invalid_type", "Enter a dense array.");
if (propertiesValue.length < 0) return issue("properties", "out_of_range", "Too few entries.");
if (propertiesValue.length > 10000) return issue("properties", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedProperties: string[] = [];
for (let index = 0; index < propertiesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(propertiesValue, index)) return issue(`properties.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = propertiesValue[index];
if (typeof item !== "string") return issue(`properties.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`properties.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedProperties.push(item);
}
if (validatedProperties.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("properties", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
const contentsValue = candidate.contents;
if (!Array.isArray(contentsValue)) return issue("contents", "invalid_type", "Enter a dense array.");
if (contentsValue.length < 0) return issue("contents", "out_of_range", "Too few entries.");
if (contentsValue.length > 10000) return issue("contents", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedContents: string[] = [];
for (let index = 0; index < contentsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(contentsValue, index)) return issue(`contents.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = contentsValue[index];
if (typeof item !== "string") return issue(`contents.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`contents.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedContents.push(item);
}
if (validatedContents.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("contents", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: OpenGraphRequiredTagsCheckerInput = { properties: validatedProperties, contents: validatedContents };
 if (input.properties.length !== input.contents.length) return issue("contents", "length_mismatch", "Properties and contents must have equal lengths.");
 const required = ["og:title", "og:type", "og:image", "og:url"];
 const missing = required.filter(property => !input.properties.some((key, index) => key === property && (input.contents[index]?.trim().length ?? 0) > 0));
 return toolSuccess({ missing, complete: missing.length === 0 });
};
export const example = {
  "input": {
    "properties": [
      "og:title",
      "og:type",
      "og:url"
    ],
    "contents": [
      "Field notes",
      "article",
      "https://example.org/notes"
    ]
  },
  "output": {
    "missing": [
      "og:image"
    ],
    "complete": false
  }
} satisfies ToolExample<OpenGraphRequiredTagsCheckerInput, OpenGraphRequiredTagsCheckerOutput>;
export const openGraphRequiredTagsCheckerTool = defineTool<OpenGraphRequiredTagsCheckerInput, OpenGraphRequiredTagsCheckerOutput>({
  id: "html/open-graph-required-tags-checker",
  title: "Open Graph Required Tags Check",
  description: "Finds missing Open Graph basic metadata properties in supplied parallel property and content vectors. Requires nonempty content; it does not fetch images or validate URLs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: openGraphRequiredTagsCheckerInputSchema,
  outputSchema: openGraphRequiredTagsCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "properties",
        "label": "Properties",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "contents",
        "label": "Contents",
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
        "id": "missing",
        "label": "Missing",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "complete",
        "label": "Complete",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateOpenGraphRequiredTagsChecker,
});
export const runOpenGraphRequiredTagsChecker = openGraphRequiredTagsCheckerTool.execute;
export default openGraphRequiredTagsCheckerTool;
