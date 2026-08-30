import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MarkVsStrongDifferenceLookupInput = {
  readonly tag: "mark" | "strong";
};
export type MarkVsStrongDifferenceLookupOutput = {
  readonly contextualRelevance: boolean;
  readonly importance: boolean;
};
export const markVsStrongDifferenceLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tag": {
      "type": "string",
      "enum": [
        "mark",
        "strong"
      ],
      "description": "Tag"
    }
  },
  "required": [
    "tag"
  ]
} as const satisfies ToolJsonSchema;
export const markVsStrongDifferenceLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "contextualRelevance": {
      "type": "boolean",
      "description": "Contextual Relevance"
    },
    "importance": {
      "type": "boolean",
      "description": "Importance"
    }
  },
  "required": [
    "contextualRelevance",
    "importance"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-mark-element; https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-strong-element
export const calculateMarkVsStrongDifferenceLookup = (rawInput: unknown): ToolResult<MarkVsStrongDifferenceLookupOutput> => {
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
if (tagValue !== "mark" && tagValue !== "strong") return issue("tag", "invalid_value", "Choose a supported value.");
  const input: MarkVsStrongDifferenceLookupInput = { tag: tagValue };
 return toolSuccess({ contextualRelevance: input.tag === "mark", importance: input.tag === "strong" });
};
export const example = {
  "input": {
    "tag": "strong"
  },
  "output": {
    "contextualRelevance": false,
    "importance": true
  }
} satisfies ToolExample<MarkVsStrongDifferenceLookupInput, MarkVsStrongDifferenceLookupOutput>;
export const markVsStrongDifferenceLookupTool = defineTool<MarkVsStrongDifferenceLookupInput, MarkVsStrongDifferenceLookupOutput>({
  id: "html/mark-vs-strong-difference-lookup",
  title: "mark vs strong Difference Lookup",
  description: "Distinguishes contextual relevance marked by mark from importance, seriousness or urgency marked by strong. Appearance is controlled by CSS.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: markVsStrongDifferenceLookupInputSchema,
  outputSchema: markVsStrongDifferenceLookupOutputSchema,
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
        "id": "contextualRelevance",
        "label": "Contextual Relevance",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "importance",
        "label": "Importance",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateMarkVsStrongDifferenceLookup,
});
export const runMarkVsStrongDifferenceLookup = markVsStrongDifferenceLookupTool.execute;
export default markVsStrongDifferenceLookupTool;
