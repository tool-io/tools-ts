import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ModusTollensStepValidatorInput = {
  readonly antecedent: string;
  readonly consequent: string;
  readonly negatedPremise: string;
  readonly negatedConclusion: string;
};
export type ModusTollensStepValidatorOutput = {
  readonly matchesRule: boolean;
};
export const modusTollensStepValidatorInputSchema = {
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
export const modusTollensStepValidatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "matchesRule": {
      "type": "boolean",
      "description": "Matches Rule"
    }
  },
  "required": [
    "matchesRule"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateModusTollensStepValidator = (rawInput: unknown): ToolResult<ModusTollensStepValidatorOutput> => {
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

  const input: ModusTollensStepValidatorInput = { antecedent: antecedentValue, consequent: consequentValue, negatedPremise: negatedPremiseValue, negatedConclusion: negatedConclusionValue };
  return toolSuccess({ matchesRule: input.negatedPremise === input.consequent && input.negatedConclusion === input.antecedent });
};
export const example = {
  input: {
    "antecedent": "p",
    "consequent": "q",
    "negatedPremise": "q",
    "negatedConclusion": "p"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<ModusTollensStepValidatorInput, ModusTollensStepValidatorOutput>;
export const modusTollensStepValidatorTool = defineTool<ModusTollensStepValidatorInput, ModusTollensStepValidatorOutput>({
  id: "logic/modus-tollens-step-validator",
  title: "Modus Tollens Inference Step Validator (P\u2192Q, \u00acQ \u22a2 \u00acP)",
  description: "Validate a modus tollens step by matching the identifiers negated in its premise and conclusion.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: modusTollensStepValidatorInputSchema,
  outputSchema: modusTollensStepValidatorOutputSchema,
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
        "id": "matchesRule",
        "label": "Matches Rule",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateModusTollensStepValidator,
});
export const runModusTollensStepValidator = modusTollensStepValidatorTool.execute;
export default modusTollensStepValidatorTool;
