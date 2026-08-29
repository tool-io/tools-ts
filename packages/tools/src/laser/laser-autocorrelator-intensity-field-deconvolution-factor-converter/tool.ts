import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AutocorrShape = "gaussian" | "sech-squared";

export type AutocorrInput = {
  readonly autocorrWidthFs: number;
  readonly pulseShape?: AutocorrShape;
};

export type AutocorrOutput = {
  readonly pulseWidthFs: number;
  readonly deconvolutionFactor: number;
};

const DECONVOLUTION_FACTORS: Record<AutocorrShape, number> = {
  gaussian: Math.SQRT2,
  "sech-squared": 1.543,
};

/**
 * Intensity-autocorrelation deconvolution: τ_pulse = τ_AC / D with
 * D = √2 for Gaussian and 1.543 for sech² envelopes.
 */
export const autocorrToPulse = (input: AutocorrInput): AutocorrOutput => {
  const { autocorrWidthFs } = input;
  const pulseShape = input.pulseShape ?? "gaussian";
  if (!Number.isFinite(autocorrWidthFs) || autocorrWidthFs <= 0)
    simpleError("autocorrWidthFs", "Autocorrelation width must be positive.");
  if (pulseShape !== "gaussian" && pulseShape !== "sech-squared")
    simpleError("pulseShape", "Pulse shape must be gaussian or sech-squared.");
  const deconvolutionFactor = DECONVOLUTION_FACTORS[pulseShape];
  const pulseWidthFs = autocorrWidthFs / deconvolutionFactor;
  if (!Number.isFinite(pulseWidthFs))
    simpleError("autocorrWidthFs", "Pulse width overflowed.");
  return { pulseWidthFs, deconvolutionFactor };
};

export const autocorrExample = {
  input: { autocorrWidthFs: 141.4213562373095, pulseShape: "gaussian" },
  output: { pulseWidthFs: 100, deconvolutionFactor: 1.4142135623730951 },
} satisfies ToolExample<AutocorrInput, AutocorrOutput>;

export const autocorrTool = createSimpleTool({
  calculate: (input) =>
    autocorrToPulse({
      autocorrWidthFs: input.autocorrWidthFs as number,
      pulseShape: (input.pulseShape as AutocorrShape | undefined) ?? undefined,
    }),
  description:
    "Convert intensity-autocorrelator width to pulse duration with the Gaussian or sech² deconvolution factor.",
  id: "laser/laser-autocorrelator-intensity-field-deconvolution-factor-converter",
  inputs: [
    {
      description: "Measured intensity autocorrelation FWHM.",
      id: "autocorrWidthFs",
      kind: "number",
      label: "Autocorr width",
      minimum: Number.MIN_VALUE,
      unit: "fs",
    },
    {
      default: "gaussian",
      description: "Assumed pulse envelope shape.",
      enum: ["gaussian", "sech-squared"],
      id: "pulseShape",
      kind: "string",
      label: "Pulse shape",
    },
  ],
  outputs: [
    {
      description: "Deconvolved pulse FWHM.",
      id: "pulseWidthFs",
      kind: "number",
      label: "Pulse width",
      unit: "fs",
    },
    {
      description: "Deconvolution factor applied.",
      id: "deconvolutionFactor",
      kind: "number",
      label: "Factor",
    },
  ],
  title: "Autocorrelator Deconvolution",
});
export const runAutocorr = autocorrTool.execute;
export default autocorrTool;

export { autocorrExample as example };
