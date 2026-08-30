import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly centerWavelengthNanometers: number;
  readonly spectralWidthNanometers: number;
}>;
export type Output = Readonly<{
  readonly coherenceLengthNanometers: number;
  readonly coherenceLengthMicrometers: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.spectralWidthNanometers <= 0)
    simpleError(
      "spectralWidthNanometers",
      "Spectral width must be positive.",
      "invalid_bandwidth",
    );
  const coherenceLengthNanometers =
    (((2 * Math.log(2)) / Math.PI) * input.centerWavelengthNanometers ** 2) /
    input.spectralWidthNanometers;
  return {
    coherenceLengthNanometers,
    coherenceLengthMicrometers: coherenceLengthNanometers / 1000,
  };
};

export const exampleInput = {
  centerWavelengthNanometers: 800,
  spectralWidthNanometers: 20,
} satisfies Input;
export const exampleOutput = {
  coherenceLengthNanometers: 14120.678409769704,
  coherenceLengthMicrometers: 14.120678409769704,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      centerWavelengthNanometers: input.centerWavelengthNanometers as number,
      spectralWidthNanometers: input.spectralWidthNanometers as number,
    }),
  description:
    "Estimate Gaussian SLD coherence length from center wavelength and spectral FWHM.",
  id: "laser/sld-coherence-length",
  inputs: [
    {
      id: "centerWavelengthNanometers",
      label: "Center wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "spectralWidthNanometers",
      label: "Spectral FWHM",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "coherenceLengthNanometers",
      label: "Gaussian coherence length",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "coherenceLengthMicrometers",
      label: "Gaussian coherence length",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "SLD Coherence Length",
});

export const run = tool.execute;
export default tool;
