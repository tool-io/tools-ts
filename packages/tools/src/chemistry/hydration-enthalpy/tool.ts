import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hydrationEnthalpyExample = {
  input: { ionHydrationKJPerMol: -365, moles: 2 },
  output: { hydrationEnthalpyKJ: -730 },
} satisfies ToolExample<
  {
    readonly ionHydrationKJPerMol: number;
    readonly moles: number;
  },
  { readonly hydrationEnthalpyKJ: number }
>;

export const hydrationEnthalpyTool = createSimpleTool({
  id: "chemistry/hydration-enthalpy",
  title: "Hydration Enthalpy Sum",
  description:
    "Scale a molar ion hydration enthalpy to a total enthalpy for a given amount in moles.",
  inputs: [
    { id: "moles", label: "Amount", kind: "number", unit: "mol" },
    {
      id: "ionHydrationKJPerMol",
      label: "Ion hydration enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "hydrationEnthalpyKJ",
      label: "Hydration enthalpy",
      kind: "number",
      unit: "kJ",
    },
  ],
  calculate: (input) => {
    const moles = input.moles as number;
    const ionHydrationKJPerMol = input.ionHydrationKJPerMol as number;
    if (!(moles > 0)) simpleError("moles", "Moles must be positive.");
    return { hydrationEnthalpyKJ: ionHydrationKJPerMol * moles };
  },
});
export const runHydrationEnthalpy = hydrationEnthalpyTool.execute;
export default hydrationEnthalpyTool;
