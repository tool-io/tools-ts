import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type AnchorTargetValuesLookupInput = {
  readonly target: string;
};
export type AnchorTargetValuesLookupOutput = {
  readonly kind: "keyword" | "named" | "empty" | "invalid";
  readonly keyword: string;
  readonly valid: boolean;
};
export const anchorTargetValuesLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "target": {
      "type": "string",
      "maxLength": 100000,
      "description": "Target"
    }
  },
  "required": [
    "target"
  ]
} as const satisfies ToolJsonSchema;
export const anchorTargetValuesLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "keyword",
        "named",
        "empty",
        "invalid"
      ],
      "description": "Kind"
    },
    "keyword": {
      "type": "string",
      "description": "Keyword"
    },
    "valid": {
      "type": "boolean",
      "description": "Valid"
    }
  },
  "required": [
    "kind",
    "keyword",
    "valid"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword
export const calculateAnchorTargetValuesLookup = (rawInput: unknown): ToolResult<AnchorTargetValuesLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly target?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "target"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const targetValue = candidate.target;
if (typeof targetValue !== "string") return issue("target", "invalid_type", "Enter a string value.");
if (targetValue.length > 100000) return issue("target", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: AnchorTargetValuesLookupInput = { target: targetValue };
 const keyword = asciiLower(input.target);
 const known = ["_blank", "_self", "_parent", "_top"].includes(keyword);
 const named = input.target.length > 0 && !input.target.startsWith("_") && !(/[\t\n\r]/.test(input.target) && input.target.includes("<"));
 const kind = known ? "keyword" : input.target.length === 0 ? "empty" : named ? "named" : "invalid";
 return toolSuccess({ kind, keyword: known ? keyword : "", valid: known || named });
};
export const example = {
  "input": {
    "target": "_BLANK"
  },
  "output": {
    "kind": "keyword",
    "keyword": "_blank",
    "valid": true
  }
} satisfies ToolExample<AnchorTargetValuesLookupInput, AnchorTargetValuesLookupOutput>;
export const anchorTargetValuesLookupTool = defineTool<AnchorTargetValuesLookupInput, AnchorTargetValuesLookupOutput>({
  id: "html/anchor-target-values-lookup",
  title: "Anchor target Values Lookup",
  description: "Classifies standard HTML navigable target keywords or valid named targets. Empty values default to the current context. Browser-specific target extensions are excluded.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: anchorTargetValuesLookupInputSchema,
  outputSchema: anchorTargetValuesLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "target",
        "label": "Target",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "kind",
        "label": "Kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "keyword",
        "label": "Keyword",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateAnchorTargetValuesLookup,
});
export const runAnchorTargetValuesLookup = anchorTargetValuesLookupTool.execute;
export default anchorTargetValuesLookupTool;
