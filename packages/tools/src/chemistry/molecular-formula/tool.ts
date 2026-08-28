import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolecularFormulaInput = {
  readonly empiricalWeight: number;
  readonly molecularWeight: number;
};

export type MolecularFormulaOutput = {
  readonly formulaMultiplier: number;
};

export const molecularFormulaExample = {
  input: { molecularWeight: 180, empiricalWeight: 30 },
  output: { formulaMultiplier: 6 },
} satisfies ToolExample<MolecularFormulaInput, MolecularFormulaOutput>;

export const molecularFormulaTool = createSimpleTool({
  id: "chemistry/molecular-formula",
  title: "Molecular Multiplier Calculator",
  description:
    "Determine how many empirical formula units make up the molecular formula.",
  inputs: [
    {
      description: "Molar mass of the molecular formula.",
      id: "molecularWeight",
      kind: "number",
      label: "Molecular weight",
      unit: "g/mol",
    },
    {
      description: "Molar mass of the empirical formula.",
      id: "empiricalWeight",
      kind: "number",
      label: "Empirical weight",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Whole-number multiplier of the empirical formula.",
      id: "formulaMultiplier",
      kind: "integer",
      label: "Formula multiplier",
    },
  ],
  calculate: (input) => {
    const molecularWeight = input.molecularWeight as number;
    if (!(molecularWeight > 0))
      simpleError(
        "molecularWeight",
        "The molecular weight must be greater than zero.",
      );
    const empiricalWeight = input.empiricalWeight as number;
    if (!(empiricalWeight > 0))
      simpleError(
        "empiricalWeight",
        "The empirical weight must be greater than zero.",
      );
    const ratio = molecularWeight / empiricalWeight;
    const formulaMultiplier = Math.round(ratio);
    if (
      formulaMultiplier < 1 ||
      Math.abs(ratio - formulaMultiplier) / formulaMultiplier > 0.05
    )
      simpleError(
        "molecularWeight",
        "The mass ratio must be within 5% of a positive whole-number multiplier.",
        "nonintegral_multiplier",
      );
    return { formulaMultiplier };
  },
});
export const runMolecularFormula = molecularFormulaTool.execute;
export default molecularFormulaTool;
