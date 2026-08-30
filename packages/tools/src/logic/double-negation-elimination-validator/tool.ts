import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DoubleNegationEliminationValidatorInput = {
  readonly negatedAtom: string;
  readonly conclusion: string;
};
export type DoubleNegationEliminationValidatorOutput = {
  readonly matchesRule: boolean;
};
export const doubleNegationEliminationValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "negatedAtom": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Negated Atom"
    },
    "conclusion": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion"
    }
  },
  "required": [
    "negatedAtom",
    "conclusion"
  ]
} as const satisfies ToolJsonSchema;
export const doubleNegationEliminationValidatorOutputSchema = {
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
export const calculateDoubleNegationEliminationValidator = (rawInput: unknown): ToolResult<DoubleNegationEliminationValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly negatedAtom?: unknown; readonly conclusion?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "negatedAtom",
  "conclusion"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const negatedAtomValue = candidate.negatedAtom;
  if (typeof negatedAtomValue !== "string") return issue("negatedAtom", "invalid_type", "Enter a string value.");
  if (negatedAtomValue.length > 100) return issue("negatedAtom", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(negatedAtomValue)) return issue("negatedAtom", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionValue = candidate.conclusion;
  if (typeof conclusionValue !== "string") return issue("conclusion", "invalid_type", "Enter a string value.");
  if (conclusionValue.length > 100) return issue("conclusion", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionValue)) return issue("conclusion", "invalid_format", "Text does not match the accepted syntax.");

  const input: DoubleNegationEliminationValidatorInput = { negatedAtom: negatedAtomValue, conclusion: conclusionValue };
  return toolSuccess({ matchesRule: input.negatedAtom === input.conclusion });
};
export const example = {
  input: {
    "negatedAtom": "p",
    "conclusion": "p"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<DoubleNegationEliminationValidatorInput, DoubleNegationEliminationValidatorOutput>;
export const doubleNegationEliminationValidatorTool = defineTool<DoubleNegationEliminationValidatorInput, DoubleNegationEliminationValidatorOutput>({
  id: "logic/double-negation-elimination-validator",
  title: "Double Negation Elimination Validator (\u00ac\u00acP \u22a2 P)",
  description: "Validate double-negation elimination from an explicitly double-negated identifier to a claimed atom.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: doubleNegationEliminationValidatorInputSchema,
  outputSchema: doubleNegationEliminationValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "negatedAtom",
        "label": "Negated Atom",
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
  execute: calculateDoubleNegationEliminationValidator,
});
export const runDoubleNegationEliminationValidator = doubleNegationEliminationValidatorTool.execute;
export default doubleNegationEliminationValidatorTool;
