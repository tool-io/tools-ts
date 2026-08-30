import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requestedWavelengthNanometers: number;
}>;
export type Output = Readonly<{
  readonly selectedLineNanometers: number;
  readonly detuningNanometers: number;
}>;

export const calculate = (input: Input): Output => {
  const lines = [325, 442];
  const selectedLineNanometers = lines.reduce((best, value) =>
    Math.abs(value - input.requestedWavelengthNanometers) <
    Math.abs(best - input.requestedWavelengthNanometers)
      ? value
      : best,
  );
  return {
    selectedLineNanometers,
    detuningNanometers: Math.abs(
      selectedLineNanometers - input.requestedWavelengthNanometers,
    ),
  };
};

export const exampleInput = {
  requestedWavelengthNanometers: 430,
} satisfies Input;
export const exampleOutput = {
  selectedLineNanometers: 442,
  detuningNanometers: 12,
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
    }),
  description: "Select the nearer common He–Cd line to a requested wavelength.",
  id: "laser/he-cd-line-selector",
  inputs: [
    {
      id: "requestedWavelengthNanometers",
      label: "Requested wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "selectedLineNanometers",
      label: "Selected He–Cd line",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "detuningNanometers",
      label: "Absolute detuning",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "He\u2013Cd Line Selector",
});

export const run = tool.execute;
export default tool;
