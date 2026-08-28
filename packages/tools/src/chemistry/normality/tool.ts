import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const normalityTool = createSimpleTool({
  id: "chemistry/normality",
  title: "Normality Calculator",
  description:
    "Compute solution normality as equivalents per liter from moles, equivalents per mole, and volume.",
  inputs: [
    {
      description: "Moles of solute.",
      id: "moles",
      label: "Moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description:
        "Equivalents contributed per mole (e.g., protons or hydroxides).",
      id: "equivalentsPerMole",
      label: "Equivalents per mole",
      kind: "number",
    },
    {
      description: "Solution volume; must be greater than zero.",
      id: "volumeLiters",
      label: "Volume",
      kind: "number",
      minimum: 0,
      unit: "L",
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
    const volume = input.volumeLiters as number;
    if (volume <= 0)
      simpleError(
        "volumeLiters",
        "The volume must be greater than zero liters.",
        "invalid_volume",
      );
    return {
      normality:
        ((input.moles as number) * (input.equivalentsPerMole as number)) /
        volume,
    };
  },
});
export const runNormality = normalityTool.execute;
export default normalityTool;

export type NormalityInput = {
  readonly moles: number;
  readonly equivalentsPerMole: number;
  readonly volumeLiters: number;
};

export type NormalityOutput = {
  readonly normality: number;
};

export const normalityExample = {
  input: {
    moles: 1,
    equivalentsPerMole: 1,
    volumeLiters: 1,
  },
  output: {
    normality: 1,
  },
} satisfies ToolExample<NormalityInput, NormalityOutput>;
