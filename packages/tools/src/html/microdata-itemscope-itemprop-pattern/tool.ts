import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { htmlTokens } from "../void-elements-list-checker/tool.js";
export type MicrodataItemscopeItempropPatternInput = {
  readonly itemscope: boolean;
  readonly hasItemprop: boolean;
  readonly itemprop: string;
};
export type MicrodataItemscopeItempropPatternOutput = {
  readonly introducesItem: boolean;
  readonly propertyNames: ReadonlyArray<string>;
  readonly nestedItemValue: boolean;
  readonly uniqueNonemptyProperties: boolean;
};
export const microdataItemscopeItempropPatternInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "itemscope": {
      "type": "boolean",
      "description": "Itemscope"
    },
    "hasItemprop": {
      "type": "boolean",
      "description": "Has Itemprop"
    },
    "itemprop": {
      "type": "string",
      "maxLength": 100000,
      "description": "Itemprop"
    }
  },
  "required": [
    "itemscope",
    "hasItemprop",
    "itemprop"
  ]
} as const satisfies ToolJsonSchema;
export const microdataItemscopeItempropPatternOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "introducesItem": {
      "type": "boolean",
      "description": "Introduces Item"
    },
    "propertyNames": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Property Names"
    },
    "nestedItemValue": {
      "type": "boolean",
      "description": "Nested Item Value"
    },
    "uniqueNonemptyProperties": {
      "type": "boolean",
      "description": "Unique Nonempty Properties"
    }
  },
  "required": [
    "introducesItem",
    "propertyNames",
    "nestedItemValue",
    "uniqueNonemptyProperties"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/microdata.html#items
export const calculateMicrodataItemscopeItempropPattern = (rawInput: unknown): ToolResult<MicrodataItemscopeItempropPatternOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly itemscope?: unknown; readonly hasItemprop?: unknown; readonly itemprop?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "itemscope",
  "hasItemprop",
  "itemprop"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const itemscopeValue = candidate.itemscope;
if (typeof itemscopeValue !== "boolean") return issue("itemscope", "invalid_type", "Enter a boolean value.");
const hasItempropValue = candidate.hasItemprop;
if (typeof hasItempropValue !== "boolean") return issue("hasItemprop", "invalid_type", "Enter a boolean value.");
const itempropValue = candidate.itemprop;
if (typeof itempropValue !== "string") return issue("itemprop", "invalid_type", "Enter a string value.");
if (itempropValue.length > 100000) return issue("itemprop", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: MicrodataItemscopeItempropPatternInput = { itemscope: itemscopeValue, hasItemprop: hasItempropValue, itemprop: itempropValue };
 const tokens = input.hasItemprop ? htmlTokens(input.itemprop) : [];
 const propertyNames = [...new Set(tokens)];
 return toolSuccess({ introducesItem: input.itemscope, propertyNames, nestedItemValue: input.itemscope && propertyNames.length > 0, uniqueNonemptyProperties: !input.hasItemprop || tokens.length > 0 && tokens.length === propertyNames.length });
};
export const example = {
  "input": {
    "itemscope": true,
    "hasItemprop": true,
    "itemprop": "author editor"
  },
  "output": {
    "introducesItem": true,
    "propertyNames": [
      "author",
      "editor"
    ],
    "nestedItemValue": true,
    "uniqueNonemptyProperties": true
  }
} satisfies ToolExample<MicrodataItemscopeItempropPatternInput, MicrodataItemscopeItempropPatternOutput>;
export const microdataItemscopeItempropPatternTool = defineTool<MicrodataItemscopeItempropPatternInput, MicrodataItemscopeItempropPatternOutput>({
  id: "html/microdata-itemscope-itemprop-pattern",
  title: "Microdata itemscope/itemprop Pattern",
  description: "Classifies itemscope and parsed itemprop tokens: an item scope introduces an item and can itself be a property value of an enclosing item. This checks token presence and uniqueness, without validating vocabularies or the full item graph.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: microdataItemscopeItempropPatternInputSchema,
  outputSchema: microdataItemscopeItempropPatternOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "itemscope",
        "label": "Itemscope",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "hasItemprop",
        "label": "Has Itemprop",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "itemprop",
        "label": "Itemprop",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "introducesItem",
        "label": "Introduces Item",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "propertyNames",
        "label": "Property Names",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "nestedItemValue",
        "label": "Nested Item Value",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "uniqueNonemptyProperties",
        "label": "Unique Nonempty Properties",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateMicrodataItemscopeItempropPattern,
});
export const runMicrodataItemscopeItempropPattern = microdataItemscopeItempropPatternTool.execute;
export default microdataItemscopeItempropPatternTool;
