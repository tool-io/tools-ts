import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type BooleanAttributesListLookupInput = {
  readonly names: ReadonlyArray<string>;
};
export type BooleanAttributesListLookupOutput = {
  readonly isBoolean: ReadonlyArray<boolean>;
  readonly booleanCount: number;
};
export const booleanAttributesListLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "names": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Names"
    }
  },
  "required": [
    "names"
  ]
} as const satisfies ToolJsonSchema;
export const booleanAttributesListLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isBoolean": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Is Boolean"
    },
    "booleanCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Boolean Count"
    }
  },
  "required": [
    "isBoolean",
    "booleanCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/indices.html
export const calculateBooleanAttributesListLookup = (rawInput: unknown): ToolResult<BooleanAttributesListLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly names?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "names"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const namesValue = candidate.names;
if (!Array.isArray(namesValue)) return issue("names", "invalid_type", "Enter a dense array.");
if (namesValue.length < 0) return issue("names", "out_of_range", "Too few entries.");
if (namesValue.length > 10000) return issue("names", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedNames: string[] = [];
for (let index = 0; index < namesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(namesValue, index)) return issue(`names.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = namesValue[index];
if (typeof item !== "string") return issue(`names.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`names.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedNames.push(item);
}
if (validatedNames.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("names", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: BooleanAttributesListLookupInput = { names: validatedNames };
  const names = new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "headingreset",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootcustomelementregistry",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
  const isBoolean = input.names.map(name => names.has(asciiLower(name)));
  return toolSuccess({ isBoolean, booleanCount: isBoolean.filter(Boolean).length });
};
export const example = {
  "input": {
    "names": [
      "disabled",
      "hidden",
      "READONLY",
      "draggable"
    ]
  },
  "output": {
    "isBoolean": [
      true,
      false,
      true,
      false
    ],
    "booleanCount": 2
  }
} satisfies ToolExample<BooleanAttributesListLookupInput, BooleanAttributesListLookupOutput>;
export const booleanAttributesListLookupTool = defineTool<BooleanAttributesListLookupInput, BooleanAttributesListLookupOutput>({
  id: "html/boolean-attributes-list-lookup",
  title: "Boolean Attributes List Lookup",
  description: "Looks up current standard HTML boolean attribute names, independent of their element applicability. Enumerated hidden, draggable and contenteditable are excluded.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: booleanAttributesListLookupInputSchema,
  outputSchema: booleanAttributesListLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "names",
        "label": "Names",
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
        "id": "isBoolean",
        "label": "Is Boolean",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "booleanCount",
        "label": "Boolean Count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateBooleanAttributesListLookup,
});
export const runBooleanAttributesListLookup = booleanAttributesListLookupTool.execute;
export default booleanAttributesListLookupTool;
