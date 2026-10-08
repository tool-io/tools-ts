import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nutrientPer100Grams: number;
  readonly edibleGrams: number;
};
export type Output = { readonly nutrientContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nutrientPer100Grams: { type: "number", minimum: 0 },
    edibleGrams: { type: "number", minimum: 0 },
  },
  required: ["nutrientPer100Grams", "edibleGrams"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nutrientContribution: { type: "number" } },
  required: ["nutrientContribution"],
} as const;
/** Apply a supplied per-100-edible-gram nutrient quantity to explicit edible grams without a food database or dietary advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nutrientPer100Grams, edibleGrams } = request;
  const compute = (): Output => {
    H.domain(nutrientPer100Grams >= 0, "nutrientPer100Grams");
    H.domain(edibleGrams >= 0, "edibleGrams");
    return { nutrientContribution: (nutrientPer100Grams / 100) * edibleGrams };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nutrientPer100Grams: 12, edibleGrams: 50 },
  output: { nutrientContribution: 6 },
} satisfies ToolExample<Input, Output>;
export const nutrientContributionPerEdibleGramTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/nutrient-contribution-per-edible-gram",
    title: "Nutrient Contribution Per Edible Gram Tool",
    description:
      "Apply a supplied per-100-edible-gram nutrient quantity to explicit edible grams without a food database or dietary advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nutrientPer100Grams: { type: "number", minimum: 0 },
        edibleGrams: { type: "number", minimum: 0 },
      },
      required: ["nutrientPer100Grams", "edibleGrams"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nutrientContribution: { type: "number" } },
      required: ["nutrientContribution"],
    },
    ports: {
      inputs: [
        {
          id: "nutrientPer100Grams",
          label: "Nutrient Per100Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edibleGrams",
          label: "Edible Grams",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nutrientContribution",
          label: "Nutrient Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientContributionPerEdibleGramTool.execute;
export default nutrientContributionPerEdibleGramTool;
