import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dopplerFrequencyHertz: number;
  readonly measurementSeconds: number;
  readonly wavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly fringeCount: number;
  readonly displacementMeters: number;
}>;

export const calculate = (input: Input): Output => {
  const fringeCount = input.dopplerFrequencyHertz * input.measurementSeconds;
  return {
    fringeCount,
    displacementMeters: (fringeCount * input.wavelengthMeters) / 2,
  };
};

export const exampleInput = {
  dopplerFrequencyHertz: 1000,
  measurementSeconds: 2,
  wavelengthMeters: 5e-7,
} satisfies Input;
export const exampleOutput = {
  fringeCount: 2000,
  displacementMeters: 0.0005,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      dopplerFrequencyHertz: input.dopplerFrequencyHertz as number,
      measurementSeconds: input.measurementSeconds as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
  description:
    "Convert heterodyne Doppler frequency integrated over time into displacement.",
  id: "laser/heterodyne-displacement",
  inputs: [
    {
      id: "dopplerFrequencyHertz",
      label: "Measured Doppler frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "measurementSeconds",
      label: "Measurement duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    { id: "fringeCount", label: "Accumulated fringe count", kind: "number" },
    {
      id: "displacementMeters",
      label: "Reflector displacement",
      kind: "number",
      unit: "m",
    },
  ],
  title: "Heterodyne Displacement",
});

export const run = tool.execute;
export default tool;
