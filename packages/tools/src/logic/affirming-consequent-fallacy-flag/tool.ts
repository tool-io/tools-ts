import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AffirmingConsequentFallacyFlagInput = {
  readonly antecedent: string;
  readonly consequent: string;
  readonly affirmed: string;
  readonly conclusion: string;
};
export type AffirmingConsequentFallacyFlagOutput = {
  readonly matchesFallacy: boolean;
};
export const affirmingConsequentFallacyFlagInputSchema = {
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
    "affirmed": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Affirmed"
    },
    "conclusion": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion"
    }
  },
  "required": [
    "antecedent",
    "consequent",
    "affirmed",
    "conclusion"
  ]
} as const satisfies ToolJsonSchema;
export const affirmingConsequentFallacyFlagOutputSchema = {
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
export const calculateAffirmingConsequentFallacyFlag = (rawInput: unknown): ToolResult<AffirmingConsequentFallacyFlagOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly antecedent?: unknown; readonly consequent?: unknown; readonly affirmed?: unknown; readonly conclusion?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "antecedent",
  "consequent",
  "affirmed",
  "conclusion"
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
  const affirmedValue = candidate.affirmed;
  if (typeof affirmedValue !== "string") return issue("affirmed", "invalid_type", "Enter a string value.");
  if (affirmedValue.length > 100) return issue("affirmed", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(affirmedValue)) return issue("affirmed", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionValue = candidate.conclusion;
  if (typeof conclusionValue !== "string") return issue("conclusion", "invalid_type", "Enter a string value.");
  if (conclusionValue.length > 100) return issue("conclusion", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionValue)) return issue("conclusion", "invalid_format", "Text does not match the accepted syntax.");

  const input: AffirmingConsequentFallacyFlagInput = { antecedent: antecedentValue, consequent: consequentValue, affirmed: affirmedValue, conclusion: conclusionValue };
  return toolSuccess({ matchesFallacy: input.antecedent !== input.consequent && input.affirmed === input.consequent && input.conclusion === input.antecedent });
};
export const example = {
  input: {
    "antecedent": "p",
    "consequent": "q",
    "affirmed": "q",
    "conclusion": "p"
  },
  output: {
    "matchesFallacy": true
  },
} satisfies ToolExample<AffirmingConsequentFallacyFlagInput, AffirmingConsequentFallacyFlagOutput>;
export const affirmingConsequentFallacyFlagTool = defineTool<AffirmingConsequentFallacyFlagInput, AffirmingConsequentFallacyFlagOutput>({
  id: "logic/affirming-consequent-fallacy-flag",
  title: "Affirming the Consequent Fallacy Flag Detector",
  description: "Detect the affirming-the-consequent pattern with distinct identifier atoms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: affirmingConsequentFallacyFlagInputSchema,
  outputSchema: affirmingConsequentFallacyFlagOutputSchema,
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
        "id": "affirmed",
        "label": "Affirmed",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusion",
        "label": "Conclusion",
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
  execute: calculateAffirmingConsequentFallacyFlag,
});
export const runAffirmingConsequentFallacyFlag = affirmingConsequentFallacyFlagTool.execute;
export default affirmingConsequentFallacyFlagTool;
