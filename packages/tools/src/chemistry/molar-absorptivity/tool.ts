import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolarAbsorptivityInput = {
  readonly absorbance: number;
  readonly concentrationM: number;
  readonly pathLengthCm: number;
};

export type MolarAbsorptivityOutput = {
  readonly molarAbsorptivity: number;
};

export const molarAbsorptivityExample = {
  input: { absorbance: 0.75, concentrationM: 0.5, pathLengthCm: 3 },
  output: { molarAbsorptivity: 0.5 },
} satisfies ToolExample<MolarAbsorptivityInput, MolarAbsorptivityOutput>;

export const molarAbsorptivityTool = createSimpleTool({
  id: "chemistry/molar-absorptivity",
  title: "Molar Absorptivity Calculator",
  description:
    "Compute molar absorptivity from measured absorbance, concentration, and path length.",
  inputs: [
    { id: "absorbance", label: "Absorbance", kind: "number" },
    { id: "concentrationM", label: "Concentration", kind: "number", unit: "M" },
    { id: "pathLengthCm", label: "Path length", kind: "number", unit: "cm" },
  ],
  outputs: [
    {
      id: "molarAbsorptivity",
      label: "Molar absorptivity",
      kind: "number",
      unit: "L/(mol·cm)",
    },
  ],
  calculate: (input) => {
    const absorbance = input.absorbance as number;
    const concentrationM = input.concentrationM as number;
    const pathLengthCm = input.pathLengthCm as number;
    if (absorbance <= 0)
      simpleError("absorbance", "Absorbance must be positive.");
    if (concentrationM <= 0)
      simpleError("concentrationM", "Concentration must be positive.");
    if (pathLengthCm <= 0)
      simpleError("pathLengthCm", "Path length must be positive.");
    return { molarAbsorptivity: absorbance / (concentrationM * pathLengthCm) };
  },
});
export const runMolarAbsorptivity = molarAbsorptivityTool.execute;
export default molarAbsorptivityTool;
