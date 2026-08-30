import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly knownConcentrationUmol: number;
  readonly measuredSignalToNoise: number;
  readonly requiredDetectionSnr: number;
}>;
export type Output = Readonly<{
  readonly detectionLimitUmol: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.knownConcentrationUmol <= 0 ||
    input.measuredSignalToNoise <= 0 ||
    input.requiredDetectionSnr <= 0
  )
    simpleError(
      "measuredSignalToNoise",
      "Positive concentration and signal-to-noise ratios required.",
    );
  return {
    detectionLimitUmol:
      (input.knownConcentrationUmol * input.requiredDetectionSnr) /
      input.measuredSignalToNoise,
  };
};
export const exampleInput = {
  knownConcentrationUmol: 10,
  measuredSignalToNoise: 20,
  requiredDetectionSnr: 3,
} satisfies Input;
export const exampleOutput = { detectionLimitUmol: 1.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/detection-limit",
  title: "Detection Limit",
  description:
    "Estimate LOD from a measured standard concentration and target signal-to-noise ratio.",
  inputs: [
    {
      id: "knownConcentrationUmol",
      kind: "number",
      label: "Known concentration umol",
    },
    {
      id: "measuredSignalToNoise",
      kind: "number",
      label: "Measured signal to noise",
    },
    {
      id: "requiredDetectionSnr",
      kind: "number",
      label: "Required detection snr",
    },
  ],
  outputs: [
    { id: "detectionLimitUmol", kind: "number", label: "Detection limit umol" },
  ],
  calculate: (value) =>
    calculate({
      knownConcentrationUmol: value.knownConcentrationUmol as number,
      measuredSignalToNoise: value.measuredSignalToNoise as number,
      requiredDetectionSnr: value.requiredDetectionSnr as number,
    }),
});
export const run = tool.execute;
export default tool;
