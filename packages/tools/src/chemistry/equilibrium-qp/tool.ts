import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const equilibriumQpTool = createSimpleTool({
  id: "chemistry/equilibrium-qp",
  title: "Equilibrium Qp Calculator",
  description:
    "Compute the reaction quotient in terms of partial pressures as Qp = P_B^b / P_A^a for aA ⇌ bB.",
  inputs: [
    {
      description:
        "Current reactant partial pressure; must be greater than zero.",
      id: "reactantPressureAtm",
      label: "Reactant pressure",
      kind: "number",
      unit: "atm",
    },
    {
      description:
        "Current product partial pressure; must be greater than zero.",
      id: "productPressureAtm",
      label: "Product pressure",
      kind: "number",
      unit: "atm",
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
      description: "Reaction quotient based on partial pressures.",
      id: "qp",
      label: "Qp",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const reactant = input.reactantPressureAtm as number;
    if (reactant <= 0)
      simpleError(
        "reactantPressureAtm",
        "The reactant pressure must be greater than zero.",
        "invalid_pressure",
      );
    return {
      qp:
        (input.productPressureAtm as number) ** (input.productCoeff as number) /
        reactant ** (input.reactantCoeff as number),
    };
  },
});
export const runEquilibriumQp = equilibriumQpTool.execute;
export default equilibriumQpTool;

export type EquilibriumQpInput = {
  readonly reactantPressureAtm: number;
  readonly productPressureAtm: number;
  readonly reactantCoeff: number;
  readonly productCoeff: number;
};

export type EquilibriumQpOutput = {
  readonly qp: number;
};

export const equilibriumQpExample = {
  input: {
    reactantPressureAtm: 1,
    productPressureAtm: 1,
    reactantCoeff: 1,
    productCoeff: 1,
  },
  output: {
    qp: 1,
  },
} satisfies ToolExample<EquilibriumQpInput, EquilibriumQpOutput>;
