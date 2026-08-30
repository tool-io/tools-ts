import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstWavelengthMeters: number;
  readonly secondWavelengthMeters: number;
  readonly mixingMode: string;
}>;
export type Output = Readonly<{
  readonly outputFrequencyHertz: number;
  readonly outputWavelengthMeters: number;
  readonly physicalSolution: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.firstWavelengthMeters <= 0 || input.secondWavelengthMeters <= 0)
    simpleError(
      "firstWavelengthMeters",
      "Wavelengths must be positive.",
      "invalid_wavelength",
    );
  const c = 299792458;
  const first = c / input.firstWavelengthMeters,
    second = c / input.secondWavelengthMeters;
  const outputFrequencyHertz =
    input.mixingMode === "sum" ? first + second : Math.abs(first - second);
  if (outputFrequencyHertz === 0)
    return {
      outputFrequencyHertz,
      outputWavelengthMeters: 0,
      physicalSolution: false,
    };
  return {
    outputFrequencyHertz,
    outputWavelengthMeters: c / outputFrequencyHertz,
    physicalSolution: true,
  };
};

export const exampleInput = {
  firstWavelengthMeters: 1e-6,
  secondWavelengthMeters: 2e-6,
  mixingMode: "sum",
} satisfies Input;
export const exampleOutput = {
  outputFrequencyHertz: 449688687000000,
  outputWavelengthMeters: 6.666666666666667e-7,
  physicalSolution: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstWavelengthMeters: input.firstWavelengthMeters as number,
      secondWavelengthMeters: input.secondWavelengthMeters as number,
      mixingMode: input.mixingMode as string,
    }),
  description:
    "Calculate sum- or difference-frequency output from two input wavelengths.",
  id: "laser/frequency-mixing-wavelength",
  inputs: [
    {
      id: "firstWavelengthMeters",
      label: "First wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "secondWavelengthMeters",
      label: "Second wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "mixingMode",
      label: "Mixing mode",
      kind: "string",
      enum: ["sum", "difference"],
    },
  ],
  outputs: [
    {
      id: "outputFrequencyHertz",
      label: "Output frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "outputWavelengthMeters",
      label: "Output wavelength",
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
  title: "Frequency-Mixing Wavelength",
});

export const run = tool.execute;
export default tool;
