import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fuelCostPerUnit: number;
  readonly energyPerFuelUnit: number;
  readonly efficiencyFraction: number;
};
export type Output = { readonly costPerUsefulEnergyUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fuelCostPerUnit: { type: "number", minimum: 0 },
    energyPerFuelUnit: { type: "number", exclusiveMinimum: 0 },
    efficiencyFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["fuelCostPerUnit", "energyPerFuelUnit", "efficiencyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { costPerUsefulEnergyUnit: { type: "number" } },
  required: ["costPerUsefulEnergyUnit"],
} as const;
/** Normalize an explicit fuel-unit cost by its supplied energy content and positive useful-energy efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fuelCostPerUnit, energyPerFuelUnit, efficiencyFraction } = request;
  const compute = (): Output => {
    H.domain(fuelCostPerUnit >= 0, "fuelCostPerUnit");
    (H.domain(energyPerFuelUnit > 0, "energyPerFuelUnit"), energyPerFuelUnit);
    H.domain(
      efficiencyFraction > 0 && efficiencyFraction <= 1,
      "efficiencyFraction",
    );
    return {
      costPerUsefulEnergyUnit:
        fuelCostPerUnit / (energyPerFuelUnit * efficiencyFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fuelCostPerUnit: 3,
    energyPerFuelUnit: 10,
    efficiencyFraction: 0.75,
  },
  output: { costPerUsefulEnergyUnit: 0.4 },
} satisfies ToolExample<Input, Output>;
export const fuelUsefulEnergyCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/fuel-useful-energy-cost",
    title: "Fuel Useful Energy Cost",
    description:
      "Normalize an explicit fuel-unit cost by its supplied energy content and positive useful-energy efficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fuelCostPerUnit: { type: "number", minimum: 0 },
        energyPerFuelUnit: { type: "number", exclusiveMinimum: 0 },
        efficiencyFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["fuelCostPerUnit", "energyPerFuelUnit", "efficiencyFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { costPerUsefulEnergyUnit: { type: "number" } },
      required: ["costPerUsefulEnergyUnit"],
    },
    ports: {
      inputs: [
        {
          id: "fuelCostPerUnit",
          label: "Fuel Cost Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energyPerFuelUnit",
          label: "Energy Per Fuel Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiencyFraction",
          label: "Efficiency Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "costPerUsefulEnergyUnit",
          label: "Cost Per Useful Energy Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fuelUsefulEnergyCostTool.execute;
export default fuelUsefulEnergyCostTool;
