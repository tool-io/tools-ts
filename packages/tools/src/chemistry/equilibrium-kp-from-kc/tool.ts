import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const equilibriumKpFromKcTool = createSimpleTool({
  id: "chemistry/equilibrium-kp-from-kc",
  title: "Kp From Kc Calculator",
  description:
    "Relate gas-phase equilibrium constants via Kp = Kc·(RT)^Δn where Δn is products minus reactants coefficients.",
  inputs: [
    {
      description: "Concentration-based equilibrium constant.",
      id: "kc",
      label: "Kc",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Absolute temperature.",
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      description:
        "Δn: sum of gas-product coefficients minus gas-reactant coefficients.",
      id: "deltaN",
      label: "Δn",
      kind: "integer",
    },
  ],
  outputs: [
    {
      description: "Pressure-based equilibrium constant.",
      id: "kp",
      label: "Kp",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const R = 0.08206;
    return {
      kp:
        (input.kc as number) *
        (R * (input.temperatureK as number)) ** (input.deltaN as number),
    };
  },
});
export const runEquilibriumKpFromKc = equilibriumKpFromKcTool.execute;
export default equilibriumKpFromKcTool;

export type EquilibriumKpFromKcInput = {
  readonly kc: number;
  readonly temperatureK: number;
  readonly deltaN: number;
};

export type EquilibriumKpFromKcOutput = {
  readonly kp: number;
};

export const equilibriumKpFromKcExample = {
  input: {
    kc: 1,
    temperatureK: 1,
    deltaN: 1,
  },
  output: {
    kp: 0.08206,
  },
} satisfies ToolExample<EquilibriumKpFromKcInput, EquilibriumKpFromKcOutput>;
