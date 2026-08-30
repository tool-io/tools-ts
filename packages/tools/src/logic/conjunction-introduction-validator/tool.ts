import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ConjunctionIntroductionValidatorInput = {
  readonly firstPremise: string;
  readonly secondPremise: string;
  readonly conclusionLeft: string;
  readonly conclusionRight: string;
};
export type ConjunctionIntroductionValidatorOutput = {
  readonly matchesRule: boolean;
};
export const conjunctionIntroductionValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "firstPremise": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "First Premise"
    },
    "secondPremise": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Second Premise"
    },
    "conclusionLeft": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Left"
    },
    "conclusionRight": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Right"
    }
  },
  "required": [
    "firstPremise",
    "secondPremise",
    "conclusionLeft",
    "conclusionRight"
  ]
} as const satisfies ToolJsonSchema;
export const conjunctionIntroductionValidatorOutputSchema = {
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
export const calculateConjunctionIntroductionValidator = (rawInput: unknown): ToolResult<ConjunctionIntroductionValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly firstPremise?: unknown; readonly secondPremise?: unknown; readonly conclusionLeft?: unknown; readonly conclusionRight?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "firstPremise",
  "secondPremise",
  "conclusionLeft",
  "conclusionRight"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const firstPremiseValue = candidate.firstPremise;
  if (typeof firstPremiseValue !== "string") return issue("firstPremise", "invalid_type", "Enter a string value.");
  if (firstPremiseValue.length > 100) return issue("firstPremise", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(firstPremiseValue)) return issue("firstPremise", "invalid_format", "Text does not match the accepted syntax.");
  const secondPremiseValue = candidate.secondPremise;
  if (typeof secondPremiseValue !== "string") return issue("secondPremise", "invalid_type", "Enter a string value.");
  if (secondPremiseValue.length > 100) return issue("secondPremise", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(secondPremiseValue)) return issue("secondPremise", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionLeftValue = candidate.conclusionLeft;
  if (typeof conclusionLeftValue !== "string") return issue("conclusionLeft", "invalid_type", "Enter a string value.");
  if (conclusionLeftValue.length > 100) return issue("conclusionLeft", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionLeftValue)) return issue("conclusionLeft", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionRightValue = candidate.conclusionRight;
  if (typeof conclusionRightValue !== "string") return issue("conclusionRight", "invalid_type", "Enter a string value.");
  if (conclusionRightValue.length > 100) return issue("conclusionRight", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionRightValue)) return issue("conclusionRight", "invalid_format", "Text does not match the accepted syntax.");

  const input: ConjunctionIntroductionValidatorInput = { firstPremise: firstPremiseValue, secondPremise: secondPremiseValue, conclusionLeft: conclusionLeftValue, conclusionRight: conclusionRightValue };
  return toolSuccess({ matchesRule: (input.firstPremise === input.conclusionLeft && input.secondPremise === input.conclusionRight) || (input.secondPremise === input.conclusionLeft && input.firstPremise === input.conclusionRight) });
};
export const example = {
  input: {
    "firstPremise": "p",
    "secondPremise": "q",
    "conclusionLeft": "p",
    "conclusionRight": "q"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<ConjunctionIntroductionValidatorInput, ConjunctionIntroductionValidatorOutput>;
export const conjunctionIntroductionValidatorTool = defineTool<ConjunctionIntroductionValidatorInput, ConjunctionIntroductionValidatorOutput>({
  id: "logic/conjunction-introduction-validator",
  title: "Conjunction Introduction Step Validator (P,Q \u22a2 P\u2227Q)",
  description: "Validate conjunction introduction by matching its two affirmed identifier premises with the claimed conjunction.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: conjunctionIntroductionValidatorInputSchema,
  outputSchema: conjunctionIntroductionValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "firstPremise",
        "label": "First Premise",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "secondPremise",
        "label": "Second Premise",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionLeft",
        "label": "Conclusion Left",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionRight",
        "label": "Conclusion Right",
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
  execute: calculateConjunctionIntroductionValidator,
});
export const runConjunctionIntroductionValidator = conjunctionIntroductionValidatorTool.execute;
export default conjunctionIntroductionValidatorTool;
