import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CiteQBlockquoteInlineBlockClassifyInput = {
  readonly tag: "cite" | "q" | "blockquote";
};
export type CiteQBlockquoteInlineBlockClassifyOutput = {
  readonly phrasing: boolean;
  readonly quotation: boolean;
  readonly workTitle: boolean;
};
export const citeQBlockquoteInlineBlockClassifyInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tag": {
      "type": "string",
      "enum": [
        "cite",
        "q",
        "blockquote"
      ],
      "description": "Tag"
    }
  },
  "required": [
    "tag"
  ]
} as const satisfies ToolJsonSchema;
export const citeQBlockquoteInlineBlockClassifyOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "phrasing": {
      "type": "boolean",
      "description": "Phrasing"
    },
    "quotation": {
      "type": "boolean",
      "description": "Quotation"
    },
    "workTitle": {
      "type": "boolean",
      "description": "Work Title"
    }
  },
  "required": [
    "phrasing",
    "quotation",
    "workTitle"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-cite-element; https://html.spec.whatwg.org/multipage/grouping-content.html#the-blockquote-element
export const calculateCiteQBlockquoteInlineBlockClassify = (rawInput: unknown): ToolResult<CiteQBlockquoteInlineBlockClassifyOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly tag?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "tag"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const tagValue = candidate.tag;
if (typeof tagValue !== "string") return issue("tag", "invalid_type", "Enter a string value.");
if (tagValue !== "cite" && tagValue !== "q" && tagValue !== "blockquote") return issue("tag", "invalid_value", "Choose a supported value.");
  const input: CiteQBlockquoteInlineBlockClassifyInput = { tag: tagValue };
 return toolSuccess({ phrasing: input.tag !== "blockquote", quotation: input.tag !== "cite", workTitle: input.tag === "cite" });
};
export const example = {
  "input": {
    "tag": "q"
  },
  "output": {
    "phrasing": true,
    "quotation": true,
    "workTitle": false
  }
} satisfies ToolExample<CiteQBlockquoteInlineBlockClassifyInput, CiteQBlockquoteInlineBlockClassifyOutput>;
export const citeQBlockquoteInlineBlockClassifyTool = defineTool<CiteQBlockquoteInlineBlockClassifyInput, CiteQBlockquoteInlineBlockClassifyOutput>({
  id: "html/cite-q-blockquote-inline-block-classify",
  title: "cite/q/blockquote Inline-Block Classify",
  description: "Classifies cite, q and blockquote by standard content category and meaning. Phrasing content is reported rather than a CSS display guarantee.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: citeQBlockquoteInlineBlockClassifyInputSchema,
  outputSchema: citeQBlockquoteInlineBlockClassifyOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "tag",
        "label": "Tag",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "phrasing",
        "label": "Phrasing",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "quotation",
        "label": "Quotation",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "workTitle",
        "label": "Work Title",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateCiteQBlockquoteInlineBlockClassify,
});
export const runCiteQBlockquoteInlineBlockClassify = citeQBlockquoteInlineBlockClassifyTool.execute;
export default citeQBlockquoteInlineBlockClassifyTool;
