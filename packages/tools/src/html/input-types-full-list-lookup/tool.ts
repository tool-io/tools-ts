import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type InputTypesFullListLookupInput = {
  readonly values: ReadonlyArray<string>;
};
export type InputTypesFullListLookupOutput = {
  readonly recognized: ReadonlyArray<boolean>;
  readonly states: ReadonlyArray<string>;
};
export const inputTypesFullListLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const inputTypesFullListLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "recognized": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Recognized"
    },
    "states": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "States"
    }
  },
  "required": [
    "recognized",
    "states"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/input.html#attr-input-type
export const calculateInputTypesFullListLookup = (rawInput: unknown): ToolResult<InputTypesFullListLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valuesValue = candidate.values;
if (!Array.isArray(valuesValue)) return issue("values", "invalid_type", "Enter a dense array.");
if (valuesValue.length < 0) return issue("values", "out_of_range", "Too few entries.");
if (valuesValue.length > 10000) return issue("values", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedValues: string[] = [];
for (let index = 0; index < valuesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = valuesValue[index];
if (typeof item !== "string") return issue(`values.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`values.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedValues.push(item);
}
if (validatedValues.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("values", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: InputTypesFullListLookupInput = { values: validatedValues };
 const keywords = new Set([
  "hidden",
  "text",
  "search",
  "tel",
  "url",
  "email",
  "password",
  "date",
  "month",
  "week",
  "time",
  "datetime-local",
  "number",
  "range",
  "color",
  "checkbox",
  "radio",
  "file",
  "submit",
  "image",
  "reset",
  "button"
]);
 const values = input.values.map(asciiLower);
 return toolSuccess({ recognized: values.map(value => keywords.has(value)), states: values.map(value => keywords.has(value) ? value : "text") });
};
export const example = {
  "input": {
    "values": [
      "EMAIL",
      "datetime",
      "datetime-local",
      "range"
    ]
  },
  "output": {
    "recognized": [
      true,
      false,
      true,
      true
    ],
    "states": [
      "email",
      "text",
      "datetime-local",
      "range"
    ]
  }
} satisfies ToolExample<InputTypesFullListLookupInput, InputTypesFullListLookupOutput>;
export const inputTypesFullListLookupTool = defineTool<InputTypesFullListLookupInput, InputTypesFullListLookupOutput>({
  id: "html/input-types-full-list-lookup",
  title: "Input Types Full List Lookup",
  description: "Looks up all 22 standard input type keywords and resolves unknown or missing values to text. Keyword matching is ASCII case insensitive without trimming.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: inputTypesFullListLookupInputSchema,
  outputSchema: inputTypesFullListLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Values",
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
        "id": "recognized",
        "label": "Recognized",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "states",
        "label": "States",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateInputTypesFullListLookup,
});
export const runInputTypesFullListLookup = inputTypesFullListLookupTool.execute;
export default inputTypesFullListLookupTool;
