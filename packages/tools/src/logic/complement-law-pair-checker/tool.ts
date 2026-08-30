import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ComplementLawPairCheckerInput = {
  readonly operator: "and" | "or";
  readonly left: string;
  readonly right: string;
  readonly leftNegated: boolean;
  readonly rightNegated: boolean;
};
export type ComplementLawPairCheckerOutput = {
  readonly complementary: boolean;
  readonly simplified: string;
};
export const complementLawPairCheckerInputSchema = {
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
    "leftNegated": {
      "type": "boolean",
      "description": "Left literal negated"
    },
    "rightNegated": {
      "type": "boolean",
      "description": "Right literal negated"
    }
  },
  "required": [
    "operator",
    "left",
    "right",
    "leftNegated",
    "rightNegated"
  ]
} as const satisfies ToolJsonSchema;
export const complementLawPairCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "complementary": {
      "type": "boolean",
      "description": "Complementary literals"
    },
    "simplified": {
      "type": "string",
      "description": "Resulting propositional formula"
    }
  },
  "required": [
    "complementary",
    "simplified"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateComplementLawPairChecker = (rawInput: unknown): ToolResult<ComplementLawPairCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly operator?: unknown; readonly left?: unknown; readonly right?: unknown; readonly leftNegated?: unknown; readonly rightNegated?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "operator",
  "left",
  "right",
  "leftNegated",
  "rightNegated"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const operatorValue = candidate.operator;
  if (typeof operatorValue !== "string") return issue("operator", "invalid_type", "Enter a string value.");
  if (operatorValue !== "and" && operatorValue !== "or") return issue("operator", "invalid_value", "Choose a supported value.");
  const leftValue = candidate.left;
  if (typeof leftValue !== "string") return issue("left", "invalid_type", "Enter a string value.");
  if (leftValue.length > 100) return issue("left", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(leftValue)) return issue("left", "invalid_format", "Text does not match the accepted syntax.");
  const rightValue = candidate.right;
  if (typeof rightValue !== "string") return issue("right", "invalid_type", "Enter a string value.");
  if (rightValue.length > 100) return issue("right", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(rightValue)) return issue("right", "invalid_format", "Text does not match the accepted syntax.");
  const leftNegatedValue = candidate.leftNegated;
  if (typeof leftNegatedValue !== "boolean") return issue("leftNegated", "invalid_type", "Enter a boolean value.");
  const rightNegatedValue = candidate.rightNegated;
  if (typeof rightNegatedValue !== "boolean") return issue("rightNegated", "invalid_type", "Enter a boolean value.");

  const input: ComplementLawPairCheckerInput = { operator: operatorValue, left: leftValue, right: rightValue, leftNegated: leftNegatedValue, rightNegated: rightNegatedValue };
  const complementary = input.left === input.right && input.leftNegated !== input.rightNegated;
  const left = `${input.leftNegated ? "!" : ""}${input.left}`, right = `${input.rightNegated ? "!" : ""}${input.right}`;
  return toolSuccess({ complementary, simplified: complementary ? (input.operator === "and" ? "false" : "true") : `(${left} ${input.operator === "and" ? "&&" : "||"} ${right})` });
};
export const example = {
  input: {
    "operator": "and",
    "left": "p",
    "right": "p",
    "leftNegated": false,
    "rightNegated": true
  },
  output: {
    "complementary": true,
    "simplified": "false"
  },
} satisfies ToolExample<ComplementLawPairCheckerInput, ComplementLawPairCheckerOutput>;
export const complementLawPairCheckerTool = defineTool<ComplementLawPairCheckerInput, ComplementLawPairCheckerOutput>({
  id: "logic/complement-law-pair-checker",
  title: "Complement Law Contradiction Tautology Pair Checker",
  description: "Check for complementary signed identifier literals and apply their conjunction or disjunction law.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: complementLawPairCheckerInputSchema,
  outputSchema: complementLawPairCheckerOutputSchema,
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
        "id": "leftNegated",
        "label": "Left literal negated",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "rightNegated",
        "label": "Right literal negated",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "complementary",
        "label": "Complementary literals",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "simplified",
        "label": "Resulting propositional formula",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      }
    ]
  },
  execute: calculateComplementLawPairChecker,
});
export const runComplementLawPairChecker = complementLawPairCheckerTool.execute;
export default complementLawPairCheckerTool;
