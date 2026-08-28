import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const excessEnthalpyExample = {
  input: { actualMixKJPerMol: 45.5, idealMixKJPerMol: 40 },
  output: { excessEnthalpyKJPerMol: 5.5 },
} satisfies ToolExample<
  {
    readonly actualMixKJPerMol: number;
    readonly idealMixKJPerMol: number;
  },
  { readonly excessEnthalpyKJPerMol: number }
>;

export const excessEnthalpyTool = createSimpleTool({
  id: "chemistry/excess-enthalpy",
  title: "Excess Enthalpy",
  description:
    "Compute the excess enthalpy of a mixture as the actual mixing enthalpy minus the ideal mixing enthalpy.",
  inputs: [
    {
      id: "actualMixKJPerMol",
      label: "Actual mix enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      id: "idealMixKJPerMol",
      label: "Ideal mix enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "excessEnthalpyKJPerMol",
      label: "Excess enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    return {
      excessEnthalpyKJPerMol:
        (input.actualMixKJPerMol as number) -
        (input.idealMixKJPerMol as number),
    };
  },
});
export const runExcessEnthalpy = excessEnthalpyTool.execute;
export default excessEnthalpyTool;
