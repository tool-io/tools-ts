import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AdditionRuleStepValidatorInput = {
  readonly premise: string;
  readonly conclusionLeft: string;
  readonly conclusionRight: string;
};
export type AdditionRuleStepValidatorOutput = {
  readonly matchesRule: boolean;
};
export const additionRuleStepValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "premise": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Premise"
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
    "premise",
    "conclusionLeft",
    "conclusionRight"
  ]
} as const satisfies ToolJsonSchema;
export const additionRuleStepValidatorOutputSchema = {
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
export const calculateAdditionRuleStepValidator = (rawInput: unknown): ToolResult<AdditionRuleStepValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly premise?: unknown; readonly conclusionLeft?: unknown; readonly conclusionRight?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "premise",
  "conclusionLeft",
  "conclusionRight"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const premiseValue = candidate.premise;
  if (typeof premiseValue !== "string") return issue("premise", "invalid_type", "Enter a string value.");
  if (premiseValue.length > 100) return issue("premise", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(premiseValue)) return issue("premise", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionLeftValue = candidate.conclusionLeft;
  if (typeof conclusionLeftValue !== "string") return issue("conclusionLeft", "invalid_type", "Enter a string value.");
  if (conclusionLeftValue.length > 100) return issue("conclusionLeft", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionLeftValue)) return issue("conclusionLeft", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionRightValue = candidate.conclusionRight;
  if (typeof conclusionRightValue !== "string") return issue("conclusionRight", "invalid_type", "Enter a string value.");
  if (conclusionRightValue.length > 100) return issue("conclusionRight", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionRightValue)) return issue("conclusionRight", "invalid_format", "Text does not match the accepted syntax.");

  const input: AdditionRuleStepValidatorInput = { premise: premiseValue, conclusionLeft: conclusionLeftValue, conclusionRight: conclusionRightValue };
  return toolSuccess({ matchesRule: input.premise === input.conclusionLeft || input.premise === input.conclusionRight });
};
export const example = {
  input: {
    "premise": "p",
    "conclusionLeft": "p",
    "conclusionRight": "q"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<AdditionRuleStepValidatorInput, AdditionRuleStepValidatorOutput>;
export const additionRuleStepValidatorTool = defineTool<AdditionRuleStepValidatorInput, AdditionRuleStepValidatorOutput>({
  id: "logic/addition-rule-step-validator",
  title: "Addition Rule Step Validator (P \u22a2 P\u2228Q)",
  description: "Validate disjunction introduction when the affirmed premise is one of the claimed disjunction operands.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: additionRuleStepValidatorInputSchema,
  outputSchema: additionRuleStepValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "premise",
        "label": "Premise",
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
  execute: calculateAdditionRuleStepValidator,
});
export const runAdditionRuleStepValidator = additionRuleStepValidatorTool.execute;
export default additionRuleStepValidatorTool;
