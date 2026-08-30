import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly modulationFrequencyHertz: number;
  readonly measurementOffsetMeters: number;
  readonly phaseLagRadians: number;
}>;
export type Output = Readonly<{
  readonly thermalDiffusivitySquareMetersPerSecond: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.phaseLagRadians <= 0)
    simpleError(
      "phaseLagRadians",
      "Phase lag must be positive.",
      "invalid_phase",
    );
  return {
    thermalDiffusivitySquareMetersPerSecond:
      (Math.PI *
        input.modulationFrequencyHertz *
        input.measurementOffsetMeters ** 2) /
      input.phaseLagRadians ** 2,
  };
};

export const exampleInput = {
  modulationFrequencyHertz: 1,
  measurementOffsetMeters: 0.001,
  phaseLagRadians: 3.141592653589793,
} satisfies Input;
export const exampleOutput = {
  thermalDiffusivitySquareMetersPerSecond: 3.1830988618379064e-7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      modulationFrequencyHertz: input.modulationFrequencyHertz as number,
      measurementOffsetMeters: input.measurementOffsetMeters as number,
      phaseLagRadians: input.phaseLagRadians as number,
    }),
  description:
    "Infer thermal diffusivity from photothermal-wave phase lag at a known offset.",
  id: "laser/photothermal-diffusivity",
  inputs: [
    {
      id: "modulationFrequencyHertz",
      label: "Modulation frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "measurementOffsetMeters",
      label: "Measurement offset",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "phaseLagRadians",
      label: "Thermal-wave phase lag",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
  ],
  outputs: [
    {
      id: "thermalDiffusivitySquareMetersPerSecond",
      label: "Thermal diffusivity",
      kind: "number",
      minimum: 0,
      unit: "m²/s",
    },
  ],
  title: "Photothermal Diffusivity",
});

export const run = tool.execute;
export default tool;
