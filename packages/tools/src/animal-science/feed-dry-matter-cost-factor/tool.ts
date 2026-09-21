import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asFedPricePerMass: number;
  readonly dryFraction: number;
};
export type Output = { readonly costPerDryMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asFedPricePerMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["asFedPricePerMass", "dryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { costPerDryMass: { type: "number" } },
  required: ["costPerDryMass"],
} as const;
/** Convert a supplied feed price basis without dietary recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asFedPricePerMass, dryFraction } = request;
  const compute = (): Output => {
    H.domain(asFedPricePerMass >= 0 && dryFraction > 0 && dryFraction <= 1);
    return { costPerDryMass: asFedPricePerMass / dryFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asFedPricePerMass: 20, dryFraction: 0.8 },
  output: { costPerDryMass: 25 },
} satisfies ToolExample<Input, Output>;
export const feedDryMatterCostFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/feed-dry-matter-cost-factor",
    title: "Feed Dry Matter Cost Factor Tool",
    description:
      "Convert a supplied feed price basis without dietary recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asFedPricePerMass: { type: "number", minimum: 0 },
        dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["asFedPricePerMass", "dryFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { costPerDryMass: { type: "number" } },
      required: ["costPerDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "asFedPricePerMass",
          label: "As Fed Price Per Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "costPerDryMass",
          label: "Cost Per Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedDryMatterCostFactorTool.execute;
export default feedDryMatterCostFactorTool;
