import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly phaseChangeRadians: number;
  readonly wavelengthMeters: number;
  readonly refractiveIndex: number;
  readonly scanIntervalSeconds: number;
  readonly beamAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly axialVelocityMetersPerSecond: number;
  readonly flowVelocityMetersPerSecond: number;
}>;

export const calculate = (input: Input): Output => {
  const cosine = Math.cos((input.beamAngleDegrees * Math.PI) / 180);
  if (
    input.refractiveIndex <= 0 ||
    input.scanIntervalSeconds <= 0 ||
    Math.abs(cosine) < 1e-12
  )
    simpleError(
      "scanIntervalSeconds",
      "Index, scan interval, and angle cosine must support a finite velocity.",
      "invalid_geometry",
    );
  const axialVelocityMetersPerSecond =
    (input.phaseChangeRadians * input.wavelengthMeters) /
    (4 * Math.PI * input.refractiveIndex * input.scanIntervalSeconds);
  return {
    axialVelocityMetersPerSecond,
    flowVelocityMetersPerSecond: axialVelocityMetersPerSecond / cosine,
  };
};

export const exampleInput = {
  phaseChangeRadians: 3.141592653589793,
  wavelengthMeters: 8e-7,
  refractiveIndex: 1,
  scanIntervalSeconds: 0.001,
  beamAngleDegrees: 60,
} satisfies Input;
export const exampleOutput = {
  axialVelocityMetersPerSecond: 0.00019999999999999998,
  flowVelocityMetersPerSecond: 0.00039999999999999986,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      phaseChangeRadians: input.phaseChangeRadians as number,
      wavelengthMeters: input.wavelengthMeters as number,
      refractiveIndex: input.refractiveIndex as number,
      scanIntervalSeconds: input.scanIntervalSeconds as number,
      beamAngleDegrees: input.beamAngleDegrees as number,
    }),
  description:
    "Convert Doppler-OCT phase change into axial and angle-corrected flow velocity.",
  id: "laser/doppler-oct-velocity",
  inputs: [
    {
      id: "phaseChangeRadians",
      label: "Inter-scan phase change",
      kind: "number",
      unit: "rad",
    },
    {
      id: "wavelengthMeters",
      label: "Center wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "refractiveIndex",
      label: "Sample refractive index",
      kind: "number",
      minimum: 0,
    },
    {
      id: "scanIntervalSeconds",
      label: "Scan interval",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "beamAngleDegrees",
      label: "Beam-to-flow angle",
      kind: "number",
      minimum: 0,
      maximum: 90,
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "axialVelocityMetersPerSecond",
      label: "Axial velocity",
      kind: "number",
      unit: "m/s",
    },
    {
      id: "flowVelocityMetersPerSecond",
      label: "Angle-corrected flow velocity",
      kind: "number",
      unit: "m/s",
    },
  ],
  title: "Doppler OCT Velocity",
});

export const run = tool.execute;
export default tool;
