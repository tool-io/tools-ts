import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type IdempotenceCollapseCheckerInput = {
  readonly operator: "and" | "or";
  readonly left: string;
  readonly right: string;
};
export type IdempotenceCollapseCheckerOutput = {
  readonly applicable: boolean;
  readonly simplified: string;
};
export const idempotenceCollapseCheckerInputSchema = {
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
    }
  },
  "required": [
    "operator",
    "left",
    "right"
  ]
} as const satisfies ToolJsonSchema;
export const idempotenceCollapseCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "applicable": {
      "type": "boolean",
      "description": "Idempotence applies"
    },
    "simplified": {
      "type": "string",
      "description": "Resulting propositional formula"
    }
  },
  "required": [
    "applicable",
    "simplified"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateIdempotenceCollapseChecker = (rawInput: unknown): ToolResult<IdempotenceCollapseCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly operator?: unknown; readonly left?: unknown; readonly right?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "operator",
  "left",
  "right"
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

  const input: IdempotenceCollapseCheckerInput = { operator: operatorValue, left: leftValue, right: rightValue };
  const applicable = input.left === input.right;
  return toolSuccess({ applicable, simplified: applicable ? input.left : `(${input.left} ${input.operator === "and" ? "&&" : "||"} ${input.right})` });
};
export const example = {
  input: {
    "operator": "and",
    "left": "p",
    "right": "p"
  },
  output: {
    "applicable": true,
    "simplified": "p"
  },
} satisfies ToolExample<IdempotenceCollapseCheckerInput, IdempotenceCollapseCheckerOutput>;
export const idempotenceCollapseCheckerTool = defineTool<IdempotenceCollapseCheckerInput, IdempotenceCollapseCheckerOutput>({
  id: "logic/idempotence-collapse-checker",
  title: "Idempotence Duplicate Term Collapser Checker (P\u2227P=P)",
  description: "Collapse equal identifier operands under conjunction or disjunction using idempotence.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: idempotenceCollapseCheckerInputSchema,
  outputSchema: idempotenceCollapseCheckerOutputSchema,
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
      }
    ],
    "outputs": [
      {
        "id": "applicable",
        "label": "Idempotence applies",
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
  execute: calculateIdempotenceCollapseChecker,
});
export const runIdempotenceCollapseChecker = idempotenceCollapseCheckerTool.execute;
export default idempotenceCollapseCheckerTool;
