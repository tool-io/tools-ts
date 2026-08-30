import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly wavelengthNanometers: number;
  readonly numericalAperture: number;
  readonly pinholeAiryUnits: number;
}>;
export type Output = Readonly<{
  readonly diffractionFwhmNanometers: number;
  readonly pinholeAdjustedFwhmNanometers: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.numericalAperture <= 0)
    simpleError(
      "numericalAperture",
      "Numerical aperture must be positive.",
      "invalid_na",
    );
  const diffractionFwhmNanometers =
    (0.4 * input.wavelengthNanometers) / input.numericalAperture;
  return {
    diffractionFwhmNanometers,
    pinholeAdjustedFwhmNanometers:
      diffractionFwhmNanometers *
      Math.sqrt(1 + input.pinholeAiryUnits ** 2 / 4),
  };
};

export const exampleInput = {
  wavelengthNanometers: 500,
  numericalAperture: 1,
  pinholeAiryUnits: 0,
} satisfies Input;
export const exampleOutput = {
  diffractionFwhmNanometers: 200,
  pinholeAdjustedFwhmNanometers: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      wavelengthNanometers: input.wavelengthNanometers as number,
      numericalAperture: input.numericalAperture as number,
      pinholeAiryUnits: input.pinholeAiryUnits as number,
    }),
  description:
    "Estimate confocal lateral FWHM and a simple finite-pinhole adjustment.",
  id: "laser/confocal-lateral-resolution",
  inputs: [
    {
      id: "wavelengthNanometers",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "numericalAperture",
      label: "Numerical aperture",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pinholeAiryUnits",
      label: "Pinhole diameter",
      kind: "number",
      minimum: 0,
      unit: "AU",
    },
  ],
  outputs: [
    {
      id: "diffractionFwhmNanometers",
      label: "Diffraction-limited lateral FWHM",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "pinholeAdjustedFwhmNanometers",
      label: "Pinhole-adjusted FWHM",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Confocal Lateral Resolution",
});

export const run = tool.execute;
export default tool;
