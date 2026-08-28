import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const halfLifeZeroOrderTool = createSimpleTool({
  id: "chemistry/half-life-zero-order",
  title: "Zero Order Half-Life Calculator",
  description:
    "Compute the zero-order half-life t½ = [A]₀/(2k) from a rate constant and initial concentration.",
  inputs: [
    {
      description: "Initial reactant concentration [A]₀ in mol/L.",
      id: "initialConcentrationMolL",
      label: "Initial concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Rate constant k in mol·L⁻¹·s⁻¹; must be greater than zero.",
      id: "rateConstantKMolPerLs",
      label: "Rate constant",
      kind: "number",
      unit: "mol/(L·s)",
    },
  ],
  outputs: [
    {
      description: "Half-life in seconds.",
      id: "halfLifeSeconds",
      label: "Half-life",
      kind: "number",
      unit: "s",
    },
  ],
  calculate: (input) => {
    const rate = input.rateConstantKMolPerLs as number;
    if (rate <= 0)
      simpleError(
        "rateConstantKMolPerLs",
        "The rate constant must be greater than zero.",
        "invalid_rate_constant",
      );
    return {
      halfLifeSeconds: (input.initialConcentrationMolL as number) / (2 * rate),
    };
  },
});
export const runHalfLifeZeroOrder = halfLifeZeroOrderTool.execute;
export default halfLifeZeroOrderTool;

export type HalfLifeZeroOrderInput = {
  readonly initialConcentrationMolL: number;
  readonly rateConstantKMolPerLs: number;
};

export type HalfLifeZeroOrderOutput = {
  readonly halfLifeSeconds: number;
};

export const halfLifeZeroOrderExample = {
  input: {
    initialConcentrationMolL: 1,
    rateConstantKMolPerLs: 1,
  },
  output: {
    halfLifeSeconds: 0.5,
  },
} satisfies ToolExample<HalfLifeZeroOrderInput, HalfLifeZeroOrderOutput>;
