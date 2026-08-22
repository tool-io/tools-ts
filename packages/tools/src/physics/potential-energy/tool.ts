import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const potentialEnergyTool = createSimpleTool({
  id: "physics/potential-energy",
  title: "Potential Energy Calculator",
  description:
    "Compute gravitational potential energy as mass times height times gravitational acceleration.",
  inputs: [
    {
      description: "Mass in kilograms.",
      id: "massKg",
      label: "Mass",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Height above the reference level in meters.",
      id: "heightM",
      label: "Height",
      kind: "number",
      unit: "m",
    },
    {
      default: 9.80665,
      description:
        "Gravitational acceleration; defaults to standard Earth gravity.",
      id: "gravityMs2",
      label: "Gravity",
      kind: "number",
      unit: "m/s²",
    },
  ],
  outputs: [{ id: "joules", label: "Energy", kind: "number", unit: "J" }],
  calculate: (input) => {
    return {
      joules:
        (input.massKg as number) *
        (input.heightM as number) *
        (input.gravityMs2 as number),
    };
  },
});
export const runPotentialEnergy = potentialEnergyTool.execute;
export default potentialEnergyTool;

export type PotentialEnergyInput = {
  readonly massKg: number;
  readonly heightM: number;
  readonly gravityMs2: number;
};

export type PotentialEnergyOutput = {
  readonly joules: number;
};

export const potentialEnergyExample = {
  input: {
    massKg: 1,
    heightM: 1,
    gravityMs2: 9.80665,
  },
  output: {
    joules: 9.80665,
  },
} satisfies ToolExample<PotentialEnergyInput, PotentialEnergyOutput>;
