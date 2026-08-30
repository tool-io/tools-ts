import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DominationLawAnnihilatorCheckerInput = {
  readonly operator: "and" | "or";
  readonly constant: boolean;
};
export type DominationLawAnnihilatorCheckerOutput = {
  readonly annihilator: boolean;
};
export const dominationLawAnnihilatorCheckerInputSchema = {
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
      "description": "Candidate annihilator"
    }
  },
  "required": [
    "operator",
    "constant"
  ]
} as const satisfies ToolJsonSchema;
export const dominationLawAnnihilatorCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "annihilator": {
      "type": "boolean",
      "description": "Annihilator"
    }
  },
  "required": [
    "annihilator"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateDominationLawAnnihilatorChecker = (rawInput: unknown): ToolResult<DominationLawAnnihilatorCheckerOutput> => {
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

  const input: DominationLawAnnihilatorCheckerInput = { operator: operatorValue, constant: constantValue };
  return toolSuccess({ annihilator: input.operator === "and" ? !input.constant : input.constant });
};
export const example = {
  input: {
    "operator": "or",
    "constant": true
  },
  output: {
    "annihilator": true
  },
} satisfies ToolExample<DominationLawAnnihilatorCheckerInput, DominationLawAnnihilatorCheckerOutput>;
export const dominationLawAnnihilatorCheckerTool = defineTool<DominationLawAnnihilatorCheckerInput, DominationLawAnnihilatorCheckerOutput>({
  id: "logic/domination-law-annihilator-checker",
  title: "Domination Law Annihilator Checker (P\u2228T=T, P\u2227F=F)",
  description: "Check whether a Boolean constant is the annihilator of conjunction or disjunction.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dominationLawAnnihilatorCheckerInputSchema,
  outputSchema: dominationLawAnnihilatorCheckerOutputSchema,
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
        "label": "Candidate annihilator",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "annihilator",
        "label": "Annihilator",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateDominationLawAnnihilatorChecker,
});
export const runDominationLawAnnihilatorChecker = dominationLawAnnihilatorCheckerTool.execute;
export default dominationLawAnnihilatorCheckerTool;
