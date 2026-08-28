import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PpbInput = {
  readonly massSoluteMicrograms: number;
  readonly massSolutionKg: number;
};

export type PpbOutput = {
  readonly partsPerBillion: number;
};

export const ppbExample = {
  input: { massSoluteMicrograms: 300, massSolutionKg: 1.5 },
  output: { partsPerBillion: 200 },
} satisfies ToolExample<PpbInput, PpbOutput>;

export const ppbTool = createSimpleTool({
  id: "chemistry/ppb",
  title: "PPB Calculator",
  description:
    "Compute concentration in parts per billion from micrograms of solute per kilogram of solution.",
  inputs: [
    {
      description: "Mass of the dissolved solute.",
      id: "massSoluteMicrograms",
      kind: "number",
      label: "Solute mass",
      unit: "\u00b5g",
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
      description: "Concentration in parts per billion by mass.",
      id: "partsPerBillion",
      kind: "number",
      label: "Parts per billion",
      unit: "ppb",
    },
  ],
  calculate: (input) => {
    const massSoluteMicrograms = input.massSoluteMicrograms as number;
    if (massSoluteMicrograms < 0)
      simpleError(
        "massSoluteMicrograms",
        "The solute mass cannot be negative.",
      );
    const massSolutionKg = input.massSolutionKg as number;
    if (!(massSolutionKg > 0))
      simpleError(
        "massSolutionKg",
        "The solution mass must be greater than zero.",
      );
    return { partsPerBillion: massSoluteMicrograms / massSolutionKg };
  },
});
export const runPpb = ppbTool.execute;
export default ppbTool;
