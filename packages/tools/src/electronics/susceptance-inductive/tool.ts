import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const inductiveSusceptanceExample = {
  input: { frequencyHz: 50, inductanceH: 0.1 },
} satisfies ToolExample<{
  readonly frequencyHz: number;
  readonly inductanceH: number;
}>;

export const inductiveSusceptanceTool = createSimpleTool({
  id: "electronics/susceptance-inductive",
  title: "Inductive Susceptance",
  description:
    "Calculate the negative inductive susceptance of an inductor at a given frequency.",
  inputs: [
    { id: "frequencyHz", label: "Frequency", kind: "number", unit: "Hz" },
    { id: "inductanceH", label: "Inductance", kind: "number", unit: "H" },
  ],
  outputs: [
    {
      id: "susceptanceSiemens",
      label: "Inductive susceptance",
      kind: "number",
      unit: "S",
    },
  ],
  calculate: (input) => {
    const frequencyHz = input.frequencyHz as number;
    const inductanceH = input.inductanceH as number;
    if (frequencyHz <= 0)
      simpleError("frequencyHz", "Frequency must be positive.");
    if (inductanceH <= 0)
      simpleError("inductanceH", "Inductance must be positive.");
    return {
      susceptanceSiemens: -1 / (2 * Math.PI * frequencyHz * inductanceH),
    };
  },
});
export const runInductiveSusceptance = inductiveSusceptanceTool.execute;
export default inductiveSusceptanceTool;
