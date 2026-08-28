import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const enthalpyCombustionTool = createSimpleTool({
  id: "chemistry/enthalpy-combustion",
  title: "Enthalpy of Combustion Calculator",
  description:
    "Compute combustion enthalpy from sum of product minus reactant formation enthalpies.",
  inputs: [
    {
      id: "productEnthalpiesKJPerMol",
      label: "Product dHf",
      kind: "numberList",
      unit: "kJ/mol",
    },
    {
      id: "reactantEnthalpiesKJPerMol",
      label: "Reactant dHf",
      kind: "numberList",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "combustionEnthalpyKJPerMol",
      label: "dH combustion",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);
    return {
      combustionEnthalpyKJPerMol:
        sum(input.productEnthalpiesKJPerMol as number[]) -
        sum(input.reactantEnthalpiesKJPerMol as number[]),
    };
  },
});
export const runEnthalpyCombustion = enthalpyCombustionTool.execute;
export default enthalpyCombustionTool;

export type EnthalpyCombustionInput = {
  readonly productEnthalpiesKJPerMol: readonly number[];
  readonly reactantEnthalpiesKJPerMol: readonly number[];
};

export type EnthalpyCombustionOutput = {
  readonly combustionEnthalpyKJPerMol: number;
};

export const enthalpyCombustionExample = {
  input: {
    productEnthalpiesKJPerMol: [1],
    reactantEnthalpiesKJPerMol: [1],
  },
  output: {
    combustionEnthalpyKJPerMol: 0,
  },
} satisfies ToolExample<EnthalpyCombustionInput, EnthalpyCombustionOutput>;
