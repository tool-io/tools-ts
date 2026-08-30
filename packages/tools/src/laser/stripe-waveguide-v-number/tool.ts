import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stripeHalfWidthMeters: number;
  readonly wavelengthMeters: number;
  readonly coreIndex: number;
  readonly claddingIndex: number;
}>;
export type Output = Readonly<{
  readonly numericalAperture: number;
  readonly vNumber: number;
  readonly estimatedGuidedModeCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.stripeHalfWidthMeters <= 0 ||
    input.wavelengthMeters <= 0 ||
    input.coreIndex <= input.claddingIndex
  )
    simpleError(
      "stripeHalfWidthMeters",
      "Positive dimensions and core index above cladding are required.",
      "invalid_waveguide",
    );
  const numericalAperture = Math.sqrt(
    input.coreIndex ** 2 - input.claddingIndex ** 2,
  );
  const vNumber =
    ((2 * Math.PI * input.stripeHalfWidthMeters) / input.wavelengthMeters) *
    numericalAperture;
  return {
    numericalAperture,
    vNumber,
    estimatedGuidedModeCount: Math.floor((2 * vNumber) / Math.PI) + 1,
  };
};

export const exampleInput = {
  stripeHalfWidthMeters: 5e-7,
  wavelengthMeters: 1e-6,
  coreIndex: 1.5,
  claddingIndex: 1.118033988749895,
} satisfies Input;
export const exampleOutput = {
  numericalAperture: 0.9999999999999999,
  vNumber: 3.1415926535897927,
  estimatedGuidedModeCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      stripeHalfWidthMeters: input.stripeHalfWidthMeters as number,
      wavelengthMeters: input.wavelengthMeters as number,
      coreIndex: input.coreIndex as number,
      claddingIndex: input.claddingIndex as number,
    }),
  description:
    "Calculate planar stripe-waveguide V-number and an approximate guided-mode count.",
  id: "laser/stripe-waveguide-v-number",
  inputs: [
    {
      id: "stripeHalfWidthMeters",
      label: "Stripe half-width",
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
      id: "coreIndex",
      label: "Core refractive index",
      kind: "number",
      minimum: 0,
    },
    {
      id: "claddingIndex",
      label: "Cladding refractive index",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "numericalAperture",
      label: "Planar numerical aperture",
      kind: "number",
      minimum: 0,
    },
    {
      id: "vNumber",
      label: "Stripe-waveguide V-number",
      kind: "number",
      minimum: 0,
    },
    {
      id: "estimatedGuidedModeCount",
      label: "Estimated planar mode count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Stripe-Waveguide V-Number",
});

export const run = tool.execute;
export default tool;
