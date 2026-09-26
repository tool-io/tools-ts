import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculateInductorEnergy as energy } from "../../electronics/inductor-energy/tool.js";
export type Input = {
  readonly inductanceHenries: number;
  readonly firstCurrentAmps: number;
  readonly secondCurrentAmps: number;
};
export type Output = {
  readonly firstEnergyJoules: number;
  readonly secondEnergyJoules: number;
  readonly energyChangeJoules: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inductanceHenries: { type: "number", minimum: 0 },
    firstCurrentAmps: { type: "number" },
    secondCurrentAmps: { type: "number" },
  },
  required: ["inductanceHenries", "firstCurrentAmps", "secondCurrentAmps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEnergyJoules: { type: "number" },
    secondEnergyJoules: { type: "number" },
    energyChangeJoules: { type: "number" },
  },
  required: ["firstEnergyJoules", "secondEnergyJoules", "energyChangeJoules"],
} as const;
/** Compare stored energies at two explicit signed currents in the same ideal inductor, reusing the single-state energy function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inductanceHenries, firstCurrentAmps, secondCurrentAmps } = request;
  const compute = (): Output => {
    H.domain(inductanceHenries >= 0);
    const firstEnergyJoules = energy({
        inductanceH: inductanceHenries,
        currentA: Math.abs(firstCurrentAmps),
      }).energyJoules,
      secondEnergyJoules = energy({
        inductanceH: inductanceHenries,
        currentA: Math.abs(secondCurrentAmps),
      }).energyJoules;
    return {
      firstEnergyJoules,
      secondEnergyJoules,
      energyChangeJoules: secondEnergyJoules - firstEnergyJoules,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inductanceHenries: 2, firstCurrentAmps: 3, secondCurrentAmps: 4 },
  output: {
    firstEnergyJoules: 9,
    secondEnergyJoules: 16,
    energyChangeJoules: 7,
  },
} satisfies ToolExample<Input, Output>;
export const inductorCurrentStepEnergyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/inductor-current-step-energy",
    title: "Inductor Current Step Energy Tool",
    description:
      "Compare stored energies at two explicit signed currents in the same ideal inductor, reusing the single-state energy function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inductanceHenries: { type: "number", minimum: 0 },
        firstCurrentAmps: { type: "number" },
        secondCurrentAmps: { type: "number" },
      },
      required: ["inductanceHenries", "firstCurrentAmps", "secondCurrentAmps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEnergyJoules: { type: "number" },
        secondEnergyJoules: { type: "number" },
        energyChangeJoules: { type: "number" },
      },
      required: [
        "firstEnergyJoules",
        "secondEnergyJoules",
        "energyChangeJoules",
      ],
    },
    ports: {
      inputs: [
        {
          id: "inductanceHenries",
          label: "Inductance Henries",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstCurrentAmps",
          label: "First Current Amps",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCurrentAmps",
          label: "Second Current Amps",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstEnergyJoules",
          label: "First Energy Joules",
          valueType: { type: "number" },
        },
        {
          id: "secondEnergyJoules",
          label: "Second Energy Joules",
          valueType: { type: "number" },
        },
        {
          id: "energyChangeJoules",
          label: "Energy Change Joules",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inductorCurrentStepEnergyTool.execute;
export default inductorCurrentStepEnergyTool;
