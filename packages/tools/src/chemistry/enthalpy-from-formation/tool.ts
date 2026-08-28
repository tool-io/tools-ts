import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const enthalpyFromFormationTool = createSimpleTool({
  id: "chemistry/enthalpy-from-formation",
  title: "Enthalpy From Formation Calculator",
  description:
    "Compute the reaction enthalpy as ΣΔHf(products) − ΣΔHf(reactants) with unit stoichiometric coefficients.",
  inputs: [
    {
      description: "Standard formation enthalpies of the products.",
      id: "productFormationEnthalpies",
      label: "Product ΔHf values",
      kind: "numberList",
      unit: "kJ/mol",
    },
    {
      description: "Standard formation enthalpies of the reactants.",
      id: "reactantFormationEnthalpies",
      label: "Reactant ΔHf values",
      kind: "numberList",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      description: "Reaction enthalpy change.",
      id: "reactionEnthalpyKJPerMol",
      label: "ΔH reaction",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const sum = (values: number[]) =>
      values.reduce((total, value) => total + value, 0);
    return {
      reactionEnthalpyKJPerMol:
        sum(input.productFormationEnthalpies as number[]) -
        sum(input.reactantFormationEnthalpies as number[]),
    };
  },
});
export const runEnthalpyFromFormation = enthalpyFromFormationTool.execute;
export default enthalpyFromFormationTool;

export type EnthalpyFromFormationInput = {
  readonly productFormationEnthalpies: readonly number[];
  readonly reactantFormationEnthalpies: readonly number[];
};

export type EnthalpyFromFormationOutput = {
  readonly reactionEnthalpyKJPerMol: number;
};

export const enthalpyFromFormationExample = {
  input: {
    productFormationEnthalpies: [1],
    reactantFormationEnthalpies: [1],
  },
  output: {
    reactionEnthalpyKJPerMol: 0,
  },
} satisfies ToolExample<
  EnthalpyFromFormationInput,
  EnthalpyFromFormationOutput
>;
