import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inputWaistRadiusMeters: number;
  readonly waistToLensDistanceMeters: number;
  readonly wavelengthMeters: number;
  readonly focalLengthMeters: number;
}>;
export type Output = Readonly<{
  readonly newWaistDistanceAfterLensMeters: number;
  readonly newWaistRadiusMeters: number;
  readonly rayleighRangeMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.inputWaistRadiusMeters <= 0 ||
    input.wavelengthMeters <= 0 ||
    input.focalLengthMeters === 0
  )
    simpleError(
      "inputWaistRadiusMeters",
      "Waist, wavelength, and nonzero focal length are required.",
      "invalid_beam",
    );
  const inputRayleigh =
    (Math.PI * input.inputWaistRadiusMeters ** 2) / input.wavelengthMeters;
  const qReal = input.waistToLensDistanceMeters,
    qImaginary = inputRayleigh;
  const magnitude = qReal ** 2 + qImaginary ** 2;
  const inverseReal = qReal / magnitude - 1 / input.focalLengthMeters;
  const inverseImaginary = -qImaginary / magnitude;
  const inverseMagnitude = inverseReal ** 2 + inverseImaginary ** 2;
  const outputReal = inverseReal / inverseMagnitude;
  const rayleighRangeMeters = -inverseImaginary / inverseMagnitude;
  return {
    newWaistDistanceAfterLensMeters: -outputReal,
    newWaistRadiusMeters: Math.sqrt(
      (input.wavelengthMeters * rayleighRangeMeters) / Math.PI,
    ),
    rayleighRangeMeters,
  };
};

export const exampleInput = {
  inputWaistRadiusMeters: 1,
  waistToLensDistanceMeters: 0,
  wavelengthMeters: 3.141592653589793,
  focalLengthMeters: 1,
} satisfies Input;
export const exampleOutput = {
  newWaistDistanceAfterLensMeters: 0.5,
  newWaistRadiusMeters: 0.7071067811865476,
  rayleighRangeMeters: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      inputWaistRadiusMeters: input.inputWaistRadiusMeters as number,
      waistToLensDistanceMeters: input.waistToLensDistanceMeters as number,
      wavelengthMeters: input.wavelengthMeters as number,
      focalLengthMeters: input.focalLengthMeters as number,
    }),
  description:
    "Propagate a Gaussian beam q parameter through a thin lens to locate the new waist.",
  id: "laser/focused-beam-waist-location",
  inputs: [
    {
      id: "inputWaistRadiusMeters",
      label: "Input waist radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "waistToLensDistanceMeters",
      label: "Waist-to-lens distance",
      kind: "number",
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
      id: "focalLengthMeters",
      label: "Lens focal length",
      kind: "number",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "newWaistDistanceAfterLensMeters",
      label: "New waist distance after lens",
      kind: "number",
      unit: "m",
    },
    {
      id: "newWaistRadiusMeters",
      label: "New waist radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "rayleighRangeMeters",
      label: "New Rayleigh range",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Focused-Beam Waist Location",
});

export const run = tool.execute;
export default tool;
