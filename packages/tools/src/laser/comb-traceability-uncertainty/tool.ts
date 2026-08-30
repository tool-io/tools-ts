import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly opticalFrequencyHertz: number;
  readonly fractionalUncertainties: readonly number[];
}>;
export type Output = Readonly<{
  readonly combinedFractionalUncertainty: number;
  readonly absoluteUncertaintyHertz: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.fractionalUncertainties.length === 0 ||
    input.fractionalUncertainties.some((value) => value < 0)
  )
    simpleError(
      "fractionalUncertainties",
      "Uncertainties must be nonempty and nonnegative.",
      "invalid_uncertainties",
    );
  const combinedFractionalUncertainty = Math.sqrt(
    input.fractionalUncertainties.reduce(
      (sum, value) => sum + value * value,
      0,
    ),
  );
  return {
    combinedFractionalUncertainty,
    absoluteUncertaintyHertz:
      input.opticalFrequencyHertz * combinedFractionalUncertainty,
  };
};

export const exampleInput = {
  opticalFrequencyHertz: 1000,
  fractionalUncertainties: [0.003, 0.004],
} satisfies Input;
export const exampleOutput = {
  combinedFractionalUncertainty: 0.005,
  absoluteUncertaintyHertz: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      opticalFrequencyHertz: input.opticalFrequencyHertz as number,
      fractionalUncertainties:
        input.fractionalUncertainties as readonly number[],
    }),
  description:
    "Combine independent fractional uncertainties in an optical-frequency traceability chain.",
  id: "laser/comb-traceability-uncertainty",
  inputs: [
    {
      id: "opticalFrequencyHertz",
      label: "Optical frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "fractionalUncertainties",
      label: "Independent fractional uncertainties",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "combinedFractionalUncertainty",
      label: "Combined fractional uncertainty",
      kind: "number",
      minimum: 0,
    },
    {
      id: "absoluteUncertaintyHertz",
      label: "Absolute frequency uncertainty",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  title: "Comb Traceability Uncertainty",
});

export const run = tool.execute;
export default tool;
