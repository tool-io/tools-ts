import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DisjunctiveSyllogismValidatorInput = {
  readonly left: string;
  readonly right: string;
  readonly negatedPremise: string;
  readonly conclusion: string;
};
export type DisjunctiveSyllogismValidatorOutput = {
  readonly matchesRule: boolean;
};
export const disjunctiveSyllogismValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "left": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Left"
    },
    "right": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Right"
    },
    "negatedPremise": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Negated Premise"
    },
    "conclusion": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion"
    }
  },
  "required": [
    "left",
    "right",
    "negatedPremise",
    "conclusion"
  ]
} as const satisfies ToolJsonSchema;
export const disjunctiveSyllogismValidatorOutputSchema = {
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
export const calculateDisjunctiveSyllogismValidator = (rawInput: unknown): ToolResult<DisjunctiveSyllogismValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly left?: unknown; readonly right?: unknown; readonly negatedPremise?: unknown; readonly conclusion?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "left",
  "right",
  "negatedPremise",
  "conclusion"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const leftValue = candidate.left;
  if (typeof leftValue !== "string") return issue("left", "invalid_type", "Enter a string value.");
  if (leftValue.length > 100) return issue("left", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(leftValue)) return issue("left", "invalid_format", "Text does not match the accepted syntax.");
  const rightValue = candidate.right;
  if (typeof rightValue !== "string") return issue("right", "invalid_type", "Enter a string value.");
  if (rightValue.length > 100) return issue("right", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(rightValue)) return issue("right", "invalid_format", "Text does not match the accepted syntax.");
  const negatedPremiseValue = candidate.negatedPremise;
  if (typeof negatedPremiseValue !== "string") return issue("negatedPremise", "invalid_type", "Enter a string value.");
  if (negatedPremiseValue.length > 100) return issue("negatedPremise", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(negatedPremiseValue)) return issue("negatedPremise", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionValue = candidate.conclusion;
  if (typeof conclusionValue !== "string") return issue("conclusion", "invalid_type", "Enter a string value.");
  if (conclusionValue.length > 100) return issue("conclusion", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionValue)) return issue("conclusion", "invalid_format", "Text does not match the accepted syntax.");

  const input: DisjunctiveSyllogismValidatorInput = { left: leftValue, right: rightValue, negatedPremise: negatedPremiseValue, conclusion: conclusionValue };
  return toolSuccess({ matchesRule: (input.negatedPremise === input.left && input.conclusion === input.right) || (input.negatedPremise === input.right && input.conclusion === input.left) });
};
export const example = {
  input: {
    "left": "p",
    "right": "q",
    "negatedPremise": "p",
    "conclusion": "q"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<DisjunctiveSyllogismValidatorInput, DisjunctiveSyllogismValidatorOutput>;
export const disjunctiveSyllogismValidatorTool = defineTool<DisjunctiveSyllogismValidatorInput, DisjunctiveSyllogismValidatorOutput>({
  id: "logic/disjunctive-syllogism-validator",
  title: "Disjunctive Syllogism Validator (P\u2228Q, \u00acP \u22a2 Q)",
  description: "Validate disjunctive syllogism by matching a disjunction, a negated operand, and the remaining conclusion atom.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: disjunctiveSyllogismValidatorInputSchema,
  outputSchema: disjunctiveSyllogismValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "left",
        "label": "Left",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "right",
        "label": "Right",
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
  execute: calculateDisjunctiveSyllogismValidator,
});
export const runDisjunctiveSyllogismValidator = disjunctiveSyllogismValidatorTool.execute;
export default disjunctiveSyllogismValidatorTool;
