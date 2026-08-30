import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type FaviconLinkRelSizesLookupInput = {
  readonly rel: string;
  readonly sizes: string;
};
export type FaviconLinkRelSizesLookupOutput = {
  readonly iconRelation: boolean;
  readonly validSizes: boolean;
  readonly scalable: boolean;
  readonly widths: ReadonlyArray<string>;
  readonly heights: ReadonlyArray<string>;
};
export const faviconLinkRelSizesLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rel": {
      "type": "string",
      "maxLength": 100000,
      "description": "Rel"
    },
    "sizes": {
      "type": "string",
      "maxLength": 100000,
      "description": "Sizes"
    }
  },
  "required": [
    "rel",
    "sizes"
  ]
} as const satisfies ToolJsonSchema;
export const faviconLinkRelSizesLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "iconRelation": {
      "type": "boolean",
      "description": "Icon Relation"
    },
    "validSizes": {
      "type": "boolean",
      "description": "Valid Sizes"
    },
    "scalable": {
      "type": "boolean",
      "description": "Scalable"
    },
    "widths": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Widths"
    },
    "heights": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Heights"
    }
  },
  "required": [
    "iconRelation",
    "validSizes",
    "scalable",
    "widths",
    "heights"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/semantics.html#attr-link-sizes
export const calculateFaviconLinkRelSizesLookup = (rawInput: unknown): ToolResult<FaviconLinkRelSizesLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly rel?: unknown; readonly sizes?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "rel",
  "sizes"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const relValue = candidate.rel;
if (typeof relValue !== "string") return issue("rel", "invalid_type", "Enter a string value.");
if (relValue.length > 100000) return issue("rel", "resource_limit", "Text exceeds the 100000-character resource limit.");
const sizesValue = candidate.sizes;
if (typeof sizesValue !== "string") return issue("sizes", "invalid_type", "Enter a string value.");
if (sizesValue.length > 100000) return issue("sizes", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: FaviconLinkRelSizesLookupInput = { rel: relValue, sizes: sizesValue };
 const relation = htmlTokens(input.rel).map(asciiLower);
 const tokens = htmlTokens(input.sizes).map(asciiLower);
 const widths: string[] = [], heights: string[] = [];
 let validSizes = new Set(tokens).size === tokens.length;
 for (const token of tokens) {
   if (token === "any") continue;
   const match = /^([1-9][0-9]*)x([1-9][0-9]*)$(?![\s\S])/.exec(token);
   if (match === null || match[1] === undefined || match[2] === undefined) { validSizes = false; continue; }
   widths.push(match[1]); heights.push(match[2]);
 }
 return toolSuccess({ iconRelation: relation.includes("icon") || relation.includes("apple-touch-icon"), validSizes, scalable: tokens.includes("any"), widths, heights });
};
export const example = {
  "input": {
    "rel": "icon",
    "sizes": "16x16 32X32 any"
  },
  "output": {
    "iconRelation": true,
    "validSizes": true,
    "scalable": true,
    "widths": [
      "16",
      "32"
    ],
    "heights": [
      "16",
      "32"
    ]
  }
} satisfies ToolExample<FaviconLinkRelSizesLookupInput, FaviconLinkRelSizesLookupOutput>;
export const faviconLinkRelSizesLookupTool = defineTool<FaviconLinkRelSizesLookupInput, FaviconLinkRelSizesLookupOutput>({
  id: "html/favicon-link-rel-sizes-lookup",
  title: "Favicon link rel sizes Lookup",
  description: "Checks parsed link rel and icon sizes tokens against the standard any or positive width x height syntax without leading zeros. Dimensions are returned as exact decimal strings.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: faviconLinkRelSizesLookupInputSchema,
  outputSchema: faviconLinkRelSizesLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "rel",
        "label": "Rel",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "sizes",
        "label": "Sizes",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "iconRelation",
        "label": "Icon Relation",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "validSizes",
        "label": "Valid Sizes",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "scalable",
        "label": "Scalable",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "widths",
        "label": "Widths",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "heights",
        "label": "Heights",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateFaviconLinkRelSizesLookup,
});
export const runFaviconLinkRelSizesLookup = faviconLinkRelSizesLookupTool.execute;
export default faviconLinkRelSizesLookupTool;
