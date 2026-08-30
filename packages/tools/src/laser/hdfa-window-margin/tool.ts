import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly operatingWavelengthNanometers: number;
  readonly windowMinimumNanometers: number;
  readonly windowMaximumNanometers: number;
}>;
export type Output = Readonly<{
  readonly lowerMarginNanometers: number;
  readonly upperMarginNanometers: number;
  readonly withinWindow: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.windowMinimumNanometers > input.windowMaximumNanometers)
    simpleError(
      "windowMinimumNanometers",
      "Window bounds must be ordered.",
      "invalid_window",
    );
  return {
    lowerMarginNanometers:
      input.operatingWavelengthNanometers - input.windowMinimumNanometers,
    upperMarginNanometers:
      input.windowMaximumNanometers - input.operatingWavelengthNanometers,
    withinWindow:
      input.operatingWavelengthNanometers >= input.windowMinimumNanometers &&
      input.operatingWavelengthNanometers <= input.windowMaximumNanometers,
  };
};

export const exampleInput = {
  operatingWavelengthNanometers: 2000,
  windowMinimumNanometers: 1900,
  windowMaximumNanometers: 2100,
} satisfies Input;
export const exampleOutput = {
  lowerMarginNanometers: 100,
  upperMarginNanometers: 100,
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
      windowMinimumNanometers: input.windowMinimumNanometers as number,
      windowMaximumNanometers: input.windowMaximumNanometers as number,
    }),
  description:
    "Check a wavelength against caller-supplied holmium-fiber amplifier window bounds.",
  id: "laser/hdfa-window-margin",
  inputs: [
    {
      id: "operatingWavelengthNanometers",
      label: "Operating wavelength",
      kind: "number",
      unit: "nm",
    },
    {
      id: "windowMinimumNanometers",
      label: "HDFA window minimum",
      kind: "number",
      unit: "nm",
    },
    {
      id: "windowMaximumNanometers",
      label: "HDFA window maximum",
      kind: "number",
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "lowerMarginNanometers",
      label: "Lower-edge margin",
      kind: "number",
      unit: "nm",
    },
    {
      id: "upperMarginNanometers",
      label: "Upper-edge margin",
      kind: "number",
      unit: "nm",
    },
    { id: "withinWindow", label: "Within HDFA window", kind: "boolean" },
  ],
  title: "HDFA Window Margin",
});

export const run = tool.execute;
export default tool;
