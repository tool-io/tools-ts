import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const solutionEnthalpyMixingExample = {
  input: {
    enthalpyAKJPerMol: -100,
    enthalpyBKJPerMol: 50,
    mixtureEnthalpyKJPerMol: -20,
    moleFractionA: 0.5,
  },
  output: { mixingEnthalpyKJPerMol: 5 },
} satisfies ToolExample<
  {
    readonly enthalpyAKJPerMol: number;
    readonly enthalpyBKJPerMol: number;
    readonly mixtureEnthalpyKJPerMol: number;
    readonly moleFractionA: number;
  },
  { readonly mixingEnthalpyKJPerMol: number }
>;

export const solutionEnthalpyMixingTool = createSimpleTool({
  id: "chemistry/solution-enthalpy-mixing",
  title: "Mixing Enthalpy",
  description:
    "Compute ΔH_mix as the measured mixture molar enthalpy minus the mole-fraction-weighted pure-component enthalpies; an ideal solution gives zero.",
  inputs: [
    {
      id: "moleFractionA",
      label: "Mole fraction A",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "enthalpyAKJPerMol",
      label: "Component A enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "enthalpyBKJPerMol",
      label: "Component B enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "mixtureEnthalpyKJPerMol",
      label: "Mixture enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "mixingEnthalpyKJPerMol",
      label: "Mixing enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const moleFractionA = input.moleFractionA as number;
    const enthalpyAKJPerMol = input.enthalpyAKJPerMol as number;
    const enthalpyBKJPerMol = input.enthalpyBKJPerMol as number;
    const idealReference =
      moleFractionA * enthalpyAKJPerMol +
      (1 - moleFractionA) * enthalpyBKJPerMol;
    return {
      mixingEnthalpyKJPerMol:
        (input.mixtureEnthalpyKJPerMol as number) - idealReference,
    };
  },
});
export const runSolutionEnthalpyMixing = solutionEnthalpyMixingTool.execute;
export default solutionEnthalpyMixingTool;
