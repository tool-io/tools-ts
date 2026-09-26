import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pricePerMass: number;
  readonly energyPerMass: number;
};
export type Output = { readonly pricePerEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pricePerMass: { type: "number" },
    energyPerMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pricePerMass", "energyPerMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pricePerEnergy: { type: "number" } },
  required: ["pricePerEnergy"],
} as const;
/** Calculate fuel heat content price factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pricePerMass, energyPerMass } = request;
  const compute = (): Output => {
    H.positive(energyPerMass);
    return { pricePerEnergy: pricePerMass / energyPerMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pricePerMass: 60, energyPerMass: 30 },
  output: { pricePerEnergy: 2 },
} satisfies ToolExample<Input, Output>;
export const fuelHeatContentPriceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/fuel-heat-content-price-factor",
    title: "Fuel Heat Content Price Factor Tool",
    description:
      "Calculate fuel heat content price factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pricePerMass: { type: "number" },
        energyPerMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pricePerMass", "energyPerMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pricePerEnergy: { type: "number" } },
      required: ["pricePerEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "pricePerMass",
          label: "Price Per Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energyPerMass",
          label: "Energy Per Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pricePerEnergy",
          label: "Price Per Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fuelHeatContentPriceFactorTool.execute;
export default fuelHeatContentPriceFactorTool;
