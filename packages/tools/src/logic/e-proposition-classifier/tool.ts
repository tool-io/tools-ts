import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EPropositionClassifierInput = {
  readonly quantifier: "all" | "some";
  readonly predicateNegated: boolean;
};
export type EPropositionClassifierOutput = {
  readonly isE: boolean;
};
export const ePropositionClassifierInputSchema = {
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
export const ePropositionClassifierOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isE": {
      "type": "boolean",
      "description": "Is E"
    }
  },
  "required": [
    "isE"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateEPropositionClassifier = (rawInput: unknown): ToolResult<EPropositionClassifierOutput> => {
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

  const input: EPropositionClassifierInput = { quantifier: quantifierValue, predicateNegated: predicateNegatedValue };
  return toolSuccess({ isE: input.quantifier === "all" && input.predicateNegated });
};
export const example = {
  input: {
    "quantifier": "all",
    "predicateNegated": true
  },
  output: {
    "isE": true
  },
} satisfies ToolExample<EPropositionClassifierInput, EPropositionClassifierOutput>;
export const ePropositionClassifierTool = defineTool<EPropositionClassifierInput, EPropositionClassifierOutput>({
  id: "logic/e-proposition-classifier",
  title: "E Proposition Universal Negative Classifier",
  description: "Recognize an E proposition represented as all subject members satisfying a negated predicate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: ePropositionClassifierInputSchema,
  outputSchema: ePropositionClassifierOutputSchema,
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
        "id": "isE",
        "label": "Is E",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateEPropositionClassifier,
});
export const runEPropositionClassifier = ePropositionClassifierTool.execute;
export default ePropositionClassifierTool;
