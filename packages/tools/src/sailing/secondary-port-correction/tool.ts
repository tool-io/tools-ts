import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SecondaryPortCorrectionInput = {
  readonly rangeDifferenceMeters: number;
  readonly interpolationProportion: number;
};

export type SecondaryPortCorrectionOutput = {
  readonly correctionMeters: number;
};

export const secondaryPortCorrectionExample = {
  input: { interpolationProportion: 0.25, rangeDifferenceMeters: -0.4 },
  output: { correctionMeters: -0.1 },
} satisfies ToolExample<
  SecondaryPortCorrectionInput,
  SecondaryPortCorrectionOutput
>;

export const calculateSecondaryPortCorrection = (
  input: SecondaryPortCorrectionInput,
): SecondaryPortCorrectionOutput => ({
  correctionMeters: input.rangeDifferenceMeters * input.interpolationProportion,
});

export const secondaryPortCorrectionTool = createSimpleTool({
  id: "sailing/secondary-port-correction",
  title: "Secondary Port Correction",
  description:
    "Compute the secondary port height correction from the signed difference in tidal range and an interpolation proportion taken from almanac tables.",
  inputs: [
    {
      description: "Signed difference in tidal range between ports.",
      id: "rangeDifferenceMeters",
      kind: "number",
      label: "Range difference",
      unit: "m",
    },
    {
      description: "Proportion interpolated from the correction table.",
      id: "interpolationProportion",
      kind: "number",
      label: "Interpolation proportion",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Signed height correction for the secondary port.",
      format: "length-m",
      id: "correctionMeters",
      kind: "number",
      label: "Correction",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateSecondaryPortCorrection(
      input as unknown as SecondaryPortCorrectionInput,
    ),
});

export const runSecondaryPortCorrection = secondaryPortCorrectionTool.execute;
export default secondaryPortCorrectionTool;
