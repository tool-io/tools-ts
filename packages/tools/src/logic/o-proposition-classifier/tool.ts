import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type OPropositionClassifierInput = {
  readonly quantifier: "all" | "some";
  readonly predicateNegated: boolean;
};
export type OPropositionClassifierOutput = {
  readonly isO: boolean;
};
export const oPropositionClassifierInputSchema = {
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
export const oPropositionClassifierOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isO": {
      "type": "boolean",
      "description": "Is O"
    }
  },
  "required": [
    "isO"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateOPropositionClassifier = (rawInput: unknown): ToolResult<OPropositionClassifierOutput> => {
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

  const input: OPropositionClassifierInput = { quantifier: quantifierValue, predicateNegated: predicateNegatedValue };
  return toolSuccess({ isO: input.quantifier === "some" && input.predicateNegated });
};
export const example = {
  input: {
    "quantifier": "some",
    "predicateNegated": true
  },
  output: {
    "isO": true
  },
} satisfies ToolExample<OPropositionClassifierInput, OPropositionClassifierOutput>;
export const oPropositionClassifierTool = defineTool<OPropositionClassifierInput, OPropositionClassifierOutput>({
  id: "logic/o-proposition-classifier",
  title: "O Proposition Particular Negative Classifier",
  description: "Recognize an O proposition represented as some subject member satisfying a negated predicate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: oPropositionClassifierInputSchema,
  outputSchema: oPropositionClassifierOutputSchema,
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
        "id": "isO",
        "label": "Is O",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateOPropositionClassifier,
});
export const runOPropositionClassifier = oPropositionClassifierTool.execute;
export default oPropositionClassifierTool;
