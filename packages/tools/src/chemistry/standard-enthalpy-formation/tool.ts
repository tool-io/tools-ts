import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const standardEnthalpyFormationExample = {
  input: { formationEnthalpyKJPerMol: -285.83, moles: 2 },
  output: { totalEnthalpyKJ: -571.66 },
} satisfies ToolExample<
  {
    readonly formationEnthalpyKJPerMol: number;
    readonly moles: number;
  },
  { readonly totalEnthalpyKJ: number }
>;

export const standardEnthalpyFormationTool = createSimpleTool({
  id: "chemistry/standard-enthalpy-formation",
  title: "Formation Enthalpy Sum",
  description:
    "Scale a standard molar enthalpy of formation to a total enthalpy for a given amount in moles.",
  inputs: [
    { id: "moles", label: "Amount", kind: "number", unit: "mol" },
    {
      id: "formationEnthalpyKJPerMol",
      label: "Standard formation enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "totalEnthalpyKJ",
      label: "Total enthalpy",
      kind: "number",
      unit: "kJ",
    },
  ],
  calculate: (input) => {
    const moles = input.moles as number;
    const formationEnthalpyKJPerMol = input.formationEnthalpyKJPerMol as number;
    if (!(moles > 0)) simpleError("moles", "Moles must be positive.");
    return { totalEnthalpyKJ: moles * formationEnthalpyKJPerMol };
  },
});
export const runStandardEnthalpyFormation =
  standardEnthalpyFormationTool.execute;
export default standardEnthalpyFormationTool;
