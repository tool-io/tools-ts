import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstWavelengthMeters: number;
  readonly secondWavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly syntheticWavelengthMeters: number;
}>;

export const calculate = (input: Input): Output => {
  const difference = Math.abs(
    input.firstWavelengthMeters - input.secondWavelengthMeters,
  );
  if (difference === 0)
    simpleError(
      "secondWavelengthMeters",
      "Wavelengths must differ.",
      "zero_difference",
    );
  return {
    syntheticWavelengthMeters:
      (input.firstWavelengthMeters * input.secondWavelengthMeters) / difference,
  };
};

export const exampleInput = {
  firstWavelengthMeters: 1e-6,
  secondWavelengthMeters: 1.01e-6,
} satisfies Input;
export const exampleOutput = {
  syntheticWavelengthMeters: 0.00010099999999999882,
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
    }),
  description:
    "Calculate the two-color synthetic wavelength for interferometric unwrapping.",
  id: "laser/synthetic-wavelength",
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
  ],
  outputs: [
    {
      id: "syntheticWavelengthMeters",
      label: "Synthetic wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Synthetic Wavelength",
});

export const run = tool.execute;
export default tool;
