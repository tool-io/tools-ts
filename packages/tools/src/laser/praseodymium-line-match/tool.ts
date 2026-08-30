import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requestedWavelengthNanometers: number;
  readonly availableLinesNanometers: readonly number[];
  readonly maximumDetuningNanometers: number;
}>;
export type Output = Readonly<{
  readonly nearestLineNanometers: number;
  readonly detuningNanometers: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.availableLinesNanometers.length === 0)
    simpleError(
      "availableLinesNanometers",
      "At least one available line is required.",
      "empty_lines",
    );
  const nearestLineNanometers = input.availableLinesNanometers.reduce(
    (best, value) =>
      Math.abs(value - input.requestedWavelengthNanometers) <
      Math.abs(best - input.requestedWavelengthNanometers)
        ? value
        : best,
  );
  const detuningNanometers = Math.abs(
    nearestLineNanometers - input.requestedWavelengthNanometers,
  );
  return {
    nearestLineNanometers,
    detuningNanometers,
    withinTolerance: detuningNanometers <= input.maximumDetuningNanometers,
  };
};

export const exampleInput = {
  requestedWavelengthNanometers: 520,
  availableLinesNanometers: [500, 522, 600],
  maximumDetuningNanometers: 3,
} satisfies Input;
export const exampleOutput = {
  nearestLineNanometers: 522,
  detuningNanometers: 2,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      requestedWavelengthNanometers:
        input.requestedWavelengthNanometers as number,
      availableLinesNanometers:
        input.availableLinesNanometers as readonly number[],
      maximumDetuningNanometers: input.maximumDetuningNanometers as number,
    }),
  description:
    "Match a requested wavelength to caller-supplied praseodymium fiber lines.",
  id: "laser/praseodymium-line-match",
  inputs: [
    {
      id: "requestedWavelengthNanometers",
      label: "Requested wavelength",
      kind: "number",
      unit: "nm",
    },
    {
      id: "availableLinesNanometers",
      label: "Available praseodymium lines",
      kind: "numberList",
      unit: "nm",
    },
    {
      id: "maximumDetuningNanometers",
      label: "Maximum detuning",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "nearestLineNanometers",
      label: "Nearest available line",
      kind: "number",
      unit: "nm",
    },
    {
      id: "detuningNanometers",
      label: "Absolute detuning",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "withinTolerance",
      label: "Within detuning tolerance",
      kind: "boolean",
    },
  ],
  title: "Praseodymium Line Match",
});

export const run = tool.execute;
export default tool;
