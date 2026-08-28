import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const empiricalFormulaFromMolesTool = createSimpleTool({
  id: "chemistry/empirical-formula-from-moles",
  title: "Empirical Formula From Moles Calculator",
  description:
    "Compute empirical formula element ratios by dividing each element's mole amount by the smallest mole amount.",
  inputs: [
    {
      description: "Element symbols in the same order as the moles list.",
      id: "elements",
      label: "Elements",
      kind: "stringList",
    },
    {
      description: "Mole amounts for each element.",
      id: "moles",
      label: "Moles",
      kind: "numberList",
      unit: "mol",
    },
  ],
  outputs: [
    {
      description:
        "Element symbol mapped to its ratio relative to the smallest amount, rounded to two decimals.",
      id: "ratios",
      label: "Element ratios",
      kind: "object",
    },
  ],
  calculate: (input) => {
    const elements = input.elements as string[];
    const moles = input.moles as number[];
    if (elements.length === 0 || elements.length !== moles.length)
      simpleError(
        "moles",
        "Provide matching non-empty element and mole lists.",
        "invalid_lengths",
      );
    if (moles.some((amount) => !(amount > 0)))
      simpleError(
        "moles",
        "Every mole amount must be greater than zero.",
        "invalid_amount",
      );
    const smallest = Math.min(...moles);
    const ratios: Record<string, number> = {};
    elements.forEach((element, index) => {
      const ratio = Math.round((moles[index]! / smallest) * 100) / 100;
      ratios[element] = ratio;
    });
    return { ratios };
  },
});
export const runEmpiricalFormulaFromMoles =
  empiricalFormulaFromMolesTool.execute;
export default empiricalFormulaFromMolesTool;

export type EmpiricalFormulaFromMolesInput = {
  readonly elements: readonly string[];
  readonly moles: readonly number[];
};

export type EmpiricalFormulaFromMolesOutput = {
  readonly ratios: Record<string, unknown>;
};

export const empiricalFormulaFromMolesExample = {
  input: {
    elements: ["H", "O"],
    moles: [2, 1],
  },
  output: {
    ratios: {
      H: 2,
      O: 1,
    },
  },
} satisfies ToolExample<
  EmpiricalFormulaFromMolesInput,
  EmpiricalFormulaFromMolesOutput
>;
