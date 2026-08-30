import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly leftWavelengthNanometers: number;
  readonly centerWavelengthNanometers: number;
  readonly rightWavelengthNanometers: number;
  readonly leftPower: number;
  readonly centerPower: number;
  readonly rightPower: number;
}>;
export type Output = Readonly<{
  readonly interpolatedPeakNanometers: number;
  readonly subsampleOffset: number;
}>;

export const calculate = (input: Input): Output => {
  const leftSpacing =
    input.centerWavelengthNanometers - input.leftWavelengthNanometers;
  const rightSpacing =
    input.rightWavelengthNanometers - input.centerWavelengthNanometers;
  if (
    leftSpacing <= 0 ||
    Math.abs(leftSpacing - rightSpacing) > Math.abs(leftSpacing) * 1e-9
  )
    simpleError(
      "leftWavelengthNanometers",
      "Wavelength samples must be ordered and equally spaced.",
      "invalid_spacing",
    );
  const denominator =
    input.leftPower - 2 * input.centerPower + input.rightPower;
  if (denominator === 0)
    simpleError(
      "centerPower",
      "Samples do not define a parabolic peak.",
      "flat_peak",
    );
  const subsampleOffset =
    (0.5 * (input.leftPower - input.rightPower)) / denominator;
  return {
    interpolatedPeakNanometers:
      input.centerWavelengthNanometers + subsampleOffset * leftSpacing,
    subsampleOffset,
  };
};

export const exampleInput = {
  leftWavelengthNanometers: 1549,
  centerWavelengthNanometers: 1550,
  rightWavelengthNanometers: 1551,
  leftPower: 1,
  centerPower: 4,
  rightPower: 3,
} satisfies Input;
export const exampleOutput = {
  interpolatedPeakNanometers: 1550.25,
  subsampleOffset: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      leftWavelengthNanometers: input.leftWavelengthNanometers as number,
      centerWavelengthNanometers: input.centerWavelengthNanometers as number,
      rightWavelengthNanometers: input.rightWavelengthNanometers as number,
      leftPower: input.leftPower as number,
      centerPower: input.centerPower as number,
      rightPower: input.rightPower as number,
    }),
  description:
    "Interpolate an FBG spectral peak from three equally spaced power samples.",
  id: "laser/fbg-peak-interpolation",
  inputs: [
    {
      id: "leftWavelengthNanometers",
      label: "Left sample wavelength",
      kind: "number",
      unit: "nm",
    },
    {
      id: "centerWavelengthNanometers",
      label: "Center sample wavelength",
      kind: "number",
      unit: "nm",
    },
    {
      id: "rightWavelengthNanometers",
      label: "Right sample wavelength",
      kind: "number",
      unit: "nm",
    },
    { id: "leftPower", label: "Left sample power", kind: "number" },
    { id: "centerPower", label: "Center sample power", kind: "number" },
    { id: "rightPower", label: "Right sample power", kind: "number" },
  ],
  outputs: [
    {
      id: "interpolatedPeakNanometers",
      label: "Interpolated peak wavelength",
      kind: "number",
      unit: "nm",
    },
    {
      id: "subsampleOffset",
      label: "Peak offset in sample intervals",
      kind: "number",
    },
  ],
  title: "FBG Peak Interpolation",
});

export const run = tool.execute;
export default tool;
