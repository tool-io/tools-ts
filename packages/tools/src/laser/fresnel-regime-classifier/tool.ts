import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly apertureRadiusMeters: number;
  readonly propagationDistanceMeters: number;
  readonly wavelengthMeters: number;
  readonly nearFieldThreshold: number;
}>;
export type Output = Readonly<{
  readonly fresnelNumber: number;
  readonly regime: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.propagationDistanceMeters <= 0 || input.wavelengthMeters <= 0)
    simpleError(
      "propagationDistanceMeters",
      "Distance and wavelength must be positive.",
      "invalid_denominator",
    );
  const fresnelNumber =
    input.apertureRadiusMeters ** 2 /
    (input.propagationDistanceMeters * input.wavelengthMeters);
  return {
    fresnelNumber,
    regime:
      fresnelNumber >= input.nearFieldThreshold ? "near-field" : "far-field",
  };
};

export const exampleInput = {
  apertureRadiusMeters: 0.001,
  propagationDistanceMeters: 10,
  wavelengthMeters: 1e-6,
  nearFieldThreshold: 1,
} satisfies Input;
export const exampleOutput = {
  fresnelNumber: 0.1,
  regime: "far-field",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      apertureRadiusMeters: input.apertureRadiusMeters as number,
      propagationDistanceMeters: input.propagationDistanceMeters as number,
      wavelengthMeters: input.wavelengthMeters as number,
      nearFieldThreshold: input.nearFieldThreshold as number,
    }),
  description:
    "Calculate aperture Fresnel number and classify it with a caller-supplied regime threshold.",
  id: "laser/fresnel-regime-classifier",
  inputs: [
    {
      id: "apertureRadiusMeters",
      label: "Aperture radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "propagationDistanceMeters",
      label: "Propagation distance",
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
    {
      id: "nearFieldThreshold",
      label: "Near-field Fresnel threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fresnelNumber",
      label: "Fresnel number",
      kind: "number",
      minimum: 0,
    },
    {
      id: "regime",
      label: "Diffraction regime",
      kind: "string",
      enum: ["near-field", "far-field"],
    },
  ],
  title: "Fresnel Regime Classifier",
});

export const run = tool.execute;
export default tool;
