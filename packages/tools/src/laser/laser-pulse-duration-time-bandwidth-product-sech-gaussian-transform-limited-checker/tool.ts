import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PulseShape = "gaussian" | "sech-squared";

export type TimeBandwidthInput = {
  readonly pulseDurationFs: number;
  readonly spectralWidthNm: number;
  readonly centerWavelengthNm: number;
  readonly pulseShape?: PulseShape;
  readonly relativeTolerance?: number;
};

export type TimeBandwidthOutput = {
  readonly timeBandwidthProduct: number;
  readonly transformLimit: number;
  readonly consistentWithTransformLimit: boolean;
  readonly ratioToTransformLimit: number;
};

export const SPEED_OF_LIGHT_M_PER_S = 299792458;

const TRANSFORM_LIMITS: Record<PulseShape, number> = {
  gaussian: 0.441,
  "sech-squared": 0.315,
};

/**
 * Time–bandwidth product Δν·Δτ with Δν = c·Δλ/λ², tested against the
 * 0.441 (Gaussian) or 0.315 (sech²) transform limit.
 */
export const timeBandwidthCheck = (
  input: TimeBandwidthInput,
): TimeBandwidthOutput => {
  const { pulseDurationFs, spectralWidthNm, centerWavelengthNm } = input;
  const pulseShape = input.pulseShape ?? "gaussian";
  const relativeTolerance = input.relativeTolerance ?? 0.01;
  if (!Number.isFinite(pulseDurationFs) || pulseDurationFs <= 0)
    simpleError("pulseDurationFs", "Pulse duration must be positive.");
  if (!Number.isFinite(spectralWidthNm) || spectralWidthNm <= 0)
    simpleError("spectralWidthNm", "Spectral width must be positive.");
  if (!Number.isFinite(centerWavelengthNm) || centerWavelengthNm <= 0)
    simpleError("centerWavelengthNm", "Center wavelength must be positive.");
  if (pulseShape !== "gaussian" && pulseShape !== "sech-squared")
    simpleError("pulseShape", "Pulse shape must be gaussian or sech-squared.");
  if (
    !Number.isFinite(relativeTolerance) ||
    relativeTolerance < 0 ||
    relativeTolerance > 1
  )
    simpleError(
      "relativeTolerance",
      "Relative tolerance must be between 0 and 1.",
    );
  const timeBandwidthProduct =
    (SPEED_OF_LIGHT_M_PER_S * spectralWidthNm * pulseDurationFs * 1e-6) /
    (centerWavelengthNm * centerWavelengthNm);
  if (!Number.isFinite(timeBandwidthProduct))
    simpleError("spectralWidthNm", "Time–bandwidth product overflowed.");
  const transformLimit = TRANSFORM_LIMITS[pulseShape];
  const ratioToTransformLimit = timeBandwidthProduct / transformLimit;
  return {
    timeBandwidthProduct,
    transformLimit,
    consistentWithTransformLimit:
      Math.abs(ratioToTransformLimit - 1) <= relativeTolerance,
    ratioToTransformLimit,
  };
};

export const timeBandwidthExample = {
  input: {
    pulseDurationFs: 100,
    spectralWidthNm: 9.408,
    centerWavelengthNm: 800,
    pulseShape: "gaussian",
  },
  output: {
    timeBandwidthProduct: 0.4406949132599999,
    transformLimit: 0.441,
    consistentWithTransformLimit: true,
    ratioToTransformLimit: 0.9993081933333331,
  },
} satisfies ToolExample<TimeBandwidthInput, TimeBandwidthOutput>;

export const timeBandwidthTool = createSimpleTool({
  calculate: (input) =>
    timeBandwidthCheck({
      centerWavelengthNm: input.centerWavelengthNm as number,
      pulseDurationFs: input.pulseDurationFs as number,
      pulseShape: (input.pulseShape as PulseShape | undefined) ?? undefined,
      relativeTolerance:
        (input.relativeTolerance as number | undefined) ?? undefined,
      spectralWidthNm: input.spectralWidthNm as number,
    }),
  description:
    "Compare an ultrafast pulse with the Gaussian or sech² transform limit using the narrow-band conversion Δν ≈ cΔλ/λ² and an explicit tolerance.",
  id: "laser/laser-pulse-duration-time-bandwidth-product-sech-gaussian-transform-limited-checker",
  inputs: [
    {
      description: "Intensity FWHM pulse duration.",
      id: "pulseDurationFs",
      kind: "number",
      label: "Pulse duration",
      minimum: Number.MIN_VALUE,
      unit: "fs",
    },
    {
      description: "Intensity FWHM spectral width.",
      id: "spectralWidthNm",
      kind: "number",
      label: "Spectral width",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Center wavelength of the spectrum.",
      id: "centerWavelengthNm",
      kind: "number",
      label: "Center wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      default: "gaussian",
      description: "Assumed pulse envelope shape.",
      enum: ["gaussian", "sech-squared"],
      id: "pulseShape",
      kind: "string",
      label: "Pulse shape",
    },
    {
      default: 0.01,
      description:
        "Allowed relative deviation from the ideal shape-specific product.",
      id: "relativeTolerance",
      kind: "number",
      label: "Relative tolerance",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Measured Δν·Δτ product.",
      id: "timeBandwidthProduct",
      kind: "number",
      label: "TBP",
    },
    {
      description: "Transform limit for the chosen shape.",
      id: "transformLimit",
      kind: "number",
      label: "Limit",
    },
    {
      description:
        "True when the product lies within the selected tolerance of the assumed transform limit.",
      id: "consistentWithTransformLimit",
      kind: "boolean",
      label: "Transform limited",
    },
    {
      description: "Measured product divided by the assumed transform limit.",
      id: "ratioToTransformLimit",
      kind: "number",
      label: "Margin",
    },
  ],
  title: "Time–Bandwidth Product Checker",
});
export const runTimeBandwidth = timeBandwidthTool.execute;
export default timeBandwidthTool;

export { timeBandwidthExample as example };
