import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly acceleratingFieldVPerMeter: number;
  readonly interactionLengthMeters: number;
  readonly referenceGradientVPerMeter: number;
}>;
export type Output = Readonly<{
  readonly energyGainElectronvolts: number;
  readonly gradientRatio: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.referenceGradientVPerMeter <= 0)
    simpleError(
      "referenceGradientVPerMeter",
      "Reference gradient must be positive.",
      "invalid_reference",
    );
  return {
    energyGainElectronvolts:
      input.acceleratingFieldVPerMeter * input.interactionLengthMeters,
    gradientRatio:
      input.acceleratingFieldVPerMeter / input.referenceGradientVPerMeter,
  };
};

export const exampleInput = {
  acceleratingFieldVPerMeter: 100,
  interactionLengthMeters: 2,
  referenceGradientVPerMeter: 50,
} satisfies Input;
export const exampleOutput = {
  energyGainElectronvolts: 200,
  gradientRatio: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      acceleratingFieldVPerMeter: input.acceleratingFieldVPerMeter as number,
      interactionLengthMeters: input.interactionLengthMeters as number,
      referenceGradientVPerMeter: input.referenceGradientVPerMeter as number,
    }),
  description:
    "Calculate wakefield energy gain and compare the gradient with a supplied reference.",
  id: "laser/wakefield-gradient-comparison",
  inputs: [
    {
      id: "acceleratingFieldVPerMeter",
      label: "Accelerating field",
      kind: "number",
      unit: "V/m",
    },
    {
      id: "interactionLengthMeters",
      label: "Interaction length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "referenceGradientVPerMeter",
      label: "Reference gradient",
      kind: "number",
      minimum: 0,
      unit: "V/m",
    },
  ],
  outputs: [
    {
      id: "energyGainElectronvolts",
      label: "Single-charge energy gain",
      kind: "number",
      unit: "eV",
    },
    {
      id: "gradientRatio",
      label: "Gradient-to-reference ratio",
      kind: "number",
    },
  ],
  title: "Wakefield Gradient Comparison",
});

export const run = tool.execute;
export default tool;
