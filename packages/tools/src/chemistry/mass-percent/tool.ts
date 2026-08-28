import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MassPercentInput = {
  readonly massComponentG: number;
  readonly massSolutionG: number;
};

export type MassPercentOutput = {
  readonly massPercent: number;
};

export const massPercentExample = {
  input: { massComponentG: 5, massSolutionG: 40 },
  output: { massPercent: 12.5 },
} satisfies ToolExample<MassPercentInput, MassPercentOutput>;

export const massPercentTool = createSimpleTool({
  id: "chemistry/mass-percent",
  title: "Mass Percent Calculator",
  description:
    "Compute the mass percent of a component within a total solution mass.",
  inputs: [
    {
      description: "Mass of the component of interest.",
      id: "massComponentG",
      kind: "number",
      label: "Component mass",
      unit: "g",
    },
    {
      description: "Total mass of the solution.",
      id: "massSolutionG",
      kind: "number",
      label: "Solution mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Mass percent of the component.",
      format: "percent",
      id: "massPercent",
      kind: "number",
      label: "Mass percent",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const massComponentG = input.massComponentG as number;
    if (massComponentG < 0)
      simpleError(
        "massComponentG",
        "The component mass cannot be negative.",
        "invalid_masses",
      );
    const massSolutionG = input.massSolutionG as number;
    if (!(massSolutionG > 0))
      simpleError(
        "massSolutionG",
        "The solution mass must be greater than zero.",
        "invalid_masses",
      );
    if (massComponentG > massSolutionG)
      simpleError(
        "massComponentG",
        "The component mass must not exceed the solution mass.",
        "invalid_masses",
      );
    return { massPercent: (massComponentG / massSolutionG) * 100 };
  },
});
export const runMassPercent = massPercentTool.execute;
export default massPercentTool;
