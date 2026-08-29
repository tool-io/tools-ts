import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const zeroOrderIntegratedTool = createSimpleTool({
  id: "chemistry/zero-order-integrated",
  title: "Zero Order Integrated Rate Calculator",
  description:
    "Solve the zero-order integrated rate law [A] = [A]₀ − k·t for the remaining concentration, clamped at zero.",
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
      description: "Rate constant in mol·L⁻¹·s⁻¹.",
      id: "rateConstantMolPerLs",
      label: "Rate constant",
      kind: "number",
      minimum: 0,
      unit: "mol/(L·s)",
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
      description:
        "Concentration [A] after the elapsed time; never below zero.",
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    const remaining =
      (input.initialConcentrationMolL as number) -
      (input.rateConstantMolPerLs as number) * (input.timeSeconds as number);
    return { concentrationMolL: Math.max(remaining, 0) };
  },
});
export const runZeroOrderIntegrated = zeroOrderIntegratedTool.execute;
export default zeroOrderIntegratedTool;

export type ZeroOrderIntegratedInput = {
  readonly initialConcentrationMolL: number;
  readonly rateConstantMolPerLs: number;
  readonly timeSeconds: number;
};

export type ZeroOrderIntegratedOutput = {
  readonly concentrationMolL: number;
};

export const zeroOrderIntegratedExample = {
  input: {
    initialConcentrationMolL: 1,
    rateConstantMolPerLs: 1,
    timeSeconds: 1,
  },
  output: {
    concentrationMolL: 0,
  },
} satisfies ToolExample<ZeroOrderIntegratedInput, ZeroOrderIntegratedOutput>;
