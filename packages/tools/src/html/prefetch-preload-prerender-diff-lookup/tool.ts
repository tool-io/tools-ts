import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PrefetchPreloadPrerenderDiffLookupInput = {
  readonly hint: "preload" | "prefetch" | "prerender";
};
export type PrefetchPreloadPrerenderDiffLookupOutput = {
  readonly navigation: "current" | "future";
  readonly mechanism: "link" | "speculation-rules";
  readonly preparesDocument: boolean;
};
export const prefetchPreloadPrerenderDiffLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hint": {
      "type": "string",
      "enum": [
        "preload",
        "prefetch",
        "prerender"
      ],
      "description": "Hint"
    }
  },
  "required": [
    "hint"
  ]
} as const satisfies ToolJsonSchema;
export const prefetchPreloadPrerenderDiffLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "navigation": {
      "type": "string",
      "enum": [
        "current",
        "future"
      ],
      "description": "Navigation"
    },
    "mechanism": {
      "type": "string",
      "enum": [
        "link",
        "speculation-rules"
      ],
      "description": "Mechanism"
    },
    "preparesDocument": {
      "type": "boolean",
      "description": "Prepares Document"
    }
  },
  "required": [
    "navigation",
    "mechanism",
    "preparesDocument"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#link-type-preload; https://wicg.github.io/nav-speculation/prerendering.html
export const calculatePrefetchPreloadPrerenderDiffLookup = (rawInput: unknown): ToolResult<PrefetchPreloadPrerenderDiffLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly hint?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "hint"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hintValue = candidate.hint;
if (typeof hintValue !== "string") return issue("hint", "invalid_type", "Enter a string value.");
if (hintValue !== "preload" && hintValue !== "prefetch" && hintValue !== "prerender") return issue("hint", "invalid_value", "Choose a supported value.");
  const input: PrefetchPreloadPrerenderDiffLookupInput = { hint: hintValue };
 return toolSuccess({ navigation: input.hint === "preload" ? "current" : "future", mechanism: input.hint === "prerender" ? "speculation-rules" : "link", preparesDocument: input.hint === "prerender" });
};
export const example = {
  "input": {
    "hint": "prerender"
  },
  "output": {
    "navigation": "future",
    "mechanism": "speculation-rules",
    "preparesDocument": true
  }
} satisfies ToolExample<PrefetchPreloadPrerenderDiffLookupInput, PrefetchPreloadPrerenderDiffLookupOutput>;
export const prefetchPreloadPrerenderDiffLookupTool = defineTool<PrefetchPreloadPrerenderDiffLookupInput, PrefetchPreloadPrerenderDiffLookupOutput>({
  id: "html/prefetch-preload-prerender-diff-lookup",
  title: "prefetch/preload/prerender Diff Lookup",
  description: "Distinguishes current-resource preload, future-resource prefetch and future-document prerender. Prerender uses speculation rules in this profile. Outputs describe intended work, not guaranteed browser support or network activity.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: prefetchPreloadPrerenderDiffLookupInputSchema,
  outputSchema: prefetchPreloadPrerenderDiffLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hint",
        "label": "Hint",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "navigation",
        "label": "Navigation",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "mechanism",
        "label": "Mechanism",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "preparesDocument",
        "label": "Prepares Document",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculatePrefetchPreloadPrerenderDiffLookup,
});
export const runPrefetchPreloadPrerenderDiffLookup = prefetchPreloadPrerenderDiffLookupTool.execute;
export default prefetchPreloadPrerenderDiffLookupTool;
