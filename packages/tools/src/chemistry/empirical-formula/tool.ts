import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EmpiricalFormulaInput = {
  readonly molesElementA: number;
  readonly molesElementB: number;
};

export type EmpiricalFormulaOutput = {
  readonly empiricalRatioA: number;
  readonly empiricalRatioB: number;
};

export const empiricalFormulaExample = {
  input: { molesElementA: 1, molesElementB: 2 },
  output: { empiricalRatioA: 1, empiricalRatioB: 2 },
} satisfies ToolExample<EmpiricalFormulaInput, EmpiricalFormulaOutput>;

export const empiricalFormulaTool = createSimpleTool({
  id: "chemistry/empirical-formula",
  title: "Empirical Ratio Calculator",
  description:
    "Divide two element mole amounts by the smaller one to obtain whole-number-friendly empirical ratios.",
  inputs: [
    {
      description: "Amount of element A.",
      id: "molesElementA",
      kind: "number",
      label: "Moles of element A",
      unit: "mol",
    },
    {
      description: "Amount of element B.",
      id: "molesElementB",
      kind: "number",
      label: "Moles of element B",
      unit: "mol",
    },
  ],
  outputs: [
    {
      description:
        "Empirical ratio of element A relative to the smaller amount.",
      id: "empiricalRatioA",
      kind: "number",
      label: "Empirical ratio A",
    },
    {
      description:
        "Empirical ratio of element B relative to the smaller amount.",
      id: "empiricalRatioB",
      kind: "number",
      label: "Empirical ratio B",
    },
  ],
  calculate: (input) => {
    const molesElementA = input.molesElementA as number;
    if (!(molesElementA > 0))
      simpleError(
        "molesElementA",
        "Element A amount must be greater than zero.",
      );
    const molesElementB = input.molesElementB as number;
    if (!(molesElementB > 0))
      simpleError(
        "molesElementB",
        "Element B amount must be greater than zero.",
      );
    const smallest = Math.min(molesElementA, molesElementB);
    return {
      empiricalRatioA: Math.round((molesElementA / smallest) * 1000) / 1000,
      empiricalRatioB: Math.round((molesElementB / smallest) * 1000) / 1000,
    };
  },
});
export const runEmpiricalFormula = empiricalFormulaTool.execute;
export default empiricalFormulaTool;
