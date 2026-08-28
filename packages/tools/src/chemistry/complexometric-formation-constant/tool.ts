import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const complexometricFormationConstantExample = {
  input: {
    complexConcM: 0.01,
    ligandConcM: 0.05,
    ligandCountInt: 2,
    metalIonM: 0.02,
  },
} satisfies ToolExample<{
  readonly complexConcM: number;
  readonly ligandConcM: number;
  readonly ligandCountInt: number;
  readonly metalIonM: number;
}>;

export const complexometricFormationConstantTool = createSimpleTool({
  id: "chemistry/complexometric-formation-constant",
  title: "Formation Constant Beta",
  description:
    "Compute the overall formation constant beta for a metal complex from equilibrium concentrations.",
  inputs: [
    {
      id: "complexConcM",
      label: "Complex concentration",
      kind: "number",
      unit: "mol/L",
    },
    {
      id: "metalIonM",
      label: "Free metal ion concentration",
      kind: "number",
      unit: "mol/L",
    },
    {
      id: "ligandConcM",
      label: "Free ligand concentration",
      kind: "number",
      unit: "mol/L",
    },
    {
      id: "ligandCountInt",
      label: "Ligands per complex",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "formationConstantBeta",
      label: "Formation constant beta",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const complexConcM = input.complexConcM as number;
    const metalIonM = input.metalIonM as number;
    const ligandConcM = input.ligandConcM as number;
    const ligandCountInt = input.ligandCountInt as number;
    if (!(complexConcM > 0))
      simpleError("complexConcM", "Complex concentration must be positive.");
    if (!(metalIonM > 0))
      simpleError("metalIonM", "Metal ion concentration must be positive.");
    if (!(ligandConcM > 0))
      simpleError("ligandConcM", "Ligand concentration must be positive.");
    return {
      formationConstantBeta:
        complexConcM / (metalIonM * Math.pow(ligandConcM, ligandCountInt)),
    };
  },
});
export const runComplexometricFormationConstant =
  complexometricFormationConstantTool.execute;
export default complexometricFormationConstantTool;
