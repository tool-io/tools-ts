import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nutrientAmount: number;
  readonly energy: number;
  readonly referenceEnergy: number;
};
export type Output = { readonly density: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nutrientAmount: { type: "number", minimum: 0 },
    energy: { type: "number", exclusiveMinimum: 0 },
    referenceEnergy: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["nutrientAmount", "energy", "referenceEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { density: { type: "number" } },
  required: ["density"],
} as const;
/** Calculate nutrient density per energy basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nutrientAmount, energy, referenceEnergy } = request;
  const compute = (): Output => {
    H.domain(nutrientAmount >= 0);
    H.positive(energy);
    H.positive(referenceEnergy);
    return { density: (nutrientAmount * referenceEnergy) / energy };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nutrientAmount: 30, energy: 500, referenceEnergy: 1000 },
  output: { density: 60 },
} satisfies ToolExample<Input, Output>;
export const nutrientDensityPerEnergyBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/nutrient-density-per-energy-basis",
    title: "Nutrient Density Per Energy Basis Tool",
    description:
      "Calculate nutrient density per energy basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nutrientAmount: { type: "number", minimum: 0 },
        energy: { type: "number", exclusiveMinimum: 0 },
        referenceEnergy: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["nutrientAmount", "energy", "referenceEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { density: { type: "number" } },
      required: ["density"],
    },
    ports: {
      inputs: [
        {
          id: "nutrientAmount",
          label: "Nutrient Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energy",
          label: "Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEnergy",
          label: "Reference Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nutrientDensityPerEnergyBasisTool.execute;
export default nutrientDensityPerEnergyBasisTool;
