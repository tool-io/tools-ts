import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const vaporPressureSolutionTool = createSimpleTool({
  id: "chemistry/vapor-pressure-solution",
  title: "Vapor Pressure of Solution Calculator",
  description:
    "Apply Raoult's law to compute solvent vapor pressure above a solution from its mole fraction.",
  inputs: [
    {
      description: "Vapor pressure of the pure solvent.",
      id: "pureSolventPressure",
      label: "Pure solvent pressure",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Mole fraction of the solvent after adding solute.",
      id: "solventMoleFraction",
      label: "Solvent mole fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Vapor pressure of solvent over the solution.",
      id: "solutionPressure",
      label: "Solution pressure",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const fraction = input.solventMoleFraction as number;
    if (fraction < 0)
      simpleError(
        "solventMoleFraction",
        "The mole fraction cannot be negative.",
        "invalid_mole_fraction",
      );
    return {
      solutionPressure: (input.pureSolventPressure as number) * fraction,
    };
  },
});
export const runVaporPressureSolution = vaporPressureSolutionTool.execute;
export default vaporPressureSolutionTool;

export type VaporPressureSolutionInput = {
  readonly pureSolventPressure: number;
  readonly solventMoleFraction: number;
};

export type VaporPressureSolutionOutput = {
  readonly solutionPressure: number;
};

export const vaporPressureSolutionExample = {
  input: {
    pureSolventPressure: 1,
    solventMoleFraction: 1,
  },
  output: {
    solutionPressure: 1,
  },
} satisfies ToolExample<
  VaporPressureSolutionInput,
  VaporPressureSolutionOutput
>;
