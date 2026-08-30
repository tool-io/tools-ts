import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly centerWavelengthNanometers: number;
  readonly spectralFwhmNanometers: number;
  readonly sampleRefractiveIndex: number;
}>;
export type Output = Readonly<{
  readonly airAxialResolutionMicrometers: number;
  readonly sampleAxialResolutionMicrometers: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.spectralFwhmNanometers <= 0 || input.sampleRefractiveIndex <= 0)
    simpleError(
      "spectralFwhmNanometers",
      "Bandwidth and refractive index must be positive.",
      "invalid_optics",
    );
  const airAxialResolutionMicrometers =
    (((2 * Math.log(2)) / Math.PI) * input.centerWavelengthNanometers ** 2) /
    input.spectralFwhmNanometers /
    1000;
  return {
    airAxialResolutionMicrometers,
    sampleAxialResolutionMicrometers:
      airAxialResolutionMicrometers / input.sampleRefractiveIndex,
  };
};

export const exampleInput = {
  centerWavelengthNanometers: 800,
  spectralFwhmNanometers: 100,
  sampleRefractiveIndex: 1.4,
} satisfies Input;
export const exampleOutput = {
  airAxialResolutionMicrometers: 2.8241356819539405,
  sampleAxialResolutionMicrometers: 2.0172397728242433,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      centerWavelengthNanometers: input.centerWavelengthNanometers as number,
      spectralFwhmNanometers: input.spectralFwhmNanometers as number,
      sampleRefractiveIndex: input.sampleRefractiveIndex as number,
    }),
  description:
    "Estimate Gaussian-spectrum OCT axial resolution in air and sample.",
  id: "laser/oct-axial-resolution",
  inputs: [
    {
      id: "centerWavelengthNanometers",
      label: "Center wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "spectralFwhmNanometers",
      label: "Spectral FWHM",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "sampleRefractiveIndex",
      label: "Sample refractive index",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "airAxialResolutionMicrometers",
      label: "Air axial resolution",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "sampleAxialResolutionMicrometers",
      label: "Sample axial resolution",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "OCT Axial Resolution",
});

export const run = tool.execute;
export default tool;
