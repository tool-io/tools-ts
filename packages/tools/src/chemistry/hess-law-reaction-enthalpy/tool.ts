import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const hessLawReactionEnthalpyExample = {
  input: { sumProductsKJ: 125.75, sumReactantsKJ: 250.25 },
  output: { reactionEnthalpyKJ: -124.5 },
} satisfies ToolExample<
  {
    readonly sumProductsKJ: number;
    readonly sumReactantsKJ: number;
  },
  { readonly reactionEnthalpyKJ: number }
>;

export const hessLawReactionEnthalpyTool = createSimpleTool({
  id: "chemistry/hess-law-reaction-enthalpy",
  title: "Hess Law Enthalpy",
  description:
    "Compute the overall reaction enthalpy from Hess law as the summed product enthalpies minus the summed reactant enthalpies.",
  inputs: [
    {
      id: "sumProductsKJ",
      label: "Sum of products enthalpies",
      kind: "number",
      unit: "kJ",
    },
    {
      id: "sumReactantsKJ",
      label: "Sum of reactants enthalpies",
      kind: "number",
      unit: "kJ",
    },
  ],
  outputs: [
    {
      id: "reactionEnthalpyKJ",
      label: "Reaction enthalpy",
      kind: "number",
      unit: "kJ",
    },
  ],
  calculate: (input) => {
    const sumProductsKJ = input.sumProductsKJ as number;
    const sumReactantsKJ = input.sumReactantsKJ as number;
    return { reactionEnthalpyKJ: sumProductsKJ - sumReactantsKJ };
  },
});
export const runHessLawReactionEnthalpy = hessLawReactionEnthalpyTool.execute;
export default hessLawReactionEnthalpyTool;
