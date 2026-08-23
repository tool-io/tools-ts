import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateChromaticAberrationCorrection = (
  input: ChromaticAberrationCorrectionInput,
): ChromaticAberrationCorrectionOutput => {
  if (input.referenceRadiusPx <= 0)
    simpleError(
      "referenceRadiusPx",
      "The reference radius must be greater than zero.",
      "invalid_reference_radius",
    );
  return { scaleCorrection: input.separationPx / input.referenceRadiusPx };
};

export const chromaticAberrationCorrectionTool = createSimpleTool({
  id: "vr/chromatic-aberration-correction",
  title: "Chromatic Aberration Correction Calculator",
  description:
    "Compute the radial scale correction that removes measured color channel separation at a reference radius.",
  inputs: [
    {
      description:
        "Channel separation observed at the reference radius, in pixels.",
      id: "separationPx",
      label: "Separation",
      kind: "number",
    },
    {
      description:
        "Radius at which the separation was measured; must be nonzero.",
      id: "referenceRadiusPx",
      label: "Reference radius",
      kind: "number",
      minimum: 0,
      unit: "px",
    },
  ],
  outputs: [
    {
      description:
        "Fraction of the radial distance to shift each channel inward.",
      id: "scaleCorrection",
      label: "Scale correction",
      kind: "number",
    },
  ],
  calculate: (input) =>
    calculateChromaticAberrationCorrection(
      input as ChromaticAberrationCorrectionInput,
    ),
});
export const runChromaticAberrationCorrection =
  chromaticAberrationCorrectionTool.execute;
export default chromaticAberrationCorrectionTool;

export type ChromaticAberrationCorrectionInput = {
  readonly separationPx: number;
  readonly referenceRadiusPx: number;
};

export type ChromaticAberrationCorrectionOutput = {
  readonly scaleCorrection: number;
};

export const chromaticAberrationCorrectionExample = {
  input: { separationPx: 2, referenceRadiusPx: 500 },
  output: { scaleCorrection: 0.004 },
} satisfies ToolExample<
  ChromaticAberrationCorrectionInput,
  ChromaticAberrationCorrectionOutput
>;
