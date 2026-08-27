import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WaterPotentialTotalInput = {
  readonly matricPotentialMpa?: number;
  readonly osmoticPotentialMpa: number;
  readonly pressurePotentialMpa: number;
};

export type WaterPotentialTotalOutput = {
  readonly totalWaterPotentialMpa: number;
};

export const waterPotentialTotalExample = {
  input: {
    matricPotentialMpa: -0.1,
    osmoticPotentialMpa: -0.9,
    pressurePotentialMpa: 0.4,
  },
  output: { totalWaterPotentialMpa: -0.6 },
} satisfies ToolExample<WaterPotentialTotalInput, WaterPotentialTotalOutput>;

export const waterPotentialTotalTool = createSimpleTool({
  id: "biology/water-potential-total",
  title: "Total Water Potential",
  description:
    "Compute the total water potential in megapascals as the sum of the osmotic, pressure, and matric potentials; the matric potential defaults to zero and all inputs are signed.",
  inputs: [
    {
      description: "Osmotic potential in megapascals.",
      id: "osmoticPotentialMpa",
      kind: "number",
      label: "Osmotic potential",
      unit: "MPa",
    },
    {
      description: "Pressure (turgor) potential in megapascals.",
      id: "pressurePotentialMpa",
      kind: "number",
      label: "Pressure potential",
      unit: "MPa",
    },
    {
      default: 0,
      description:
        "Matric potential in megapascals; defaults to zero when capillary and surface interactions are ignored.",
      id: "matricPotentialMpa",
      kind: "number",
      label: "Matric potential",
      unit: "MPa",
    },
  ],
  outputs: [
    {
      description: "Total water potential in megapascals; signed.",
      id: "totalWaterPotentialMpa",
      kind: "number",
      label: "Total water potential",
      unit: "MPa",
    },
  ],
  calculate: (input) => {
    const osmoticPotentialMpa = input.osmoticPotentialMpa as number;
    const pressurePotentialMpa = input.pressurePotentialMpa as number;
    const matricPotentialMpa = input.matricPotentialMpa as number;
    return {
      totalWaterPotentialMpa:
        osmoticPotentialMpa + pressurePotentialMpa + matricPotentialMpa,
    };
  },
});
export const runWaterPotentialTotal = waterPotentialTotalTool.execute;
export default waterPotentialTotalTool;
