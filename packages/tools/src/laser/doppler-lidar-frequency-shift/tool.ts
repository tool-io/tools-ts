import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly radialVelocityMetersPerSecond: number;
  readonly wavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly dopplerShiftHertz: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  return {
    dopplerShiftHertz:
      (2 * input.radialVelocityMetersPerSecond) / input.wavelengthMeters,
  };
};

export const exampleInput = {
  radialVelocityMetersPerSecond: 10,
  wavelengthMeters: 1.55e-6,
} satisfies Input;
export const exampleOutput = {
  dopplerShiftHertz: 12903225.806451613,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      radialVelocityMetersPerSecond:
        input.radialVelocityMetersPerSecond as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
  description:
    "Calculate monostatic lidar Doppler frequency shift from radial velocity and wavelength.",
  id: "laser/doppler-lidar-frequency-shift",
  inputs: [
    {
      id: "radialVelocityMetersPerSecond",
      label: "Radial velocity",
      kind: "number",
      unit: "m/s",
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
    {
      id: "dopplerShiftHertz",
      label: "Round-trip Doppler shift",
      kind: "number",
      unit: "Hz",
    },
  ],
  title: "Doppler Lidar Frequency Shift",
});

export const run = tool.execute;
export default tool;
