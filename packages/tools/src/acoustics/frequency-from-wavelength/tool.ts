import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrequencyFromWavelengthInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly wavelengthMeters: number;
}>;
export type FrequencyFromWavelengthOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateFrequencyFromWavelength = (
  x: FrequencyFromWavelengthInput,
): FrequencyFromWavelengthOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  if (!Number.isFinite(x.wavelengthMeters) || x.wavelengthMeters <= 0)
    simpleError("wavelengthMeters", "Provide a finite positive number.");
  const frequencyHertz = x.speedMetersPerSecond / x.wavelengthMeters;
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: {
    speedMetersPerSecond: 343,
    wavelengthMeters: 1,
  },
  output: { frequencyHertz: 343 },
} satisfies ToolExample<
  FrequencyFromWavelengthInput,
  FrequencyFromWavelengthOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/frequency-from-wavelength",
  title: "Frequency From Wavelength",
  description: "Acoustic frequency from wave speed and positive wavelength.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateFrequencyFromWavelength({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
});
export const frequencyFromWavelengthTool = tool;
export const runFrequencyFromWavelength = tool.execute;
export default tool;
