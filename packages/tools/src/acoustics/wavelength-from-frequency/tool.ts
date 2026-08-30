import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WavelengthFromFrequencyInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly frequencyHertz: number;
}>;
export type WavelengthFromFrequencyOutput = Readonly<{
  readonly wavelengthMeters: number;
}>;

export const calculateWavelengthFromFrequency = (
  x: WavelengthFromFrequencyInput,
): WavelengthFromFrequencyOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz <= 0)
    simpleError("frequencyHertz", "Provide a finite positive number.");
  const wavelengthMeters = x.speedMetersPerSecond / x.frequencyHertz;
  if (!Number.isFinite(wavelengthMeters))
    simpleError(
      "wavelengthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wavelengthMeters: Object.is(wavelengthMeters, -0) ? 0 : wavelengthMeters,
  };
};

export const example = {
  input: {
    speedMetersPerSecond: 343,
    frequencyHertz: 343,
  },
  output: { wavelengthMeters: 1 },
} satisfies ToolExample<
  WavelengthFromFrequencyInput,
  WavelengthFromFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/wavelength-from-frequency",
  title: "Wavelength From Frequency",
  description:
    "Acoustic wavelength in metres from wave speed and positive frequency.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateWavelengthFromFrequency({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      frequencyHertz: input.frequencyHertz as number,
    }),
});
export const wavelengthFromFrequencyTool = tool;
export const runWavelengthFromFrequency = tool.execute;
export default tool;
