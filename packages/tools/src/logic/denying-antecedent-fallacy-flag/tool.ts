import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DenyingAntecedentFallacyFlagInput = {
  readonly antecedent: string;
  readonly consequent: string;
  readonly negatedPremise: string;
  readonly negatedConclusion: string;
};
export type DenyingAntecedentFallacyFlagOutput = {
  readonly matchesFallacy: boolean;
};
export const denyingAntecedentFallacyFlagInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "antecedent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Antecedent"
    },
    "consequent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Consequent"
    },
    "negatedPremise": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Negated Premise"
    },
    "negatedConclusion": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Negated Conclusion"
    }
  },
  "required": [
    "antecedent",
    "consequent",
    "negatedPremise",
    "negatedConclusion"
  ]
} as const satisfies ToolJsonSchema;
export const denyingAntecedentFallacyFlagOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "matchesFallacy": {
      "type": "boolean",
      "description": "Matches Fallacy"
    }
  },
  "required": [
    "matchesFallacy"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateDenyingAntecedentFallacyFlag = (rawInput: unknown): ToolResult<DenyingAntecedentFallacyFlagOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly antecedent?: unknown; readonly consequent?: unknown; readonly negatedPremise?: unknown; readonly negatedConclusion?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "antecedent",
  "consequent",
  "negatedPremise",
  "negatedConclusion"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const antecedentValue = candidate.antecedent;
  if (typeof antecedentValue !== "string") return issue("antecedent", "invalid_type", "Enter a string value.");
  if (antecedentValue.length > 100) return issue("antecedent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(antecedentValue)) return issue("antecedent", "invalid_format", "Text does not match the accepted syntax.");
  const consequentValue = candidate.consequent;
  if (typeof consequentValue !== "string") return issue("consequent", "invalid_type", "Enter a string value.");
  if (consequentValue.length > 100) return issue("consequent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(consequentValue)) return issue("consequent", "invalid_format", "Text does not match the accepted syntax.");
  const negatedPremiseValue = candidate.negatedPremise;
  if (typeof negatedPremiseValue !== "string") return issue("negatedPremise", "invalid_type", "Enter a string value.");
  if (negatedPremiseValue.length > 100) return issue("negatedPremise", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(negatedPremiseValue)) return issue("negatedPremise", "invalid_format", "Text does not match the accepted syntax.");
  const negatedConclusionValue = candidate.negatedConclusion;
  if (typeof negatedConclusionValue !== "string") return issue("negatedConclusion", "invalid_type", "Enter a string value.");
  if (negatedConclusionValue.length > 100) return issue("negatedConclusion", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(negatedConclusionValue)) return issue("negatedConclusion", "invalid_format", "Text does not match the accepted syntax.");

  const input: DenyingAntecedentFallacyFlagInput = { antecedent: antecedentValue, consequent: consequentValue, negatedPremise: negatedPremiseValue, negatedConclusion: negatedConclusionValue };
  return toolSuccess({ matchesFallacy: input.antecedent !== input.consequent && input.negatedPremise === input.antecedent && input.negatedConclusion === input.consequent });
};
export const example = {
  input: {
    "antecedent": "p",
    "consequent": "q",
    "negatedPremise": "p",
    "negatedConclusion": "q"
  },
  output: {
    "matchesFallacy": true
  },
} satisfies ToolExample<DenyingAntecedentFallacyFlagInput, DenyingAntecedentFallacyFlagOutput>;
export const denyingAntecedentFallacyFlagTool = defineTool<DenyingAntecedentFallacyFlagInput, DenyingAntecedentFallacyFlagOutput>({
  id: "logic/denying-antecedent-fallacy-flag",
  title: "Denying the Antecedent Fallacy Flag Detector",
  description: "Detect the denying-the-antecedent pattern with distinct identifier atoms and explicitly negated terms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: denyingAntecedentFallacyFlagInputSchema,
  outputSchema: denyingAntecedentFallacyFlagOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "antecedent",
        "label": "Antecedent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "consequent",
        "label": "Consequent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "negatedPremise",
        "label": "Negated Premise",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "negatedConclusion",
        "label": "Negated Conclusion",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "matchesFallacy",
        "label": "Matches Fallacy",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateDenyingAntecedentFallacyFlag,
});
export const runDenyingAntecedentFallacyFlag = denyingAntecedentFallacyFlagTool.execute;
export default denyingAntecedentFallacyFlagTool;
