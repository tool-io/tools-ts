import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const phIonicStrengthCorrectedTool = createSimpleTool({
  id: "chemistry/ph-ionic-strength-corrected",
  title: "pH Ionic Strength Corrected Calculator",
  description:
    "Correct measured pH by adding an ionic strength adjustment term.",
  inputs: [
    { id: "measuredPh", label: "Measured pH", kind: "number" },
    { id: "correctionTerm", label: "Correction term", kind: "number" },
  ],
  outputs: [{ id: "correctedPh", label: "Corrected pH", kind: "number" }],
  calculate: (input) => {
    return {
      correctedPh:
        (input.measuredPh as number) + (input.correctionTerm as number),
    };
  },
});
export const runPhIonicStrengthCorrected = phIonicStrengthCorrectedTool.execute;
export default phIonicStrengthCorrectedTool;

export type PhIonicStrengthCorrectedInput = {
  readonly measuredPh: number;
  readonly correctionTerm: number;
};

export type PhIonicStrengthCorrectedOutput = {
  readonly correctedPh: number;
};

export const phIonicStrengthCorrectedExample = {
  input: {
    measuredPh: 1,
    correctionTerm: 1,
  },
  output: {
    correctedPh: 2,
  },
} satisfies ToolExample<
  PhIonicStrengthCorrectedInput,
  PhIonicStrengthCorrectedOutput
>;
