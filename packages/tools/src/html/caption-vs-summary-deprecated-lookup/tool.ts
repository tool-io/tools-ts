import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CaptionVsSummaryDeprecatedLookupInput = {
  readonly construct: "caption" | "summary-attribute";
};
export type CaptionVsSummaryDeprecatedLookupOutput = {
  readonly conforming: boolean;
  readonly providesTableCaption: boolean;
  readonly obsolete: boolean;
};
export const captionVsSummaryDeprecatedLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "construct": {
      "type": "string",
      "enum": [
        "caption",
        "summary-attribute"
      ],
      "description": "Construct"
    }
  },
  "required": [
    "construct"
  ]
} as const satisfies ToolJsonSchema;
export const captionVsSummaryDeprecatedLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "conforming": {
      "type": "boolean",
      "description": "Conforming"
    },
    "providesTableCaption": {
      "type": "boolean",
      "description": "Provides Table Caption"
    },
    "obsolete": {
      "type": "boolean",
      "description": "Obsolete"
    }
  },
  "required": [
    "conforming",
    "providesTableCaption",
    "obsolete"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/tables.html#the-caption-element; https://html.spec.whatwg.org/multipage/obsolete.html#attr-table-summary
export const calculateCaptionVsSummaryDeprecatedLookup = (rawInput: unknown): ToolResult<CaptionVsSummaryDeprecatedLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly construct?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "construct"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const constructValue = candidate.construct;
if (typeof constructValue !== "string") return issue("construct", "invalid_type", "Enter a string value.");
if (constructValue !== "caption" && constructValue !== "summary-attribute") return issue("construct", "invalid_value", "Choose a supported value.");
  const input: CaptionVsSummaryDeprecatedLookupInput = { construct: constructValue };
 const caption = input.construct === "caption";
 return toolSuccess({ conforming: caption, providesTableCaption: caption, obsolete: !caption });
};
export const example = {
  "input": {
    "construct": "caption"
  },
  "output": {
    "conforming": true,
    "providesTableCaption": true,
    "obsolete": false
  }
} satisfies ToolExample<CaptionVsSummaryDeprecatedLookupInput, CaptionVsSummaryDeprecatedLookupOutput>;
export const captionVsSummaryDeprecatedLookupTool = defineTool<CaptionVsSummaryDeprecatedLookupInput, CaptionVsSummaryDeprecatedLookupOutput>({
  id: "html/caption-vs-summary-deprecated-lookup",
  title: "caption vs summary Deprecated Lookup",
  description: "Classifies a table caption element versus the obsolete summary attribute for current authoring conformance. This reports syntax status and caption semantics only.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: captionVsSummaryDeprecatedLookupInputSchema,
  outputSchema: captionVsSummaryDeprecatedLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "construct",
        "label": "Construct",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "conforming",
        "label": "Conforming",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "providesTableCaption",
        "label": "Provides Table Caption",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "obsolete",
        "label": "Obsolete",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateCaptionVsSummaryDeprecatedLookup,
});
export const runCaptionVsSummaryDeprecatedLookup = captionVsSummaryDeprecatedLookupTool.execute;
export default captionVsSummaryDeprecatedLookupTool;
