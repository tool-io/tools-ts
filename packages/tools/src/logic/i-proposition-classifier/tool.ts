import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type IPropositionClassifierInput = {
  readonly quantifier: "all" | "some";
  readonly predicateNegated: boolean;
};
export type IPropositionClassifierOutput = {
  readonly isI: boolean;
};
export const iPropositionClassifierInputSchema = {
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
export const iPropositionClassifierOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isI": {
      "type": "boolean",
      "description": "Is I"
    }
  },
  "required": [
    "isI"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateIPropositionClassifier = (rawInput: unknown): ToolResult<IPropositionClassifierOutput> => {
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

  const input: IPropositionClassifierInput = { quantifier: quantifierValue, predicateNegated: predicateNegatedValue };
  return toolSuccess({ isI: input.quantifier === "some" && !input.predicateNegated });
};
export const example = {
  input: {
    "quantifier": "some",
    "predicateNegated": false
  },
  output: {
    "isI": true
  },
} satisfies ToolExample<IPropositionClassifierInput, IPropositionClassifierOutput>;
export const iPropositionClassifierTool = defineTool<IPropositionClassifierInput, IPropositionClassifierOutput>({
  id: "logic/i-proposition-classifier",
  title: "I Proposition Particular Affirmative Classifier",
  description: "Recognize an I proposition represented as some subject member satisfying an unnegated predicate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: iPropositionClassifierInputSchema,
  outputSchema: iPropositionClassifierOutputSchema,
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
        "id": "isI",
        "label": "Is I",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateIPropositionClassifier,
});
export const runIPropositionClassifier = iPropositionClassifierTool.execute;
export default iPropositionClassifierTool;
