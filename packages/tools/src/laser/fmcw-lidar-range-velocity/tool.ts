import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rangeBeatFrequencyHertz: number;
  readonly chirpSlopeHertzPerSecond: number;
  readonly dopplerFrequencyHertz: number;
  readonly wavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly rangeMeters: number;
  readonly radialVelocityMetersPerSecond: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.chirpSlopeHertzPerSecond === 0 || input.wavelengthMeters <= 0)
    simpleError(
      "chirpSlopeHertzPerSecond",
      "Chirp slope must be nonzero and wavelength positive.",
      "invalid_parameters",
    );
  return {
    rangeMeters:
      (299792458 * input.rangeBeatFrequencyHertz) /
      (2 * input.chirpSlopeHertzPerSecond),
    radialVelocityMetersPerSecond:
      (input.wavelengthMeters * input.dopplerFrequencyHertz) / 2,
  };
};

export const exampleInput = {
  rangeBeatFrequencyHertz: 1000000,
  chirpSlopeHertzPerSecond: 1000000000000,
  dopplerFrequencyHertz: 100000,
  wavelengthMeters: 1.55e-6,
} satisfies Input;
export const exampleOutput = {
  rangeMeters: 149.896229,
  radialVelocityMetersPerSecond: 0.0775,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rangeBeatFrequencyHertz: input.rangeBeatFrequencyHertz as number,
      chirpSlopeHertzPerSecond: input.chirpSlopeHertzPerSecond as number,
      dopplerFrequencyHertz: input.dopplerFrequencyHertz as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
  description:
    "Calculate ideal FMCW lidar range and radial velocity from separated beat frequencies.",
  id: "laser/fmcw-lidar-range-velocity",
  inputs: [
    {
      id: "rangeBeatFrequencyHertz",
      label: "Range beat frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "chirpSlopeHertzPerSecond",
      label: "Chirp slope",
      kind: "number",
      unit: "Hz/s",
    },
    {
      id: "dopplerFrequencyHertz",
      label: "Doppler frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    { id: "rangeMeters", label: "FMCW range", kind: "number", unit: "m" },
    {
      id: "radialVelocityMetersPerSecond",
      label: "Radial velocity",
      kind: "number",
      unit: "m/s",
    },
  ],
  title: "FMCW Lidar Range and Velocity",
});

export const run = tool.execute;
export default tool;
