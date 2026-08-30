import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly outputPowerWatts: number;
  readonly apertureDiameterMeters: number;
}>;
export type Output = Readonly<{
  readonly apertureAreaSquareMeters: number;
  readonly averageIntensityWPerM2: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.apertureDiameterMeters <= 0)
    simpleError(
      "apertureDiameterMeters",
      "Aperture diameter must be positive.",
      "invalid_diameter",
    );
  const apertureAreaSquareMeters =
    Math.PI * (input.apertureDiameterMeters / 2) ** 2;
  return {
    apertureAreaSquareMeters,
    averageIntensityWPerM2: input.outputPowerWatts / apertureAreaSquareMeters,
  };
};

export const exampleInput = {
  outputPowerWatts: 10,
  apertureDiameterMeters: 0.01,
} satisfies Input;
export const exampleOutput = {
  apertureAreaSquareMeters: 7.853981633974483e-5,
  averageIntensityWPerM2: 127323.95447351628,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      outputPowerWatts: input.outputPowerWatts as number,
      apertureDiameterMeters: input.apertureDiameterMeters as number,
    }),
  description: "Calculate PCSEL aperture area and average output intensity.",
  id: "laser/pcsel-aperture-intensity",
  inputs: [
    {
      id: "outputPowerWatts",
      label: "Output power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "apertureDiameterMeters",
      label: "Aperture diameter",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "apertureAreaSquareMeters",
      label: "Aperture area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "averageIntensityWPerM2",
      label: "Average aperture intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
  ],
  title: "PCSEL Aperture Intensity",
});

export const run = tool.execute;
export default tool;
