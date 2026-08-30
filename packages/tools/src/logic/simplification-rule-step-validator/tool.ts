import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SimplificationRuleStepValidatorInput = {
  readonly premiseLeft: string;
  readonly premiseRight: string;
  readonly conclusion: string;
};
export type SimplificationRuleStepValidatorOutput = {
  readonly matchesRule: boolean;
};
export const simplificationRuleStepValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "premiseLeft": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Premise Left"
    },
    "premiseRight": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Premise Right"
    },
    "conclusion": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion"
    }
  },
  "required": [
    "premiseLeft",
    "premiseRight",
    "conclusion"
  ]
} as const satisfies ToolJsonSchema;
export const simplificationRuleStepValidatorOutputSchema = {
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
export const calculateSimplificationRuleStepValidator = (rawInput: unknown): ToolResult<SimplificationRuleStepValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly premiseLeft?: unknown; readonly premiseRight?: unknown; readonly conclusion?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "premiseLeft",
  "premiseRight",
  "conclusion"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const premiseLeftValue = candidate.premiseLeft;
  if (typeof premiseLeftValue !== "string") return issue("premiseLeft", "invalid_type", "Enter a string value.");
  if (premiseLeftValue.length > 100) return issue("premiseLeft", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(premiseLeftValue)) return issue("premiseLeft", "invalid_format", "Text does not match the accepted syntax.");
  const premiseRightValue = candidate.premiseRight;
  if (typeof premiseRightValue !== "string") return issue("premiseRight", "invalid_type", "Enter a string value.");
  if (premiseRightValue.length > 100) return issue("premiseRight", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(premiseRightValue)) return issue("premiseRight", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionValue = candidate.conclusion;
  if (typeof conclusionValue !== "string") return issue("conclusion", "invalid_type", "Enter a string value.");
  if (conclusionValue.length > 100) return issue("conclusion", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionValue)) return issue("conclusion", "invalid_format", "Text does not match the accepted syntax.");

  const input: SimplificationRuleStepValidatorInput = { premiseLeft: premiseLeftValue, premiseRight: premiseRightValue, conclusion: conclusionValue };
  return toolSuccess({ matchesRule: input.conclusion === input.premiseLeft || input.conclusion === input.premiseRight });
};
export const example = {
  input: {
    "premiseLeft": "p",
    "premiseRight": "q",
    "conclusion": "q"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<SimplificationRuleStepValidatorInput, SimplificationRuleStepValidatorOutput>;
export const simplificationRuleStepValidatorTool = defineTool<SimplificationRuleStepValidatorInput, SimplificationRuleStepValidatorOutput>({
  id: "logic/simplification-rule-step-validator",
  title: "Simplification Rule Step Validator (P\u2227Q \u22a2 P)",
  description: "Validate conjunction elimination when the claimed conclusion is one of the premise conjunction operands.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: simplificationRuleStepValidatorInputSchema,
  outputSchema: simplificationRuleStepValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "premiseLeft",
        "label": "Premise Left",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "premiseRight",
        "label": "Premise Right",
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
        "id": "matchesRule",
        "label": "Matches Rule",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSimplificationRuleStepValidator,
});
export const runSimplificationRuleStepValidator = simplificationRuleStepValidatorTool.execute;
export default simplificationRuleStepValidatorTool;
