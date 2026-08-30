import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rmsWavefrontErrorMeters: number;
  readonly wavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly strehlRatio: number;
  readonly strehlPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  const normalizedError =
    (2 * Math.PI * input.rmsWavefrontErrorMeters) / input.wavelengthMeters;
  const strehlRatio = Math.exp(-(normalizedError ** 2));
  return { strehlRatio, strehlPercent: strehlRatio * 100 };
};

export const exampleInput = {
  rmsWavefrontErrorMeters: 5e-8,
  wavelengthMeters: 1e-6,
} satisfies Input;
export const exampleOutput = {
  strehlRatio: 0.906018055788923,
  strehlPercent: 90.6018055788923,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rmsWavefrontErrorMeters: input.rmsWavefrontErrorMeters as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
  description:
    "Estimate Strehl ratio from RMS wavefront error with the Maréchal relation.",
  id: "laser/marechal-strehl",
  inputs: [
    {
      id: "rmsWavefrontErrorMeters",
      label: "RMS wavefront error",
      kind: "number",
      minimum: 0,
      unit: "m",
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
      id: "strehlRatio",
      label: "Maréchal Strehl estimate",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "strehlPercent",
      label: "Strehl estimate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Mar\u00e9chal Strehl",
});

export const run = tool.execute;
export default tool;
