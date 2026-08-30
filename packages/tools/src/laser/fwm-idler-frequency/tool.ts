import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pumpFrequencyTerahertz: number;
  readonly signalFrequencyTerahertz: number;
}>;
export type Output = Readonly<{
  readonly idlerFrequencyTerahertz: number;
  readonly idlerWavelengthMicrometers: number;
}>;

export const calculate = (input: Input): Output => {
  const idlerFrequencyTerahertz =
    2 * input.pumpFrequencyTerahertz - input.signalFrequencyTerahertz;
  if (idlerFrequencyTerahertz <= 0)
    simpleError(
      "signalFrequencyTerahertz",
      "Four-wave-mixing idler frequency must be positive.",
      "invalid_idler",
    );
  return {
    idlerFrequencyTerahertz,
    idlerWavelengthMicrometers: 299.792458 / idlerFrequencyTerahertz,
  };
};

export const exampleInput = {
  pumpFrequencyTerahertz: 200,
  signalFrequencyTerahertz: 100,
} satisfies Input;
export const exampleOutput = {
  idlerFrequencyTerahertz: 300,
  idlerWavelengthMicrometers: 0.9993081933333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pumpFrequencyTerahertz: input.pumpFrequencyTerahertz as number,
      signalFrequencyTerahertz: input.signalFrequencyTerahertz as number,
    }),
  description:
    "Calculate degenerate four-wave-mixing idler frequency and wavelength.",
  id: "laser/fwm-idler-frequency",
  inputs: [
    {
      id: "pumpFrequencyTerahertz",
      label: "Degenerate pump frequency",
      kind: "number",
      minimum: 0,
      unit: "THz",
    },
    {
      id: "signalFrequencyTerahertz",
      label: "Signal frequency",
      kind: "number",
      minimum: 0,
      unit: "THz",
    },
  ],
  outputs: [
    {
      id: "idlerFrequencyTerahertz",
      label: "Idler frequency",
      kind: "number",
      minimum: 0,
      unit: "THz",
    },
    {
      id: "idlerWavelengthMicrometers",
      label: "Idler vacuum wavelength",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "FWM Idler Frequency",
});

export const run = tool.execute;
export default tool;
