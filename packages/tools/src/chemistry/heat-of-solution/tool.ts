import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const heatOfSolutionTool = createSimpleTool({
  id: "chemistry/heat-of-solution",
  title: "Heat of Solution Calculator",
  description:
    "Compute solution enthalpy as lattice dissociation enthalpy plus hydration enthalpy, using positive energy to separate the lattice and signed hydration enthalpy.",
  inputs: [
    {
      id: "latticeDissociationEnthalpyKJPerMol",
      label: "Lattice dissociation enthalpy",
      kind: "number",
      minimum: 0,
      unit: "kJ/mol",
    },
    {
      id: "hydrationEnthalpyKJPerMol",
      label: "dH hydration",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "heatOfSolutionKJPerMol",
      label: "dH solution",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    return {
      heatOfSolutionKJPerMol:
        (input.latticeDissociationEnthalpyKJPerMol as number) +
        (input.hydrationEnthalpyKJPerMol as number),
    };
  },
});
export default heatOfSolutionTool;
export const runHeatOfSolution = heatOfSolutionTool.execute;

export type HeatOfSolutionInput = {
  readonly latticeDissociationEnthalpyKJPerMol: number;
  readonly hydrationEnthalpyKJPerMol: number;
};

export type HeatOfSolutionOutput = {
  readonly heatOfSolutionKJPerMol: number;
};

export const heatOfSolutionExample = {
  input: {
    latticeDissociationEnthalpyKJPerMol: 780,
    hydrationEnthalpyKJPerMol: -776,
  },
  output: {
    heatOfSolutionKJPerMol: 4,
  },
} satisfies ToolExample<HeatOfSolutionInput, HeatOfSolutionOutput>;
