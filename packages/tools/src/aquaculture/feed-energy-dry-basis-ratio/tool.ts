import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asFedEnergy: number;
  readonly dryFraction: number;
};
export type Output = { readonly dryBasisEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asFedEnergy: { type: "number", minimum: 0 },
    dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["asFedEnergy", "dryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryBasisEnergy: { type: "number" } },
  required: ["dryBasisEnergy"],
} as const;
/** Convert supplied energy per as-fed mass to energy per dry mass; no feeding recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asFedEnergy, dryFraction } = request;
  const compute = (): Output => {
    H.domain(asFedEnergy >= 0 && dryFraction > 0 && dryFraction <= 1);
    return { dryBasisEnergy: asFedEnergy / dryFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asFedEnergy: 10, dryFraction: 0.8 },
  output: { dryBasisEnergy: 12.5 },
} satisfies ToolExample<Input, Output>;
export const feedEnergyDryBasisRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/feed-energy-dry-basis-ratio",
    title: "Feed Energy Dry Basis Ratio Tool",
    description:
      "Convert supplied energy per as-fed mass to energy per dry mass; no feeding recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asFedEnergy: { type: "number", minimum: 0 },
        dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["asFedEnergy", "dryFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryBasisEnergy: { type: "number" } },
      required: ["dryBasisEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "asFedEnergy",
          label: "As Fed Energy",
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
          id: "dryBasisEnergy",
          label: "Dry Basis Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedEnergyDryBasisRatioTool.execute;
export default feedEnergyDryBasisRatioTool;
