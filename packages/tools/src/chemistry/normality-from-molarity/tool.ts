import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const normalityFromMolarityTool = createSimpleTool({
  id: "chemistry/normality-from-molarity",
  title: "Normality From Molarity Calculator",
  description:
    "Compute normality as molarity times equivalents per mole (N = M × n).",
  inputs: [
    {
      description: "Molarity of the solution.",
      id: "molarityMolL",
      label: "Molarity",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Equivalents contributed per mole of solute.",
      id: "equivalentsPerMole",
      label: "Equivalents per mole",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Normality in equivalents per liter.",
      id: "normality",
      label: "Normality",
      kind: "number",
      unit: "N",
    },
  ],
  calculate: (input) => {
    return {
      normality:
        (input.molarityMolL as number) * (input.equivalentsPerMole as number),
    };
  },
});
export const runNormalityFromMolarity = normalityFromMolarityTool.execute;
export default normalityFromMolarityTool;

export type NormalityFromMolarityInput = {
  readonly molarityMolL: number;
  readonly equivalentsPerMole: number;
};

export type NormalityFromMolarityOutput = {
  readonly normality: number;
};

export const normalityFromMolarityExample = {
  input: {
    molarityMolL: 1,
    equivalentsPerMole: 1,
  },
  output: {
    normality: 1,
  },
} satisfies ToolExample<
  NormalityFromMolarityInput,
  NormalityFromMolarityOutput
>;
