import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const kcFromConcentrationsTool = createSimpleTool({
  id: "chemistry/kc-from-concentrations",
  title: "Kc From Concentrations Calculator",
  description:
    "Compute the concentration-based equilibrium constant Kc = [B]^b / [A]^a for a reversible reaction aA ⇌ bB.",
  inputs: [
    {
      description:
        "Equilibrium reactant concentration; must be greater than zero.",
      id: "reactantConcentrationMolL",
      label: "Reactant concentration",
      kind: "number",
      unit: "mol/L",
    },
    {
      description:
        "Equilibrium product concentration; must be greater than zero.",
      id: "productConcentrationMolL",
      label: "Product concentration",
      kind: "number",
      unit: "mol/L",
    },
    {
      description: "Reactant stoichiometric coefficient.",
      id: "reactantCoeff",
      label: "Reactant coefficient",
      kind: "integer",
      minimum: 1,
    },
    {
      description: "Product stoichiometric coefficient.",
      id: "productCoeff",
      label: "Product coefficient",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Concentration-based equilibrium constant.",
      id: "kc",
      label: "Kc",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const reactant = input.reactantConcentrationMolL as number;
    if (reactant <= 0)
      simpleError(
        "reactantConcentrationMolL",
        "The reactant concentration must be greater than zero.",
        "invalid_concentration",
      );
    return {
      kc:
        (input.productConcentrationMolL as number) **
          (input.productCoeff as number) /
        reactant ** (input.reactantCoeff as number),
    };
  },
});
export const runKcFromConcentrations = kcFromConcentrationsTool.execute;
export default kcFromConcentrationsTool;

export type KcFromConcentrationsInput = {
  readonly reactantConcentrationMolL: number;
  readonly productConcentrationMolL: number;
  readonly reactantCoeff: number;
  readonly productCoeff: number;
};

export type KcFromConcentrationsOutput = {
  readonly kc: number;
};

export const kcFromConcentrationsExample = {
  input: {
    reactantConcentrationMolL: 1,
    productConcentrationMolL: 1,
    reactantCoeff: 1,
    productCoeff: 1,
  },
  output: {
    kc: 1,
  },
} satisfies ToolExample<KcFromConcentrationsInput, KcFromConcentrationsOutput>;
