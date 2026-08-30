import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BIVsStrongEmSemanticSplitLookupInput = {
  readonly tag: "b" | "i" | "strong" | "em";
};
export type BIVsStrongEmSemanticSplitLookupOutput = {
  readonly meaning: "attention" | "alternate-voice" | "importance" | "stress-emphasis";
};
export const bIVsStrongEmSemanticSplitLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tag": {
      "type": "string",
      "enum": [
        "b",
        "i",
        "strong",
        "em"
      ],
      "description": "Tag"
    }
  },
  "required": [
    "tag"
  ]
} as const satisfies ToolJsonSchema;
export const bIVsStrongEmSemanticSplitLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "meaning": {
      "type": "string",
      "enum": [
        "attention",
        "alternate-voice",
        "importance",
        "stress-emphasis"
      ],
      "description": "Meaning"
    }
  },
  "required": [
    "meaning"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html
export const calculateBIVsStrongEmSemanticSplitLookup = (rawInput: unknown): ToolResult<BIVsStrongEmSemanticSplitLookupOutput> => {
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
if (tagValue !== "b" && tagValue !== "i" && tagValue !== "strong" && tagValue !== "em") return issue("tag", "invalid_value", "Choose a supported value.");
  const input: BIVsStrongEmSemanticSplitLookupInput = { tag: tagValue };
 const meaning = input.tag === "b" ? "attention" : input.tag === "i" ? "alternate-voice" : input.tag === "strong" ? "importance" : "stress-emphasis";
 return toolSuccess({ meaning });
};
export const example = {
  "input": {
    "tag": "i"
  },
  "output": {
    "meaning": "alternate-voice"
  }
} satisfies ToolExample<BIVsStrongEmSemanticSplitLookupInput, BIVsStrongEmSemanticSplitLookupOutput>;
export const bIVsStrongEmSemanticSplitLookupTool = defineTool<BIVsStrongEmSemanticSplitLookupInput, BIVsStrongEmSemanticSplitLookupOutput>({
  id: "html/b-i-vs-strong-em-semantic-split-lookup",
  title: "b/i vs strong/em Semantic Split",
  description: "Classifies b, i, strong and em by standard meaning: attention, alternate voice, importance or stress emphasis. Font weight and style are not inferred.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bIVsStrongEmSemanticSplitLookupInputSchema,
  outputSchema: bIVsStrongEmSemanticSplitLookupOutputSchema,
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
        "id": "meaning",
        "label": "Meaning",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateBIVsStrongEmSemanticSplitLookup,
});
export const runBIVsStrongEmSemanticSplitLookup = bIVsStrongEmSemanticSplitLookupTool.execute;
export default bIVsStrongEmSemanticSplitLookupTool;
