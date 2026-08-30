import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type IdentityLawNeutralCheckerInput = {
  readonly operator: "and" | "or";
  readonly constant: boolean;
};
export type IdentityLawNeutralCheckerOutput = {
  readonly neutral: boolean;
};
export const identityLawNeutralCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "operator": {
      "type": "string",
      "enum": [
        "and",
        "or"
      ],
      "description": "Boolean operator"
    },
    "constant": {
      "type": "boolean",
      "description": "Candidate identity"
    }
  },
  "required": [
    "operator",
    "constant"
  ]
} as const satisfies ToolJsonSchema;
export const identityLawNeutralCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "neutral": {
      "type": "boolean",
      "description": "Neutral"
    }
  },
  "required": [
    "neutral"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateIdentityLawNeutralChecker = (rawInput: unknown): ToolResult<IdentityLawNeutralCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly operator?: unknown; readonly constant?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "operator",
  "constant"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const operatorValue = candidate.operator;
  if (typeof operatorValue !== "string") return issue("operator", "invalid_type", "Enter a string value.");
  if (operatorValue !== "and" && operatorValue !== "or") return issue("operator", "invalid_value", "Choose a supported value.");
  const constantValue = candidate.constant;
  if (typeof constantValue !== "boolean") return issue("constant", "invalid_type", "Enter a boolean value.");

  const input: IdentityLawNeutralCheckerInput = { operator: operatorValue, constant: constantValue };
  return toolSuccess({ neutral: input.operator === "and" ? input.constant : !input.constant });
};
export const example = {
  input: {
    "operator": "and",
    "constant": true
  },
  output: {
    "neutral": true
  },
} satisfies ToolExample<IdentityLawNeutralCheckerInput, IdentityLawNeutralCheckerOutput>;
export const identityLawNeutralCheckerTool = defineTool<IdentityLawNeutralCheckerInput, IdentityLawNeutralCheckerOutput>({
  id: "logic/identity-law-neutral-checker",
  title: "Identity Law Neutral Element Checker (P\u2227T, P\u2228F)",
  description: "Check whether a Boolean constant is the identity element of conjunction or disjunction.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: identityLawNeutralCheckerInputSchema,
  outputSchema: identityLawNeutralCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "operator",
        "label": "Boolean operator",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "constant",
        "label": "Candidate identity",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "neutral",
        "label": "Neutral",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateIdentityLawNeutralChecker,
});
export const runIdentityLawNeutralChecker = identityLawNeutralCheckerTool.execute;
export default identityLawNeutralCheckerTool;
