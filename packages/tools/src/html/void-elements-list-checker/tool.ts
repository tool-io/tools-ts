import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type VoidElementsListCheckerInput = {
  readonly names: ReadonlyArray<string>;
};
export type VoidElementsListCheckerOutput = {
  readonly isVoid: ReadonlyArray<boolean>;
  readonly voidCount: number;
};
export const voidElementsListCheckerInputSchema = {
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
export const voidElementsListCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isVoid": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Is Void"
    },
    "voidCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Void Count"
    }
  },
  "required": [
    "isVoid",
    "voidCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);
export const asciiLower = (text: string): string => text.replace(/[A-Z]/g, character => character.toLowerCase());
export const htmlTokens = (text: string): string[] => text.split(/[\t\n\f\r ]+/).filter(token => token.length > 0);
export const escapeAttribute = (text: string): string => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const voidNames = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
// Reference: https://html.spec.whatwg.org/multipage/syntax.html#void-elements
export const calculateVoidElementsListChecker = (rawInput: unknown): ToolResult<VoidElementsListCheckerOutput> => {
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
  const input: VoidElementsListCheckerInput = { names: validatedNames };
  const isVoid = input.names.map(name => voidNames.has(asciiLower(name)));
  return toolSuccess({ isVoid, voidCount: isVoid.filter(Boolean).length });
};
export const example = {
  "input": {
    "names": [
      "IMG",
      "div",
      "br",
      "source"
    ]
  },
  "output": {
    "isVoid": [
      true,
      false,
      true,
      true
    ],
    "voidCount": 3
  }
} satisfies ToolExample<VoidElementsListCheckerInput, VoidElementsListCheckerOutput>;
export const voidElementsListCheckerTool = defineTool<VoidElementsListCheckerInput, VoidElementsListCheckerOutput>({
  id: "html/void-elements-list-checker",
  title: "Void Elements List Checker",
  description: "Checks parsed HTML element names against the 13 current void elements; names are ASCII case insensitive. This does not parse markup or classify obsolete elements.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: voidElementsListCheckerInputSchema,
  outputSchema: voidElementsListCheckerOutputSchema,
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
        "id": "isVoid",
        "label": "Is Void",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "voidCount",
        "label": "Void Count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateVoidElementsListChecker,
});
export const runVoidElementsListChecker = voidElementsListCheckerTool.execute;
export default voidElementsListCheckerTool;
