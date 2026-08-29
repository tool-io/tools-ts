import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolutionMassForMolarityInput = {
  readonly molarMass: number;
  readonly targetMolarity: number;
  readonly volumeLiters: number;
};

export type SolutionMassForMolarityOutput = {
  readonly soluteMassGrams: number;
};

export const solutionMassForMolarityExample = {
  input: { targetMolarity: 0.5, volumeLiters: 2, molarMass: 40 },
  output: { soluteMassGrams: 40 },
} satisfies ToolExample<
  SolutionMassForMolarityInput,
  SolutionMassForMolarityOutput
>;

export const solutionMassForMolarityTool = createSimpleTool({
  id: "chemistry/solution-mass-for-molarity",
  title: "Solute Mass For Molarity",
  description:
    "Compute the solute mass needed to reach a target molarity in a given volume.",
  inputs: [
    {
      description: "Desired molar concentration.",
      id: "targetMolarity",
      kind: "number",
      label: "Target molarity",
      unit: "mol/L",
    },
    {
      description: "Final solution volume.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      unit: "L",
    },
    {
      description: "Molar mass of the solute.",
      id: "molarMass",
      kind: "number",
      label: "Molar mass",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Required mass of solute.",
      id: "soluteMassGrams",
      kind: "number",
      label: "Solute mass",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const targetMolarity = input.targetMolarity as number;
    if (!(targetMolarity > 0))
      simpleError(
        "targetMolarity",
        "The target molarity must be greater than zero.",
      );
    const volumeLiters = input.volumeLiters as number;
    if (!(volumeLiters > 0))
      simpleError("volumeLiters", "The volume must be greater than zero.");
    const molarMass = input.molarMass as number;
    if (!(molarMass > 0))
      simpleError("molarMass", "The molar mass must be greater than zero.");
    return { soluteMassGrams: targetMolarity * volumeLiters * molarMass };
  },
});
export const runSolutionMassForMolarity = solutionMassForMolarityTool.execute;
export default solutionMassForMolarityTool;
