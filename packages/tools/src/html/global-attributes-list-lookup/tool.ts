import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type GlobalAttributesListLookupInput = {
  readonly names: ReadonlyArray<string>;
};
export type GlobalAttributesListLookupOutput = {
  readonly isNamedGlobal: ReadonlyArray<boolean>;
  readonly isExtensionFamily: ReadonlyArray<boolean>;
};
export const globalAttributesListLookupInputSchema = {
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
export const globalAttributesListLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isNamedGlobal": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Is Named Global"
    },
    "isExtensionFamily": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Is Extension Family"
    }
  },
  "required": [
    "isNamedGlobal",
    "isExtensionFamily"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/dom.html#global-attributes
export const calculateGlobalAttributesListLookup = (rawInput: unknown): ToolResult<GlobalAttributesListLookupOutput> => {
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
  const input: GlobalAttributesListLookupInput = { names: validatedNames };
  const names = input.names.map(asciiLower);
  const globals = new Set([
  "accesskey",
  "autocapitalize",
  "autocorrect",
  "autofocus",
  "class",
  "contenteditable",
  "dir",
  "draggable",
  "enterkeyhint",
  "headingoffset",
  "headingreset",
  "hidden",
  "id",
  "inert",
  "inputmode",
  "is",
  "itemid",
  "itemprop",
  "itemref",
  "itemscope",
  "itemtype",
  "lang",
  "nonce",
  "popover",
  "slot",
  "spellcheck",
  "style",
  "tabindex",
  "title",
  "translate",
  "writingsuggestions"
]);
  return toolSuccess({ isNamedGlobal: names.map(name => globals.has(name)), isExtensionFamily: names.map(name => name.startsWith("data-") && name.length > 5 || name.startsWith("aria-") && name.length > 5) });
};
export const example = {
  "input": {
    "names": [
      "CLASS",
      "headingoffset",
      "href",
      "data-user",
      "aria-label"
    ]
  },
  "output": {
    "isNamedGlobal": [
      true,
      true,
      false,
      false,
      false
    ],
    "isExtensionFamily": [
      false,
      false,
      false,
      true,
      true
    ]
  }
} satisfies ToolExample<GlobalAttributesListLookupInput, GlobalAttributesListLookupOutput>;
export const globalAttributesListLookupTool = defineTool<GlobalAttributesListLookupInput, GlobalAttributesListLookupOutput>({
  id: "html/global-attributes-list-lookup",
  title: "Global Attributes List Lookup",
  description: "Looks up named HTML global attributes including DOM class, id and slot. Separately identifies data-* and aria-* families without validating individual family names or event handlers.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: globalAttributesListLookupInputSchema,
  outputSchema: globalAttributesListLookupOutputSchema,
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
        "id": "isNamedGlobal",
        "label": "Is Named Global",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "isExtensionFamily",
        "label": "Is Extension Family",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ]
  },
  execute: calculateGlobalAttributesListLookup,
});
export const runGlobalAttributesListLookup = globalAttributesListLookupTool.execute;
export default globalAttributesListLookupTool;
