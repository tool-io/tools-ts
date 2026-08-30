import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrestFactorPeakToRmsDbInput = Readonly<{
  readonly peakAmplitude: number;
  readonly rmsAmplitude: number;
}>;
export type CrestFactorPeakToRmsDbOutput = Readonly<{
  readonly crestFactorDecibels: number;
}>;

export const calculateCrestFactorPeakToRmsDb = (
  x: CrestFactorPeakToRmsDbInput,
): CrestFactorPeakToRmsDbOutput => {
  if (!Number.isFinite(x.peakAmplitude) || x.peakAmplitude <= 0)
    simpleError("peakAmplitude", "Provide a finite positive number.");
  if (!Number.isFinite(x.rmsAmplitude) || x.rmsAmplitude <= 0)
    simpleError("rmsAmplitude", "Provide a finite positive number.");
  if (!(x.peakAmplitude >= x.rmsAmplitude))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const crestFactorDecibels = 20 * Math.log10(x.peakAmplitude / x.rmsAmplitude);
  if (!Number.isFinite(crestFactorDecibels))
    simpleError(
      "crestFactorDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    crestFactorDecibels: Object.is(crestFactorDecibels, -0)
      ? 0
      : crestFactorDecibels,
  };
};

export const example = {
  input: {
    peakAmplitude: 1,
    rmsAmplitude: 0.7071067811865476,
  },
  output: { crestFactorDecibels: 3.0102999566398116 },
} satisfies ToolExample<
  CrestFactorPeakToRmsDbInput,
  CrestFactorPeakToRmsDbOutput
>;

export const tool = createSimpleTool({
  id: "music/crest-factor-peak-to-rms-db",
  title: "Crest Factor Peak To Rms Db",
  description: "Crest factor in dB from positive peak and RMS amplitudes.",
  inputs: [
    {
      id: "peakAmplitude",
      kind: "number",
      label: "Peak Amplitude",
      minimum: 0,
    },
    { id: "rmsAmplitude", kind: "number", label: "Rms Amplitude", minimum: 0 },
  ],
  outputs: [
    {
      id: "crestFactorDecibels",
      kind: "number",
      label: "Crest Factor Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateCrestFactorPeakToRmsDb({
      peakAmplitude: input.peakAmplitude as number,
      rmsAmplitude: input.rmsAmplitude as number,
    }),
});
export const crestFactorPeakToRmsDbTool = tool;
export const runCrestFactorPeakToRmsDb = tool.execute;
export default tool;
