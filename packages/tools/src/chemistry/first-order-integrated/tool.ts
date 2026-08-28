import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const firstOrderIntegratedTool = createSimpleTool({
  id: "chemistry/first-order-integrated",
  title: "First Order Integrated Rate Calculator",
  description:
    "Solve the first-order integrated rate law ln([A]₀/[A]) = k·t for the remaining concentration.",
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
      description: "First-order rate constant in s⁻¹.",
      id: "rateConstantPerS",
      label: "Rate constant",
      kind: "number",
      minimum: 0,
      unit: "1/s",
    },
    {
      description: "Elapsed time.",
      id: "timeSeconds",
      label: "Time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Concentration [A] after the elapsed time.",
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    return {
      concentrationMolL:
        (input.initialConcentrationMolL as number) *
        Math.exp(
          -((input.rateConstantPerS as number) * (input.timeSeconds as number)),
        ),
    };
  },
});
export const runFirstOrderIntegrated = firstOrderIntegratedTool.execute;
export default firstOrderIntegratedTool;

export type FirstOrderIntegratedInput = {
  readonly initialConcentrationMolL: number;
  readonly rateConstantPerS: number;
  readonly timeSeconds: number;
};

export type FirstOrderIntegratedOutput = {
  readonly concentrationMolL: number;
};

export const firstOrderIntegratedExample = {
  input: {
    initialConcentrationMolL: 1,
    rateConstantPerS: 1,
    timeSeconds: 1,
  },
  output: {
    concentrationMolL: 0.36787944117144233,
  },
} satisfies ToolExample<FirstOrderIntegratedInput, FirstOrderIntegratedOutput>;
