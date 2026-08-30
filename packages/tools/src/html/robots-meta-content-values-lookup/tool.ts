import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type RobotsMetaContentValuesLookupInput = {
  readonly content: string;
};
export type RobotsMetaContentValuesLookupOutput = {
  readonly indexAllowed: boolean;
  readonly followAllowed: boolean;
  readonly recognized: ReadonlyArray<string>;
  readonly unhandled: ReadonlyArray<string>;
};
export const robotsMetaContentValuesLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "content": {
      "type": "string",
      "maxLength": 100000,
      "description": "Content"
    }
  },
  "required": [
    "content"
  ]
} as const satisfies ToolJsonSchema;
export const robotsMetaContentValuesLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "indexAllowed": {
      "type": "boolean",
      "description": "Index Allowed"
    },
    "followAllowed": {
      "type": "boolean",
      "description": "Follow Allowed"
    },
    "recognized": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Recognized"
    },
    "unhandled": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Unhandled"
    }
  },
  "required": [
    "indexAllowed",
    "followAllowed",
    "recognized",
    "unhandled"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
export const calculateRobotsMetaContentValuesLookup = (rawInput: unknown): ToolResult<RobotsMetaContentValuesLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly content?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "content"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const contentValue = candidate.content;
if (typeof contentValue !== "string") return issue("content", "invalid_type", "Enter a string value.");
if (contentValue.length > 100000) return issue("content", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: RobotsMetaContentValuesLookupInput = { content: contentValue };
 const tokens = input.content.split(/[,\t\n\f\r ]+/).filter(Boolean).map(asciiLower);
 const known = new Set(["all", "none", "index", "noindex", "follow", "nofollow", "nosnippet", "noimageindex", "notranslate", "indexifembedded"]);
 return toolSuccess({ indexAllowed: !tokens.some(token => token === "none" || token === "noindex"), followAllowed: !tokens.some(token => token === "none" || token === "nofollow"), recognized: [...new Set(tokens.filter(token => known.has(token)))], unhandled: [...new Set(tokens.filter(token => !known.has(token)))] });
};
export const example = {
  "input": {
    "content": "index, noindex, follow, max-snippet:20"
  },
  "output": {
    "indexAllowed": false,
    "followAllowed": true,
    "recognized": [
      "index",
      "noindex",
      "follow"
    ],
    "unhandled": [
      "max-snippet:20"
    ]
  }
} satisfies ToolExample<RobotsMetaContentValuesLookupInput, RobotsMetaContentValuesLookupOutput>;
export const robotsMetaContentValuesLookupTool = defineTool<RobotsMetaContentValuesLookupInput, RobotsMetaContentValuesLookupOutput>({
  id: "html/robots-meta-content-values-lookup",
  title: "Robots Meta Content Values Lookup",
  description: "Resolves Google Search robots index and follow directives, including all/none and restrictive conflicts. Reports recognized boolean directives and unhandled tokens; parameterized directives are outside this profile.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: robotsMetaContentValuesLookupInputSchema,
  outputSchema: robotsMetaContentValuesLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "content",
        "label": "Content",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "indexAllowed",
        "label": "Index Allowed",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "followAllowed",
        "label": "Follow Allowed",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "recognized",
        "label": "Recognized",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "unhandled",
        "label": "Unhandled",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateRobotsMetaContentValuesLookup,
});
export const runRobotsMetaContentValuesLookup = robotsMetaContentValuesLookupTool.execute;
export default robotsMetaContentValuesLookupTool;
