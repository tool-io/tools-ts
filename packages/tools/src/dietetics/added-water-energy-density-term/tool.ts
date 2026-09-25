import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalEnergy: number;
  readonly originalMass: number;
  readonly addedWaterMass: number;
};
export type Output = {
  readonly newMass: number;
  readonly energyPerMass: number;
  readonly dilutionFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalEnergy: { type: "number", minimum: 0 },
    originalMass: { type: "number", exclusiveMinimum: 0 },
    addedWaterMass: { type: "number", minimum: 0 },
  },
  required: ["originalEnergy", "originalMass", "addedWaterMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newMass: { type: "number" },
    energyPerMass: { type: "number" },
    dilutionFactor: { type: "number" },
  },
  required: ["newMass", "energyPerMass", "dilutionFactor"],
} as const;
/** Calculate added water energy density term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalEnergy, originalMass, addedWaterMass } = request;
  const compute = (): Output => {
    H.domain(originalEnergy >= 0 && addedWaterMass >= 0);
    H.positive(originalMass);
    return {
      newMass: originalMass + addedWaterMass,
      energyPerMass: originalEnergy / (originalMass + addedWaterMass),
      dilutionFactor: originalMass / (originalMass + addedWaterMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalEnergy: 200, originalMass: 100, addedWaterMass: 100 },
  output: { newMass: 200, energyPerMass: 1, dilutionFactor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const addedWaterEnergyDensityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/added-water-energy-density-term",
    title: "Added Water Energy Density Term Tool",
    description:
      "Calculate added water energy density term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalEnergy: { type: "number", minimum: 0 },
        originalMass: { type: "number", exclusiveMinimum: 0 },
        addedWaterMass: { type: "number", minimum: 0 },
      },
      required: ["originalEnergy", "originalMass", "addedWaterMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newMass: { type: "number" },
        energyPerMass: { type: "number" },
        dilutionFactor: { type: "number" },
      },
      required: ["newMass", "energyPerMass", "dilutionFactor"],
    },
    ports: {
      inputs: [
        {
          id: "originalEnergy",
          label: "Original Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalMass",
          label: "Original Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedWaterMass",
          label: "Added Water Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "newMass", label: "New Mass", valueType: { type: "number" } },
        {
          id: "energyPerMass",
          label: "Energy Per Mass",
          valueType: { type: "number" },
        },
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = addedWaterEnergyDensityTermTool.execute;
export default addedWaterEnergyDensityTermTool;
