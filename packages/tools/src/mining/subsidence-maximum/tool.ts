import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly extractedSeamThicknessM: number;
  readonly extractionFraction: number;
  readonly calibratedSubsidenceFactor: number;
  readonly finitePanelCorrectionFraction: number;
}>;
export type Output = Readonly<{ readonly predictedMaximumSubsidenceM: number }>;
const inputFields = [
  {
    id: "extractedSeamThicknessM",
    label: "Extracted seam thickness m",
    kind: "number",
  },
  { id: "extractionFraction", label: "Extraction fraction", kind: "number" },
  {
    id: "calibratedSubsidenceFactor",
    label: "Calibrated subsidence factor",
    kind: "number",
  },
  {
    id: "finitePanelCorrectionFraction",
    label: "Finite panel correction fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.extractedSeamThicknessM, "extractedSeamThicknessM");
  fraction(input.extractionFraction, "extractionFraction");
  fraction(input.calibratedSubsidenceFactor, "calibratedSubsidenceFactor");
  fraction(
    input.finitePanelCorrectionFraction,
    "finitePanelCorrectionFraction",
  );
  return {
    predictedMaximumSubsidenceM:
      input.extractedSeamThicknessM *
      input.extractionFraction *
      input.calibratedSubsidenceFactor *
      input.finitePanelCorrectionFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  extractedSeamThicknessM: 2,
  extractionFraction: 0.8,
  calibratedSubsidenceFactor: 0.5,
  finitePanelCorrectionFraction: 0.75,
} satisfies Input;
export const exampleOutput = {
  predictedMaximumSubsidenceM: 0.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/subsidence-maximum",
  title: "Maximum Subsidence",
  description:
    "Apply calibrated extraction, subsidence and finite-panel factors to seam thickness; no empirical table or settlement guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedMaximumSubsidenceM",
      label: "Predicted maximum subsidence m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      extractedSeamThicknessM: value.extractedSeamThicknessM as number,
      extractionFraction: value.extractionFraction as number,
      calibratedSubsidenceFactor: value.calibratedSubsidenceFactor as number,
      finitePanelCorrectionFraction:
        value.finitePanelCorrectionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
