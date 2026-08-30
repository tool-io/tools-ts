import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly enclosedAreaSquareMeters: number;
  readonly rotationRateRadiansPerSecond: number;
  readonly wavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly sagnacPhaseRadians: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  const c = 299792458;
  return {
    sagnacPhaseRadians:
      (8 *
        Math.PI *
        input.enclosedAreaSquareMeters *
        input.rotationRateRadiansPerSecond) /
      (input.wavelengthMeters * c),
  };
};

export const exampleInput = {
  enclosedAreaSquareMeters: 1,
  rotationRateRadiansPerSecond: 0.01,
  wavelengthMeters: 6.328e-7,
} satisfies Input;
export const exampleOutput = {
  sagnacPhaseRadians: 0.0013248072199441732,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      enclosedAreaSquareMeters: input.enclosedAreaSquareMeters as number,
      rotationRateRadiansPerSecond:
        input.rotationRateRadiansPerSecond as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
  description:
    "Calculate ideal ring-laser Sagnac phase shift from enclosed area, rotation rate, and wavelength.",
  id: "laser/sagnac-phase-shift",
  inputs: [
    {
      id: "enclosedAreaSquareMeters",
      label: "Enclosed area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "rotationRateRadiansPerSecond",
      label: "Rotation rate",
      kind: "number",
      unit: "rad/s",
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
      id: "sagnacPhaseRadians",
      label: "Sagnac phase shift",
      kind: "number",
      unit: "rad",
    },
  ],
  title: "Sagnac Phase Shift",
});

export const run = tool.execute;
export default tool;
