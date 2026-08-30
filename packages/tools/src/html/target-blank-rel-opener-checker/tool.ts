import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type TargetBlankRelOpenerCheckerInput = {
  readonly target: string;
  readonly rel: string;
};
export type TargetBlankRelOpenerCheckerOutput = {
  readonly blankTarget: boolean;
  readonly openerRequested: boolean;
  readonly referrerSuppressed: boolean;
};
export const targetBlankRelOpenerCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "target": {
      "type": "string",
      "maxLength": 100000,
      "description": "Target"
    },
    "rel": {
      "type": "string",
      "maxLength": 100000,
      "description": "Rel"
    }
  },
  "required": [
    "target",
    "rel"
  ]
} as const satisfies ToolJsonSchema;
export const targetBlankRelOpenerCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "blankTarget": {
      "type": "boolean",
      "description": "Blank Target"
    },
    "openerRequested": {
      "type": "boolean",
      "description": "Opener Requested"
    },
    "referrerSuppressed": {
      "type": "boolean",
      "description": "Referrer Suppressed"
    }
  },
  "required": [
    "blankTarget",
    "openerRequested",
    "referrerSuppressed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#link-type-opener; https://html.spec.whatwg.org/multipage/links.html#link-type-noopener
export const calculateTargetBlankRelOpenerChecker = (rawInput: unknown): ToolResult<TargetBlankRelOpenerCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly target?: unknown; readonly rel?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "target",
  "rel"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const targetValue = candidate.target;
if (typeof targetValue !== "string") return issue("target", "invalid_type", "Enter a string value.");
if (targetValue.length > 100000) return issue("target", "resource_limit", "Text exceeds the 100000-character resource limit.");
const relValue = candidate.rel;
if (typeof relValue !== "string") return issue("rel", "invalid_type", "Enter a string value.");
if (relValue.length > 100000) return issue("rel", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: TargetBlankRelOpenerCheckerInput = { target: targetValue, rel: relValue };
 const blankTarget = asciiLower(input.target) === "_blank";
 const tokens = htmlTokens(input.rel).map(asciiLower);
 const referrerSuppressed = tokens.includes("noreferrer");
 const openerRequested = blankTarget && tokens.includes("opener") && !tokens.includes("noopener") && !referrerSuppressed;
 return toolSuccess({ blankTarget, openerRequested, referrerSuppressed });
};
export const example = {
  "input": {
    "target": "_blank",
    "rel": "opener"
  },
  "output": {
    "blankTarget": true,
    "openerRequested": true,
    "referrerSuppressed": false
  }
} satisfies ToolExample<TargetBlankRelOpenerCheckerInput, TargetBlankRelOpenerCheckerOutput>;
export const targetBlankRelOpenerCheckerTool = defineTool<TargetBlankRelOpenerCheckerInput, TargetBlankRelOpenerCheckerOutput>({
  id: "html/target-blank-rel-opener-checker",
  title: "target=_blank rel=opener Security Check",
  description: "Resolves opener behavior requested by an anchor with target=_blank under modern HTML rules. Implicit noopener applies unless opener is present; noreferrer or noopener takes precedence.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: targetBlankRelOpenerCheckerInputSchema,
  outputSchema: targetBlankRelOpenerCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "target",
        "label": "Target",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
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
        "id": "blankTarget",
        "label": "Blank Target",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "openerRequested",
        "label": "Opener Requested",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "referrerSuppressed",
        "label": "Referrer Suppressed",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateTargetBlankRelOpenerChecker,
});
export const runTargetBlankRelOpenerChecker = targetBlankRelOpenerCheckerTool.execute;
export default targetBlankRelOpenerCheckerTool;
