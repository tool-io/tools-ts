import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type APropositionClassifierInput = {
  readonly quantifier: "all" | "some";
  readonly predicateNegated: boolean;
};
export type APropositionClassifierOutput = {
  readonly isA: boolean;
};
export const aPropositionClassifierInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "quantifier": {
      "type": "string",
      "enum": [
        "all",
        "some"
      ],
      "description": "Quantifier"
    },
    "predicateNegated": {
      "type": "boolean",
      "description": "Predicate negated"
    }
  },
  "required": [
    "quantifier",
    "predicateNegated"
  ]
} as const satisfies ToolJsonSchema;
export const aPropositionClassifierOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isA": {
      "type": "boolean",
      "description": "Is A"
    }
  },
  "required": [
    "isA"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateAPropositionClassifier = (rawInput: unknown): ToolResult<APropositionClassifierOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly quantifier?: unknown; readonly predicateNegated?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "quantifier",
  "predicateNegated"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const quantifierValue = candidate.quantifier;
  if (typeof quantifierValue !== "string") return issue("quantifier", "invalid_type", "Enter a string value.");
  if (quantifierValue !== "all" && quantifierValue !== "some") return issue("quantifier", "invalid_value", "Choose a supported value.");
  const predicateNegatedValue = candidate.predicateNegated;
  if (typeof predicateNegatedValue !== "boolean") return issue("predicateNegated", "invalid_type", "Enter a boolean value.");

  const input: APropositionClassifierInput = { quantifier: quantifierValue, predicateNegated: predicateNegatedValue };
  return toolSuccess({ isA: input.quantifier === "all" && !input.predicateNegated });
};
export const example = {
  input: {
    "quantifier": "all",
    "predicateNegated": false
  },
  output: {
    "isA": true
  },
} satisfies ToolExample<APropositionClassifierInput, APropositionClassifierOutput>;
export const aPropositionClassifierTool = defineTool<APropositionClassifierInput, APropositionClassifierOutput>({
  id: "logic/a-proposition-classifier",
  title: "A Proposition Universal Affirmative Quantity-Quality Classifier",
  description: "Recognize an A proposition represented as all subject members satisfying an unnegated predicate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: aPropositionClassifierInputSchema,
  outputSchema: aPropositionClassifierOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "quantifier",
        "label": "Quantifier",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "predicateNegated",
        "label": "Predicate negated",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "isA",
        "label": "Is A",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateAPropositionClassifier,
});
export const runAPropositionClassifier = aPropositionClassifierTool.execute;
export default aPropositionClassifierTool;
