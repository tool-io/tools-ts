import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HeatOfVaporizationTroutonInput = {
  readonly boilingPointK: number;
};

export type HeatOfVaporizationTroutonOutput = {
  readonly enthalpyOfVaporizationKJPerMol: number;
};

export const heatOfVaporizationTroutonExample = {
  input: { boilingPointK: 373.15 },
  output: { enthalpyOfVaporizationKJPerMol: 31.71775 },
} satisfies ToolExample<
  HeatOfVaporizationTroutonInput,
  HeatOfVaporizationTroutonOutput
>;

export const heatOfVaporizationTroutonTool = createSimpleTool({
  id: "chemistry/heat-of-vaporization-trouton",
  title: "Trouton Rule Estimate",
  description:
    "Estimate the enthalpy of vaporization from the boiling point using Trouton's rule with a 85 J/(mol·K) entropy of vaporization.",
  inputs: [
    {
      id: "boilingPointK",
      label: "Boiling point",
      kind: "number",
      maximum: 600,
      minimum: 50,
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "enthalpyOfVaporizationKJPerMol",
      label: "Enthalpy of vaporization",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => ({
    enthalpyOfVaporizationKJPerMol: (input.boilingPointK as number) * 0.085,
  }),
});
export const runHeatOfVaporizationTrouton =
  heatOfVaporizationTroutonTool.execute;
export default heatOfVaporizationTroutonTool;
