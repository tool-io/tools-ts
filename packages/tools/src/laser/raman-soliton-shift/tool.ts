import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ramanShiftCoefficientNmPerWKm: number;
  readonly pulsePeakPowerWatts: number;
  readonly fiberLengthKilometers: number;
  readonly initialWavelengthNanometers: number;
}>;
export type Output = Readonly<{
  readonly wavelengthShiftNanometers: number;
  readonly finalWavelengthNanometers: number;
}>;

export const calculate = (input: Input): Output => {
  const wavelengthShiftNanometers =
    input.ramanShiftCoefficientNmPerWKm *
    input.pulsePeakPowerWatts *
    input.fiberLengthKilometers;
  return {
    wavelengthShiftNanometers,
    finalWavelengthNanometers:
      input.initialWavelengthNanometers + wavelengthShiftNanometers,
  };
};

export const exampleInput = {
  ramanShiftCoefficientNmPerWKm: 0.01,
  pulsePeakPowerWatts: 100,
  fiberLengthKilometers: 2,
  initialWavelengthNanometers: 1550,
} satisfies Input;
export const exampleOutput = {
  wavelengthShiftNanometers: 2,
  finalWavelengthNanometers: 1552,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ramanShiftCoefficientNmPerWKm:
        input.ramanShiftCoefficientNmPerWKm as number,
      pulsePeakPowerWatts: input.pulsePeakPowerWatts as number,
      fiberLengthKilometers: input.fiberLengthKilometers as number,
      initialWavelengthNanometers: input.initialWavelengthNanometers as number,
    }),
  description:
    "Estimate a Raman soliton self-frequency wavelength shift from a supplied scaling coefficient.",
  id: "laser/raman-soliton-shift",
  inputs: [
    {
      id: "ramanShiftCoefficientNmPerWKm",
      label: "Raman shift coefficient",
      kind: "number",
      unit: "nm/(W·km)",
    },
    {
      id: "pulsePeakPowerWatts",
      label: "Pulse peak power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "fiberLengthKilometers",
      label: "Fiber length",
      kind: "number",
      minimum: 0,
      unit: "km",
    },
    {
      id: "initialWavelengthNanometers",
      label: "Initial wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "wavelengthShiftNanometers",
      label: "Estimated wavelength shift",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "finalWavelengthNanometers",
      label: "Estimated final wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Raman Soliton Shift",
});

export const run = tool.execute;
export default tool;
