import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly wavelengthMeters: number;
  readonly elementSpacingMeters: number;
  readonly adjacentPhaseShiftRadians: number;
}>;
export type Output = Readonly<{
  readonly steeringAngleDegrees: number;
  readonly physicalSolution: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0 || input.elementSpacingMeters <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength and spacing must be positive.",
      "invalid_geometry",
    );
  const sineArgument =
    (input.wavelengthMeters * input.adjacentPhaseShiftRadians) /
    (2 * Math.PI * input.elementSpacingMeters);
  if (Math.abs(sineArgument) > 1)
    return { steeringAngleDegrees: 0, physicalSolution: false };
  return {
    steeringAngleDegrees: (Math.asin(sineArgument) * 180) / Math.PI,
    physicalSolution: true,
  };
};

export const exampleInput = {
  wavelengthMeters: 1e-6,
  elementSpacingMeters: 1e-6,
  adjacentPhaseShiftRadians: 1.5707963267948966,
} satisfies Input;
export const exampleOutput = {
  steeringAngleDegrees: 14.477512185929923,
  physicalSolution: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      wavelengthMeters: input.wavelengthMeters as number,
      elementSpacingMeters: input.elementSpacingMeters as number,
      adjacentPhaseShiftRadians: input.adjacentPhaseShiftRadians as number,
    }),
  description:
    "Calculate phased-array beam steering from wavelength, element spacing, and adjacent phase shift.",
  id: "laser/optical-phased-array-steering",
  inputs: [
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "elementSpacingMeters",
      label: "Element spacing",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "adjacentPhaseShiftRadians",
      label: "Adjacent phase shift",
      kind: "number",
      unit: "rad",
    },
  ],
  outputs: [
    {
      id: "steeringAngleDegrees",
      label: "Steering angle",
      kind: "number",
      unit: "°",
    },
    {
      id: "physicalSolution",
      label: "Physical steering solution",
      kind: "boolean",
    },
  ],
  title: "Optical Phased-Array Steering",
});

export const run = tool.execute;
export default tool;
