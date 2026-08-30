import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly friedParameterMeters: number;
  readonly wavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly seeingRadians: number;
  readonly seeingArcseconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.friedParameterMeters <= 0 || input.wavelengthMeters <= 0)
    simpleError(
      "friedParameterMeters",
      "Fried parameter and wavelength must be positive.",
      "invalid_parameters",
    );
  const seeingRadians =
    (0.98 * input.wavelengthMeters) / input.friedParameterMeters;
  return {
    seeingRadians,
    seeingArcseconds: seeingRadians * 206264.80624709636,
  };
};

export const exampleInput = {
  friedParameterMeters: 0.1,
  wavelengthMeters: 5e-7,
} satisfies Input;
export const exampleOutput = {
  seeingRadians: 4.9e-6,
  seeingArcseconds: 1.010697550610772,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      friedParameterMeters: input.friedParameterMeters as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
  description:
    "Convert Fried parameter to seeing angle at a supplied wavelength.",
  id: "laser/fried-seeing-conversion",
  inputs: [
    {
      id: "friedParameterMeters",
      label: "Fried parameter r0",
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
      id: "seeingRadians",
      label: "Seeing angle",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    {
      id: "seeingArcseconds",
      label: "Seeing angle",
      kind: "number",
      minimum: 0,
      unit: "arcsec",
    },
  ],
  title: "Fried Seeing Conversion",
});

export const run = tool.execute;
export default tool;
