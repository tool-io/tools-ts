import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BaseHrefSingleInstanceWarningInput = {
  readonly hrefs: ReadonlyArray<string>;
};
export type BaseHrefSingleInstanceWarningOutput = {
  readonly count: number;
  readonly hasBase: boolean;
  readonly multiple: boolean;
  readonly firstHref: string;
};
export const baseHrefSingleInstanceWarningInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hrefs": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Hrefs"
    }
  },
  "required": [
    "hrefs"
  ]
} as const satisfies ToolJsonSchema;
export const baseHrefSingleInstanceWarningOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "count": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Count"
    },
    "hasBase": {
      "type": "boolean",
      "description": "Has Base"
    },
    "multiple": {
      "type": "boolean",
      "description": "Multiple"
    },
    "firstHref": {
      "type": "string",
      "description": "First Href"
    }
  },
  "required": [
    "count",
    "hasBase",
    "multiple",
    "firstHref"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/semantics.html#the-base-element
export const calculateBaseHrefSingleInstanceWarning = (rawInput: unknown): ToolResult<BaseHrefSingleInstanceWarningOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly hrefs?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "hrefs"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hrefsValue = candidate.hrefs;
if (!Array.isArray(hrefsValue)) return issue("hrefs", "invalid_type", "Enter a dense array.");
if (hrefsValue.length < 0) return issue("hrefs", "out_of_range", "Too few entries.");
if (hrefsValue.length > 10000) return issue("hrefs", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedHrefs: string[] = [];
for (let index = 0; index < hrefsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(hrefsValue, index)) return issue(`hrefs.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = hrefsValue[index];
if (typeof item !== "string") return issue(`hrefs.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`hrefs.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedHrefs.push(item);
}
if (validatedHrefs.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("hrefs", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: BaseHrefSingleInstanceWarningInput = { hrefs: validatedHrefs };
 return toolSuccess({ count: input.hrefs.length, hasBase: input.hrefs.length > 0, multiple: input.hrefs.length > 1, firstHref: input.hrefs[0] ?? "" });
};
export const example = {
  "input": {
    "hrefs": [
      "/docs/",
      "/other/"
    ]
  },
  "output": {
    "count": 2,
    "hasBase": true,
    "multiple": true,
    "firstHref": "/docs/"
  }
} satisfies ToolExample<BaseHrefSingleInstanceWarningInput, BaseHrefSingleInstanceWarningOutput>;
export const baseHrefSingleInstanceWarningTool = defineTool<BaseHrefSingleInstanceWarningInput, BaseHrefSingleInstanceWarningOutput>({
  id: "html/base-href-single-instance-warning",
  title: "base href Single Instance Warning",
  description: "Reports multiple base elements with href attributes and the first such href in document order. Include empty href attributes in the vector. This checks cardinality and selection only, without URL resolution or base target attributes.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: baseHrefSingleInstanceWarningInputSchema,
  outputSchema: baseHrefSingleInstanceWarningOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hrefs",
        "label": "Hrefs",
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
        "id": "count",
        "label": "Count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "hasBase",
        "label": "Has Base",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "multiple",
        "label": "Multiple",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "firstHref",
        "label": "First Href",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateBaseHrefSingleInstanceWarning,
});
export const runBaseHrefSingleInstanceWarning = baseHrefSingleInstanceWarningTool.execute;
export default baseHrefSingleInstanceWarningTool;
