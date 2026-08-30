import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly wavelengthMeters: number;
  readonly nonlinearIndexM2PerW: number;
  readonly intensityWPerM2: number;
  readonly mediumLengthMeters: number;
  readonly maximumBIntegral: number;
}>;
export type Output = Readonly<{
  readonly bIntegralRadians: number;
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  const bIntegralRadians =
    ((2 * Math.PI) / input.wavelengthMeters) *
    input.nonlinearIndexM2PerW *
    input.intensityWPerM2 *
    input.mediumLengthMeters;
  return {
    bIntegralRadians,
    withinLimit: bIntegralRadians <= input.maximumBIntegral,
  };
};

export const exampleInput = {
  wavelengthMeters: 1e-6,
  nonlinearIndexM2PerW: 3e-20,
  intensityWPerM2: 100000000000000,
  mediumLengthMeters: 0.1,
  maximumBIntegral: 2,
} satisfies Input;
export const exampleOutput = {
  bIntegralRadians: 1.8849555921538763,
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      wavelengthMeters: input.wavelengthMeters as number,
      nonlinearIndexM2PerW: input.nonlinearIndexM2PerW as number,
      intensityWPerM2: input.intensityWPerM2 as number,
      mediumLengthMeters: input.mediumLengthMeters as number,
      maximumBIntegral: input.maximumBIntegral as number,
    }),
  description:
    "Calculate nonlinear phase accumulation and compare it with a caller-defined B-integral limit.",
  id: "laser/b-integral",
  inputs: [
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "nonlinearIndexM2PerW",
      label: "Nonlinear index",
      kind: "number",
      unit: "m²/W",
    },
    {
      id: "intensityWPerM2",
      label: "Optical intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
    {
      id: "mediumLengthMeters",
      label: "Medium length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "maximumBIntegral",
      label: "Maximum B-integral",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
  ],
  outputs: [
    {
      id: "bIntegralRadians",
      label: "B-integral",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    { id: "withinLimit", label: "Within limit", kind: "boolean" },
  ],
  title: "B-Integral",
});

export const run = tool.execute;
export default tool;
