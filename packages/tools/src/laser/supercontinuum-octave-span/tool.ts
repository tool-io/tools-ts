import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly minimumWavelengthNanometers: number;
  readonly maximumWavelengthNanometers: number;
}>;
export type Output = Readonly<{
  readonly frequencyOctaves: number;
  readonly wavelengthRatio: number;
  readonly octaveSpanning: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.minimumWavelengthNanometers <= 0 ||
    input.maximumWavelengthNanometers < input.minimumWavelengthNanometers
  )
    simpleError(
      "minimumWavelengthNanometers",
      "Positive ordered wavelength bounds are required.",
      "invalid_span",
    );
  const wavelengthRatio =
    input.maximumWavelengthNanometers / input.minimumWavelengthNanometers;
  const frequencyOctaves = Math.log2(wavelengthRatio);
  return {
    frequencyOctaves,
    wavelengthRatio,
    octaveSpanning: frequencyOctaves >= 1,
  };
};

export const exampleInput = {
  minimumWavelengthNanometers: 500,
  maximumWavelengthNanometers: 1000,
} satisfies Input;
export const exampleOutput = {
  frequencyOctaves: 1,
  wavelengthRatio: 2,
  octaveSpanning: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      minimumWavelengthNanometers: input.minimumWavelengthNanometers as number,
      maximumWavelengthNanometers: input.maximumWavelengthNanometers as number,
    }),
  description: "Measure supercontinuum spectral span in frequency octaves.",
  id: "laser/supercontinuum-octave-span",
  inputs: [
    {
      id: "minimumWavelengthNanometers",
      label: "Minimum continuum wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "maximumWavelengthNanometers",
      label: "Maximum continuum wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "frequencyOctaves",
      label: "Frequency span",
      kind: "number",
      minimum: 0,
      unit: "octaves",
    },
    {
      id: "wavelengthRatio",
      label: "Maximum-to-minimum wavelength ratio",
      kind: "number",
      minimum: 1,
    },
    {
      id: "octaveSpanning",
      label: "Spans at least one octave",
      kind: "boolean",
    },
  ],
  title: "Supercontinuum Octave Span",
});

export const run = tool.execute;
export default tool;
