import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const secondOrderIntegratedTool = createSimpleTool({
  id: "chemistry/second-order-integrated",
  title: "Second Order Integrated Rate Calculator",
  description:
    "Solve the second-order integrated rate law 1/[A] = 1/[A]₀ + k·t for the remaining concentration.",
  inputs: [
    {
      description: "Initial reactant concentration [A]₀ in mol/L.",
      id: "initialConcentrationMolL",
      label: "Initial concentration",
      kind: "number",
      unit: "mol/L",
    },
    {
      description: "Second-order rate constant in L·mol⁻¹·s⁻¹.",
      id: "rateConstantKLPerMolS",
      label: "Rate constant",
      kind: "number",
      minimum: 0,
      unit: "L/(mol·s)",
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
    const initial = input.initialConcentrationMolL as number;
    if (!(initial > 0))
      simpleError(
        "initialConcentrationMolL",
        "Initial concentration must be greater than zero.",
      );
    const inverse =
      1 / initial +
      (input.rateConstantKLPerMolS as number) * (input.timeSeconds as number);
    return { concentrationMolL: 1 / inverse };
  },
});
export const runSecondOrderIntegrated = secondOrderIntegratedTool.execute;
export default secondOrderIntegratedTool;

export type SecondOrderIntegratedInput = {
  readonly initialConcentrationMolL: number;
  readonly rateConstantKLPerMolS: number;
  readonly timeSeconds: number;
};

export type SecondOrderIntegratedOutput = {
  readonly concentrationMolL: number;
};

export const secondOrderIntegratedExample = {
  input: {
    initialConcentrationMolL: 1,
    rateConstantKLPerMolS: 1,
    timeSeconds: 1,
  },
  output: {
    concentrationMolL: 0.5,
  },
} satisfies ToolExample<
  SecondOrderIntegratedInput,
  SecondOrderIntegratedOutput
>;
