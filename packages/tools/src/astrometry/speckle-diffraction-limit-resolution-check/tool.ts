import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  deg,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly wavelengthMeters: number;
  readonly apertureMeters: number;
  readonly observedSeparationArcsec: number;
}>;
export type Output = Readonly<{
  readonly rayleighCircularPupilArcsec: number;
  readonly geometricSeparationAboveRayleigh: boolean;
}>;
const inputFields = [
  { id: "wavelengthMeters", label: "Wavelength meters", kind: "number" },
  { id: "apertureMeters", label: "Aperture meters", kind: "number" },
  {
    id: "observedSeparationArcsec",
    label: "Observed separation arcsec",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wavelengthMeters, "wavelengthMeters");
  positive(input.apertureMeters, "apertureMeters");
  nonnegative(input.observedSeparationArcsec, "observedSeparationArcsec");
  return {
    rayleighCircularPupilArcsec:
      deg((1.22 * input.wavelengthMeters) / input.apertureMeters) * 3600,
    geometricSeparationAboveRayleigh:
      input.observedSeparationArcsec >=
      deg((1.22 * input.wavelengthMeters) / input.apertureMeters) * 3600,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wavelengthMeters: 5e-7,
  apertureMeters: 1,
  observedSeparationArcsec: 0.2,
} satisfies Input;
export const exampleOutput = {
  rayleighCircularPupilArcsec: 0.12582153181072878,
  geometricSeparationAboveRayleigh: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/speckle-diffraction-limit-resolution-check",
  title: "Speckle Interferometry Diffraction Limit lambda/D Resolution Check",
  description:
    "Circular unobscured diffraction Rayleigh 1.22λ/Dcriterion, not empirical Dawes or speckle recovery/seeing limit. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "rayleighCircularPupilArcsec",
      label: "Rayleigh circular pupil arcsec",
      kind: "number",
    },
    {
      id: "geometricSeparationAboveRayleigh",
      label: "Geometric separation above rayleigh",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      wavelengthMeters: value.wavelengthMeters as number,
      apertureMeters: value.apertureMeters as number,
      observedSeparationArcsec: value.observedSeparationArcsec as number,
    }),
});
export const run = tool.execute;
export default tool;
