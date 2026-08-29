import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const troutonRuleTool = createSimpleTool({
  id: "chemistry/trouton-rule",
  title: "Trouton Rule Calculator",
  description:
    "Estimate enthalpy of vaporization via Trouton rule dHvap = 85*Tb J/mol.",
  inputs: [
    {
      id: "boilingPointK",
      label: "Boiling point",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    { id: "deltaHVapJPerMol", label: "dH vap", kind: "number", unit: "J/mol" },
  ],
  calculate: (input) => {
    const boilingPoint = input.boilingPointK as number;
    if (!(boilingPoint > 0))
      simpleError(
        "boilingPointK",
        "Boiling point must be greater than zero kelvin.",
      );
    return { deltaHVapJPerMol: 85 * boilingPoint };
  },
});
export default troutonRuleTool;
export const runTroutonRule = troutonRuleTool.execute;

export type TroutonRuleInput = {
  readonly boilingPointK: number;
};

export type TroutonRuleOutput = {
  readonly deltaHVapJPerMol: number;
};

export const troutonRuleExample = {
  input: {
    boilingPointK: 1,
  },
  output: {
    deltaHVapJPerMol: 85,
  },
} satisfies ToolExample<TroutonRuleInput, TroutonRuleOutput>;
