import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PpmInput = {
  readonly massSoluteMg: number;
  readonly massSolutionKg: number;
};

export type PpmOutput = {
  readonly partsPerMillion: number;
};

export const ppmExample = {
  input: { massSoluteMg: 250, massSolutionKg: 0.5 },
  output: { partsPerMillion: 500 },
} satisfies ToolExample<PpmInput, PpmOutput>;

export const ppmTool = createSimpleTool({
  id: "chemistry/ppm",
  title: "PPM Calculator",
  description:
    "Compute concentration in parts per million from milligrams of solute per kilogram of solution.",
  inputs: [
    {
      description: "Mass of the dissolved solute.",
      id: "massSoluteMg",
      kind: "number",
      label: "Solute mass",
      unit: "mg",
    },
    {
      description: "Total mass of the solution.",
      id: "massSolutionKg",
      kind: "number",
      label: "Solution mass",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Concentration in parts per million by mass.",
      id: "partsPerMillion",
      kind: "number",
      label: "Parts per million",
      unit: "ppm",
    },
  ],
  calculate: (input) => {
    const massSoluteMg = input.massSoluteMg as number;
    if (massSoluteMg < 0)
      simpleError("massSoluteMg", "The solute mass cannot be negative.");
    const massSolutionKg = input.massSolutionKg as number;
    if (!(massSolutionKg > 0))
      simpleError(
        "massSolutionKg",
        "The solution mass must be greater than zero.",
      );
    return { partsPerMillion: massSoluteMg / massSolutionKg };
  },
});
export const runPpm = ppmTool.execute;
export default ppmTool;
