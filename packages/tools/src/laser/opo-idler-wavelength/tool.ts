import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pumpWavelengthMeters: number;
  readonly signalWavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly idlerWavelengthMeters: number;
  readonly physicalSolution: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.pumpWavelengthMeters <= 0 || input.signalWavelengthMeters <= 0)
    simpleError(
      "pumpWavelengthMeters",
      "Wavelengths must be positive.",
      "invalid_wavelength",
    );
  const inverse =
    1 / input.pumpWavelengthMeters - 1 / input.signalWavelengthMeters;
  if (inverse <= 0)
    return { idlerWavelengthMeters: 0, physicalSolution: false };
  return { idlerWavelengthMeters: 1 / inverse, physicalSolution: true };
};

export const exampleInput = {
  pumpWavelengthMeters: 1e-6,
  signalWavelengthMeters: 1.5e-6,
} satisfies Input;
export const exampleOutput = {
  idlerWavelengthMeters: 0.0000029999999999999997,
  physicalSolution: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pumpWavelengthMeters: input.pumpWavelengthMeters as number,
      signalWavelengthMeters: input.signalWavelengthMeters as number,
    }),
  description:
    "Calculate OPO idler wavelength from pump and signal energy conservation.",
  id: "laser/opo-idler-wavelength",
  inputs: [
    {
      id: "pumpWavelengthMeters",
      label: "Pump wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "signalWavelengthMeters",
      label: "Signal wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "idlerWavelengthMeters",
      label: "Idler wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "physicalSolution",
      label: "Physical positive-frequency solution",
      kind: "boolean",
    },
  ],
  title: "OPO Idler Wavelength",
});

export const run = tool.execute;
export default tool;
