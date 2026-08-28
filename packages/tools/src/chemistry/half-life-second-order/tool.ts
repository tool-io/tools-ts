import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const halfLifeSecondOrderTool = createSimpleTool({
  id: "chemistry/half-life-second-order",
  title: "Second Order Half-Life Calculator",
  description:
    "Compute the second-order half-life t½ = 1/(k·[A]₀) from a rate constant and initial concentration.",
  inputs: [
    {
      description: "Rate constant k in L·mol⁻¹·s⁻¹; must be greater than zero.",
      id: "rateConstantK",
      label: "Rate constant",
      kind: "number",
      unit: "L/(mol·s)",
    },
    {
      description: "Initial reactant concentration [A]₀ in mol/L.",
      id: "initialConcentrationMolL",
      label: "Initial concentration",
      kind: "number",
      unit: "mol/L",
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
    const rate = input.rateConstantK as number;
    if (rate <= 0)
      simpleError(
        "rateConstantK",
        "The rate constant must be greater than zero.",
        "invalid_rate_constant",
      );
    if (!((input.initialConcentrationMolL as number) > 0))
      simpleError(
        "initialConcentrationMolL",
        "Initial concentration must be greater than zero.",
      );
    return {
      halfLifeSeconds: 1 / (rate * (input.initialConcentrationMolL as number)),
    };
  },
});
export const runHalfLifeSecondOrder = halfLifeSecondOrderTool.execute;
export default halfLifeSecondOrderTool;

export type HalfLifeSecondOrderInput = {
  readonly rateConstantK: number;
  readonly initialConcentrationMolL: number;
};

export type HalfLifeSecondOrderOutput = {
  readonly halfLifeSeconds: number;
};

export const halfLifeSecondOrderExample = {
  input: {
    rateConstantK: 1,
    initialConcentrationMolL: 1,
  },
  output: {
    halfLifeSeconds: 1,
  },
} satisfies ToolExample<HalfLifeSecondOrderInput, HalfLifeSecondOrderOutput>;
