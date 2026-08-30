import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly gratingCenterNanometers: number;
  readonly fullWidthNanometers: number;
  readonly signalWavelengthNanometers: number;
}>;
export type Output = Readonly<{
  readonly detuningNanometers: number;
  readonly edgeMarginNanometers: number;
  readonly withinPassband: boolean;
}>;

export const calculate = (input: Input): Output => {
  const detuningNanometers = Math.abs(
    input.signalWavelengthNanometers - input.gratingCenterNanometers,
  );
  const edgeMarginNanometers =
    input.fullWidthNanometers / 2 - detuningNanometers;
  return {
    detuningNanometers,
    edgeMarginNanometers,
    withinPassband: edgeMarginNanometers >= 0,
  };
};

export const exampleInput = {
  gratingCenterNanometers: 1064,
  fullWidthNanometers: 1,
  signalWavelengthNanometers: 1064.5,
} satisfies Input;
export const exampleOutput = {
  detuningNanometers: 0.5,
  edgeMarginNanometers: 0,
  withinPassband: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      gratingCenterNanometers: input.gratingCenterNanometers as number,
      fullWidthNanometers: input.fullWidthNanometers as number,
      signalWavelengthNanometers: input.signalWavelengthNanometers as number,
    }),
  description:
    "Check whether a signal lies inside a volume-Bragg grating passband.",
  id: "laser/volume-bragg-bandpass-check",
  inputs: [
    {
      id: "gratingCenterNanometers",
      label: "Grating center wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "fullWidthNanometers",
      label: "Full-width passband",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "signalWavelengthNanometers",
      label: "Signal wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "detuningNanometers",
      label: "Absolute detuning",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "edgeMarginNanometers",
      label: "Passband edge margin",
      kind: "number",
      unit: "nm",
    },
    { id: "withinPassband", label: "Within passband", kind: "boolean" },
  ],
  title: "Volume-Bragg Bandpass Check",
});

export const run = tool.execute;
export default tool;
