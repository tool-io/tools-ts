import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceTariffFraction: number;
  readonly preferentialTariffFraction: number;
};
export type Output = {
  readonly preferenceMarginFraction: number;
  readonly percentagePointMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceTariffFraction: { type: "number", minimum: 0 },
    preferentialTariffFraction: { type: "number", minimum: 0 },
  },
  required: ["referenceTariffFraction", "preferentialTariffFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferenceMarginFraction: { type: "number" },
    percentagePointMargin: { type: "number" },
  },
  required: ["preferenceMarginFraction", "percentagePointMargin"],
} as const;
/** Subtract supplied preferential from reference tariff fractions and report percentage-point margin without determining preference eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceTariffFraction, preferentialTariffFraction } = request;
  const compute = (): Output => {
    H.domain(referenceTariffFraction >= 0, "referenceTariffFraction");
    H.domain(preferentialTariffFraction >= 0, "preferentialTariffFraction");
    return {
      preferenceMarginFraction:
        referenceTariffFraction - preferentialTariffFraction,
      percentagePointMargin:
        (referenceTariffFraction - preferentialTariffFraction) * 100,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceTariffFraction: 0.1, preferentialTariffFraction: 0.05 },
  output: { preferenceMarginFraction: 0.05, percentagePointMargin: 5 },
} satisfies ToolExample<Input, Output>;
export const preferentialTariffErosionMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/preferential-tariff-erosion-margin",
    title: "Preferential Tariff Erosion Margin Tool",
    description:
      "Subtract supplied preferential from reference tariff fractions and report percentage-point margin without determining preference eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceTariffFraction: { type: "number", minimum: 0 },
        preferentialTariffFraction: { type: "number", minimum: 0 },
      },
      required: ["referenceTariffFraction", "preferentialTariffFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferenceMarginFraction: { type: "number" },
        percentagePointMargin: { type: "number" },
      },
      required: ["preferenceMarginFraction", "percentagePointMargin"],
    },
    ports: {
      inputs: [
        {
          id: "referenceTariffFraction",
          label: "Reference Tariff Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preferentialTariffFraction",
          label: "Preferential Tariff Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "preferenceMarginFraction",
          label: "Preference Margin Fraction",
          valueType: { type: "number" },
        },
        {
          id: "percentagePointMargin",
          label: "Percentage Point Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = preferentialTariffErosionMarginTool.execute;
export default preferentialTariffErosionMarginTool;
