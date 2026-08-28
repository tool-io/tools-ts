import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const formalityTool = createSimpleTool({
  id: "chemistry/formality",
  title: "Formality Calculator",
  description:
    "Compute formality as formula units dissolved per liter of solution, used for ionic compounds.",
  inputs: [
    {
      description: "Mass of solute dissolved.",
      id: "massG",
      label: "Mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Formula weight of the compound; must be greater than zero.",
      id: "formulaWeightGMol",
      label: "Formula weight",
      kind: "number",
      unit: "g/mol",
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
      description: "Formality in formula units per liter.",
      id: "formality",
      label: "Formality",
      kind: "number",
      unit: "F",
    },
  ],
  calculate: (input) => {
    const volume = input.volumeLiters as number;
    const weight = input.formulaWeightGMol as number;
    if (volume <= 0 || weight <= 0)
      simpleError(
        "volumeLiters",
        "The volume and formula weight must be greater than zero.",
        "invalid_volume_or_weight",
      );
    return { formality: (input.massG as number) / weight / volume };
  },
});
export const runFormality = formalityTool.execute;
export default formalityTool;

export type FormalityInput = {
  readonly massG: number;
  readonly formulaWeightGMol: number;
  readonly volumeLiters: number;
};

export type FormalityOutput = {
  readonly formality: number;
};

export const formalityExample = {
  input: {
    massG: 1,
    formulaWeightGMol: 1,
    volumeLiters: 1,
  },
  output: {
    formality: 1,
  },
} satisfies ToolExample<FormalityInput, FormalityOutput>;
