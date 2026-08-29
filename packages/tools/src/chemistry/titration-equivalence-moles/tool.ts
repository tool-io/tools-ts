import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const titrationEquivalenceMolesTool = createSimpleTool({
  id: "chemistry/titration-equivalence-moles",
  title: "Titration Equivalence Moles Calculator",
  description:
    "Compute the titrant moles required at the equivalence point from the analyte moles and proton/hydroxide stoichiometry.",
  inputs: [
    {
      description: "Moles of the analyte (acid) present.",
      id: "analyteMoles",
      label: "Analyte moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Protons donated per acid molecule; must be at least one.",
      id: "acidProtons",
      label: "Acid protons",
      kind: "integer",
      minimum: 1,
    },
    {
      description:
        "Hydroxides accepted per base molecule; must be at least one.",
      id: "baseHydroxides",
      label: "Base hydroxides",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Titrant moles needed for complete neutralization.",
      id: "titrantMoles",
      label: "Titrant moles",
      kind: "number",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    const baseHydroxides = input.baseHydroxides as number;
    if (baseHydroxides === 0)
      simpleError(
        "baseHydroxides",
        "The hydroxide count must be nonzero.",
        "invalid_base_hydroxides",
      );
    return {
      titrantMoles:
        ((input.analyteMoles as number) * (input.acidProtons as number)) /
        baseHydroxides,
    };
  },
});
export const runTitrationEquivalenceMoles =
  titrationEquivalenceMolesTool.execute;
export default titrationEquivalenceMolesTool;

export type TitrationEquivalenceMolesInput = {
  readonly analyteMoles: number;
  readonly acidProtons: number;
  readonly baseHydroxides: number;
};

export type TitrationEquivalenceMolesOutput = {
  readonly titrantMoles: number;
};

export const titrationEquivalenceMolesExample = {
  input: {
    analyteMoles: 1,
    acidProtons: 1,
    baseHydroxides: 1,
  },
  output: {
    titrantMoles: 1,
  },
} satisfies ToolExample<
  TitrationEquivalenceMolesInput,
  TitrationEquivalenceMolesOutput
>;
