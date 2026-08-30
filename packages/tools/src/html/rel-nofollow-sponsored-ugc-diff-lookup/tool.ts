import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type RelNofollowSponsoredUgcDiffLookupInput = {
  readonly rel: string;
};
export type RelNofollowSponsoredUgcDiffLookupOutput = {
  readonly nofollow: boolean;
  readonly sponsored: boolean;
  readonly userGenerated: boolean;
};
export const relNofollowSponsoredUgcDiffLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rel": {
      "type": "string",
      "maxLength": 100000,
      "description": "Rel"
    }
  },
  "required": [
    "rel"
  ]
} as const satisfies ToolJsonSchema;
export const relNofollowSponsoredUgcDiffLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "nofollow": {
      "type": "boolean",
      "description": "Nofollow"
    },
    "sponsored": {
      "type": "boolean",
      "description": "Sponsored"
    },
    "userGenerated": {
      "type": "boolean",
      "description": "User Generated"
    }
  },
  "required": [
    "nofollow",
    "sponsored",
    "userGenerated"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
export const calculateRelNofollowSponsoredUgcDiffLookup = (rawInput: unknown): ToolResult<RelNofollowSponsoredUgcDiffLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly rel?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "rel"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const relValue = candidate.rel;
if (typeof relValue !== "string") return issue("rel", "invalid_type", "Enter a string value.");
if (relValue.length > 100000) return issue("rel", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: RelNofollowSponsoredUgcDiffLookupInput = { rel: relValue };
 const tokens = htmlTokens(input.rel).map(asciiLower);
 return toolSuccess({ nofollow: tokens.includes("nofollow"), sponsored: tokens.includes("sponsored"), userGenerated: tokens.includes("ugc") });
};
export const example = {
  "input": {
    "rel": "sponsored nofollow"
  },
  "output": {
    "nofollow": true,
    "sponsored": true,
    "userGenerated": false
  }
} satisfies ToolExample<RelNofollowSponsoredUgcDiffLookupInput, RelNofollowSponsoredUgcDiffLookupOutput>;
export const relNofollowSponsoredUgcDiffLookupTool = defineTool<RelNofollowSponsoredUgcDiffLookupInput, RelNofollowSponsoredUgcDiffLookupOutput>({
  id: "html/rel-nofollow-sponsored-ugc-diff-lookup",
  title: "nofollow/sponsored/ugc Difference Lookup",
  description: "Classifies nofollow, sponsored and ugc link annotations according to Google Search guidance. These annotations do not suppress browser navigation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: relNofollowSponsoredUgcDiffLookupInputSchema,
  outputSchema: relNofollowSponsoredUgcDiffLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "rel",
        "label": "Rel",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "nofollow",
        "label": "Nofollow",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "sponsored",
        "label": "Sponsored",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "userGenerated",
        "label": "User Generated",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateRelNofollowSponsoredUgcDiffLookup,
});
export const runRelNofollowSponsoredUgcDiffLookup = relNofollowSponsoredUgcDiffLookupTool.execute;
export default relNofollowSponsoredUgcDiffLookupTool;
