import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly energy: number; readonly nutrientMass: number };
export type Output = { readonly energyPerMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energy: { type: "number", minimum: 0 },
    nutrientMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["energy", "nutrientMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyPerMass: { type: "number" } },
  required: ["energyPerMass"],
} as const;
/** Divide a supplied energy amount by a compatible nutrient mass without prescribing intake. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energy, nutrientMass } = request;
  const compute = (): Output => {
    H.domain(energy >= 0);
    H.positive(nutrientMass);
    return { energyPerMass: energy / nutrientMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { energy: 40, nutrientMass: 10 },
  output: { energyPerMass: 4 },
} satisfies ToolExample<Input, Output>;
export const nutrientUnitEnergyRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/nutrient-unit-energy-ratio",
    title: "Nutrient Unit Energy Ratio Tool",
    description:
      "Divide a supplied energy amount by a compatible nutrient mass without prescribing intake.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energy: { type: "number", minimum: 0 },
        nutrientMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["energy", "nutrientMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { energyPerMass: { type: "number" } },
      required: ["energyPerMass"],
    },
    ports: {
      inputs: [
        {
          id: "energy",
          label: "Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nutrientMass",
          label: "Nutrient Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyPerMass",
          label: "Energy Per Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientUnitEnergyRatioTool.execute;
export default nutrientUnitEnergyRatioTool;
