import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly operatingWavelengthNanometers: number;
  readonly minimumWindowNanometers: number;
  readonly maximumWindowNanometers: number;
}>;
export type Output = Readonly<{
  readonly lowerMarginNanometers: number;
  readonly upperMarginNanometers: number;
  readonly withinWindow: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.minimumWindowNanometers > input.maximumWindowNanometers)
    simpleError(
      "minimumWindowNanometers",
      "Minimum window cannot exceed maximum.",
      "invalid_window",
    );
  return {
    lowerMarginNanometers:
      input.operatingWavelengthNanometers - input.minimumWindowNanometers,
    upperMarginNanometers:
      input.maximumWindowNanometers - input.operatingWavelengthNanometers,
    withinWindow:
      input.operatingWavelengthNanometers >= input.minimumWindowNanometers &&
      input.operatingWavelengthNanometers <= input.maximumWindowNanometers,
  };
};

export const exampleInput = {
  operatingWavelengthNanometers: 2350,
  minimumWindowNanometers: 1800,
  maximumWindowNanometers: 2500,
} satisfies Input;
export const exampleOutput = {
  lowerMarginNanometers: 550,
  upperMarginNanometers: 150,
  withinWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      operatingWavelengthNanometers:
        input.operatingWavelengthNanometers as number,
      minimumWindowNanometers: input.minimumWindowNanometers as number,
      maximumWindowNanometers: input.maximumWindowNanometers as number,
    }),
  description:
    "Compare a thulium-fluoride operating wavelength with caller-supplied transmission-window bounds.",
  id: "laser/fluoride-fiber-window-margin",
  inputs: [
    {
      id: "operatingWavelengthNanometers",
      label: "Operating wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "minimumWindowNanometers",
      label: "Minimum transmission-window wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "maximumWindowNanometers",
      label: "Maximum transmission-window wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "lowerMarginNanometers",
      label: "Lower-window margin",
      kind: "number",
      unit: "nm",
    },
    {
      id: "upperMarginNanometers",
      label: "Upper-window margin",
      kind: "number",
      unit: "nm",
    },
    { id: "withinWindow", label: "Within window", kind: "boolean" },
  ],
  title: "Fluoride-Fiber Window Margin",
});

export const run = tool.execute;
export default tool;
