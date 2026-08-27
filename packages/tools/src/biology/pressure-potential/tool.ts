import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PressurePotentialInput = {
  readonly osmoticPotentialMpa: number;
  readonly waterPotentialTotalMpa: number;
};

export type PressurePotentialOutput = {
  readonly pressurePotentialMpa: number;
};

export const pressurePotentialExample = {
  input: { osmoticPotentialMpa: -1.2, waterPotentialTotalMpa: -0.8 },
  output: { pressurePotentialMpa: 0.3999999999999999 },
} satisfies ToolExample<PressurePotentialInput, PressurePotentialOutput>;

export const pressurePotentialTool = createSimpleTool({
  id: "biology/pressure-potential",
  title: "Pressure Potential",
  description:
    "Compute the pressure (turgor) potential in megapascals as the total water potential minus the osmotic potential; both inputs are signed.",
  inputs: [
    {
      description: "Total water potential in megapascals.",
      id: "waterPotentialTotalMpa",
      kind: "number",
      label: "Total water potential",
      unit: "MPa",
    },
    {
      description: "Osmotic potential in megapascals.",
      id: "osmoticPotentialMpa",
      kind: "number",
      label: "Osmotic potential",
      unit: "MPa",
    },
  ],
  outputs: [
    {
      description:
        "Pressure potential in megapascals; signed and typically positive in turgid cells.",
      id: "pressurePotentialMpa",
      kind: "number",
      label: "Pressure potential",
      unit: "MPa",
    },
  ],
  calculate: (input) => {
    const waterPotentialTotalMpa = input.waterPotentialTotalMpa as number;
    const osmoticPotentialMpa = input.osmoticPotentialMpa as number;
    return {
      pressurePotentialMpa: waterPotentialTotalMpa - osmoticPotentialMpa,
    };
  },
});
export const runPressurePotential = pressurePotentialTool.execute;
export default pressurePotentialTool;
