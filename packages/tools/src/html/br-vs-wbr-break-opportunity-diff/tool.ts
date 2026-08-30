import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BrVsWbrBreakOpportunityDiffInput = {
  readonly tag: "br" | "wbr";
};
export type BrVsWbrBreakOpportunityDiffOutput = {
  readonly lineBreak: boolean;
  readonly optionalBreakOpportunity: boolean;
};
export const brVsWbrBreakOpportunityDiffInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tag": {
      "type": "string",
      "enum": [
        "br",
        "wbr"
      ],
      "description": "Tag"
    }
  },
  "required": [
    "tag"
  ]
} as const satisfies ToolJsonSchema;
export const brVsWbrBreakOpportunityDiffOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "lineBreak": {
      "type": "boolean",
      "description": "Line Break"
    },
    "optionalBreakOpportunity": {
      "type": "boolean",
      "description": "Optional Break Opportunity"
    }
  },
  "required": [
    "lineBreak",
    "optionalBreakOpportunity"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-br-element; https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-wbr-element
export const calculateBrVsWbrBreakOpportunityDiff = (rawInput: unknown): ToolResult<BrVsWbrBreakOpportunityDiffOutput> => {
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
if (tagValue !== "br" && tagValue !== "wbr") return issue("tag", "invalid_value", "Choose a supported value.");
  const input: BrVsWbrBreakOpportunityDiffInput = { tag: tagValue };
 return toolSuccess({ lineBreak: input.tag === "br", optionalBreakOpportunity: input.tag === "wbr" });
};
export const example = {
  "input": {
    "tag": "wbr"
  },
  "output": {
    "lineBreak": false,
    "optionalBreakOpportunity": true
  }
} satisfies ToolExample<BrVsWbrBreakOpportunityDiffInput, BrVsWbrBreakOpportunityDiffOutput>;
export const brVsWbrBreakOpportunityDiffTool = defineTool<BrVsWbrBreakOpportunityDiffInput, BrVsWbrBreakOpportunityDiffOutput>({
  id: "html/br-vs-wbr-break-opportunity-diff",
  title: "br vs wbr Break Opportunity Diff",
  description: "Distinguishes a br line break from a wbr line-break opportunity. Both are void elements; actual line wrapping depends on layout.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: brVsWbrBreakOpportunityDiffInputSchema,
  outputSchema: brVsWbrBreakOpportunityDiffOutputSchema,
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
        "id": "lineBreak",
        "label": "Line Break",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "optionalBreakOpportunity",
        "label": "Optional Break Opportunity",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateBrVsWbrBreakOpportunityDiff,
});
export const runBrVsWbrBreakOpportunityDiff = brVsWbrBreakOpportunityDiffTool.execute;
export default brVsWbrBreakOpportunityDiffTool;
