import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AccelerometerNoiseDensityInput = Readonly<{
  readonly rmsNoiseMicroG: number;
  readonly equivalentNoiseBandwidthHz: number;
}>;
export type AccelerometerNoiseDensityOutput = Readonly<{
  readonly noiseDensityMicroGPerSqrtHz: number;
}>;

export const calculateAccelerometerNoiseDensity = (
  x: AccelerometerNoiseDensityInput,
): AccelerometerNoiseDensityOutput => {
  if (!Number.isFinite(x.rmsNoiseMicroG) || x.rmsNoiseMicroG < 0)
    simpleError("rmsNoiseMicroG", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.equivalentNoiseBandwidthHz) ||
    x.equivalentNoiseBandwidthHz < 0
  )
    simpleError(
      "equivalentNoiseBandwidthHz",
      "Provide a finite number at least 0.",
    );
  if (!(x.equivalentNoiseBandwidthHz > 0))
    simpleError("equivalentNoiseBandwidthHz", "Bandwidth must be positive.");
  const noiseDensityMicroGPerSqrtHz =
    x.rmsNoiseMicroG / Math.sqrt(x.equivalentNoiseBandwidthHz);
  if (!Number.isFinite(noiseDensityMicroGPerSqrtHz))
    simpleError(
      "noiseDensityMicroGPerSqrtHz",
      "The inputs produce an invalid result.",
    );
  return {
    noiseDensityMicroGPerSqrtHz: Object.is(noiseDensityMicroGPerSqrtHz, -0)
      ? 0
      : noiseDensityMicroGPerSqrtHz,
  };
};

export const example = {
  input: { rmsNoiseMicroG: 100, equivalentNoiseBandwidthHz: 100 },
  output: { noiseDensityMicroGPerSqrtHz: 10 },
} satisfies ToolExample<
  AccelerometerNoiseDensityInput,
  AccelerometerNoiseDensityOutput
>;

export const tool = createSimpleTool({
  id: "electronics/accelerometer-noise-density",
  title: "Accelerometer Noise Density",
  description:
    "Infer white accelerometer noise density from measured RMS noise and equivalent noise bandwidth; colored noise needs spectral analysis.",
  inputs: [
    {
      id: "rmsNoiseMicroG",
      kind: "number",
      label: "RMS acceleration noise",
      unit: "µg",
      minimum: 0,
    },
    {
      id: "equivalentNoiseBandwidthHz",
      kind: "number",
      label: "Equivalent noise bandwidth",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "noiseDensityMicroGPerSqrtHz",
      kind: "number",
      label: "White-noise density",
      unit: "µg/√Hz",
    },
  ],
  calculate: (input) =>
    calculateAccelerometerNoiseDensity({
      rmsNoiseMicroG: input.rmsNoiseMicroG as number,
      equivalentNoiseBandwidthHz: input.equivalentNoiseBandwidthHz as number,
    }),
});
export const accelerometerNoiseDensityTool = tool;
export const runAccelerometerNoiseDensity = tool.execute;
export default tool;
