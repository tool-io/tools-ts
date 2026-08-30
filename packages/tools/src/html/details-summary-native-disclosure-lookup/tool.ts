import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type DetailsSummaryNativeDisclosureLookupInput = {
  readonly open: boolean;
  readonly children: ReadonlyArray<string>;
};
export type DetailsSummaryNativeDisclosureLookupOutput = {
  readonly bodyExposed: boolean;
  readonly summaryIndex: number;
  readonly summaryFirst: boolean;
  readonly usesDefaultSummary: boolean;
};
export const detailsSummaryNativeDisclosureLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "open": {
      "type": "boolean",
      "description": "Open"
    },
    "children": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Children"
    }
  },
  "required": [
    "open",
    "children"
  ]
} as const satisfies ToolJsonSchema;
export const detailsSummaryNativeDisclosureLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bodyExposed": {
      "type": "boolean",
      "description": "Body Exposed"
    },
    "summaryIndex": {
      "type": "integer",
      "minimum": -1,
      "maximum": 9007199254740991,
      "description": "Summary Index"
    },
    "summaryFirst": {
      "type": "boolean",
      "description": "Summary First"
    },
    "usesDefaultSummary": {
      "type": "boolean",
      "description": "Uses Default Summary"
    }
  },
  "required": [
    "bodyExposed",
    "summaryIndex",
    "summaryFirst",
    "usesDefaultSummary"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element
export const calculateDetailsSummaryNativeDisclosureLookup = (rawInput: unknown): ToolResult<DetailsSummaryNativeDisclosureLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly open?: unknown; readonly children?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "open",
  "children"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const openValue = candidate.open;
if (typeof openValue !== "boolean") return issue("open", "invalid_type", "Enter a boolean value.");
const childrenValue = candidate.children;
if (!Array.isArray(childrenValue)) return issue("children", "invalid_type", "Enter a dense array.");
if (childrenValue.length < 0) return issue("children", "out_of_range", "Too few entries.");
if (childrenValue.length > 10000) return issue("children", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedChildren: string[] = [];
for (let index = 0; index < childrenValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(childrenValue, index)) return issue(`children.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = childrenValue[index];
if (typeof item !== "string") return issue(`children.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`children.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedChildren.push(item);
}
if (validatedChildren.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("children", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: DetailsSummaryNativeDisclosureLookupInput = { open: openValue, children: validatedChildren };
 const summaryIndex = input.children.map(asciiLower).indexOf("summary");
 return toolSuccess({ bodyExposed: input.open, summaryIndex, summaryFirst: summaryIndex === 0, usesDefaultSummary: summaryIndex < 0 });
};
export const example = {
  "input": {
    "open": true,
    "children": [
      "summary",
      "p"
    ]
  },
  "output": {
    "bodyExposed": true,
    "summaryIndex": 0,
    "summaryFirst": true,
    "usesDefaultSummary": false
  }
} satisfies ToolExample<DetailsSummaryNativeDisclosureLookupInput, DetailsSummaryNativeDisclosureLookupOutput>;
export const detailsSummaryNativeDisclosureLookupTool = defineTool<DetailsSummaryNativeDisclosureLookupInput, DetailsSummaryNativeDisclosureLookupOutput>({
  id: "html/details-summary-native-disclosure-lookup",
  title: "details/summary Native Disclosure",
  description: "Reports whether details body content is exposed by the open attribute and which direct summary element is the native summary (the first one). Structural placement is reported separately from disclosure state.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: detailsSummaryNativeDisclosureLookupInputSchema,
  outputSchema: detailsSummaryNativeDisclosureLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "open",
        "label": "Open",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "children",
        "label": "Children",
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
        "id": "bodyExposed",
        "label": "Body Exposed",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "summaryIndex",
        "label": "Summary Index",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "summaryFirst",
        "label": "Summary First",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "usesDefaultSummary",
        "label": "Uses Default Summary",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateDetailsSummaryNativeDisclosureLookup,
});
export const runDetailsSummaryNativeDisclosureLookup = detailsSummaryNativeDisclosureLookupTool.execute;
export default detailsSummaryNativeDisclosureLookupTool;
