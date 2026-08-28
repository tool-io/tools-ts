import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const equivalentWeightTool = createSimpleTool({
  id: "chemistry/equivalent-weight",
  title: "Equivalent Weight Calculator",
  description:
    "Compute the equivalent weight as molar mass divided by valence.",
  inputs: [
    {
      description: "Molar mass of the substance; must be greater than zero.",
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      description:
        "Valence (protons, hydroxides, or electrons transferred); must be nonzero.",
      id: "valence",
      label: "Valence",
      kind: "integer",
    },
  ],
  outputs: [
    {
      description: "Equivalent weight in grams per equivalent.",
      id: "equivalentWeightGMol",
      label: "Equivalent weight",
      kind: "number",
      unit: "g/eq",
    },
  ],
  calculate: (input) => {
    const valence = input.valence as number;
    if (!(valence > 0))
      simpleError(
        "valence",
        "The equivalence factor must be greater than zero.",
        "invalid_valence",
      );
    return { equivalentWeightGMol: (input.molarMassGMol as number) / valence };
  },
});
export const runEquivalentWeight = equivalentWeightTool.execute;
export default equivalentWeightTool;

export type EquivalentWeightInput = {
  readonly molarMassGMol: number;
  readonly valence: number;
};

export type EquivalentWeightOutput = {
  readonly equivalentWeightGMol: number;
};

export const equivalentWeightExample = {
  input: {
    molarMassGMol: 1,
    valence: 1,
  },
  output: {
    equivalentWeightGMol: 1,
  },
} satisfies ToolExample<EquivalentWeightInput, EquivalentWeightOutput>;
