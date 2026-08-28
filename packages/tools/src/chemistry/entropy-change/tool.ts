import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const entropyChangeTool = createSimpleTool({
  id: "chemistry/entropy-change",
  title: "Entropy Change Calculator",
  description:
    "Compute the reaction entropy change as ΣS°(products) − ΣS°(reactants) with unit stoichiometric coefficients.",
  inputs: [
    {
      description: "Standard molar entropies of the products.",
      id: "productStandardEntropies",
      label: "Product S° values",
      kind: "numberList",
      unit: "J/(mol·K)",
    },
    {
      description: "Standard molar entropies of the reactants.",
      id: "reactantStandardEntropies",
      label: "Reactant S° values",
      kind: "numberList",
      unit: "J/(mol·K)",
    },
  ],
  outputs: [
    {
      description: "Reaction entropy change.",
      id: "entropyChangeJPerMolK",
      label: "ΔS reaction",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  calculate: (input) => {
    const sum = (values: number[]) =>
      values.reduce((total, value) => total + value, 0);
    return {
      entropyChangeJPerMolK:
        sum(input.productStandardEntropies as number[]) -
        sum(input.reactantStandardEntropies as number[]),
    };
  },
});
export const runEntropyChange = entropyChangeTool.execute;
export default entropyChangeTool;

export type EntropyChangeInput = {
  readonly productStandardEntropies: readonly number[];
  readonly reactantStandardEntropies: readonly number[];
};

export type EntropyChangeOutput = {
  readonly entropyChangeJPerMolK: number;
};

export const entropyChangeExample = {
  input: {
    productStandardEntropies: [1],
    reactantStandardEntropies: [1],
  },
  output: {
    entropyChangeJPerMolK: 0,
  },
} satisfies ToolExample<EntropyChangeInput, EntropyChangeOutput>;
