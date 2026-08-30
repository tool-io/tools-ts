import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly biasedFieldAmplitude: number;
  readonly unbiasedFieldAmplitude: number;
  readonly biasFieldVoltsPerMeter: number;
}>;
export type Output = Readonly<{
  readonly biasInducedFieldAmplitude: number;
  readonly normalizedResponsePerVoltMeter: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.biasFieldVoltsPerMeter === 0)
    simpleError(
      "biasFieldVoltsPerMeter",
      "Bias field must not be zero.",
      "division_by_zero",
    );
  const biasInducedFieldAmplitude =
    input.biasedFieldAmplitude - input.unbiasedFieldAmplitude;
  return {
    biasInducedFieldAmplitude,
    normalizedResponsePerVoltMeter:
      biasInducedFieldAmplitude / input.biasFieldVoltsPerMeter,
  };
};

export const exampleInput = {
  biasedFieldAmplitude: 5,
  unbiasedFieldAmplitude: 1,
  biasFieldVoltsPerMeter: 2000,
} satisfies Input;
export const exampleOutput = {
  biasInducedFieldAmplitude: 4,
  normalizedResponsePerVoltMeter: 0.002,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      biasedFieldAmplitude: input.biasedFieldAmplitude as number,
      unbiasedFieldAmplitude: input.unbiasedFieldAmplitude as number,
      biasFieldVoltsPerMeter: input.biasFieldVoltsPerMeter as number,
    }),
  description:
    "Subtract unbiased background and normalize an air-biased coherent THz field measurement.",
  id: "laser/air-biased-thz-field",
  inputs: [
    {
      id: "biasedFieldAmplitude",
      label: "Biased detected field",
      kind: "number",
    },
    {
      id: "unbiasedFieldAmplitude",
      label: "Unbiased detected field",
      kind: "number",
    },
    {
      id: "biasFieldVoltsPerMeter",
      label: "Applied bias field",
      kind: "number",
      unit: "V/m",
    },
  ],
  outputs: [
    {
      id: "biasInducedFieldAmplitude",
      label: "Bias-induced field",
      kind: "number",
    },
    {
      id: "normalizedResponsePerVoltMeter",
      label: "Normalized response",
      kind: "number",
      unit: "m/V",
    },
  ],
  title: "Air-Biased THz Field",
});

export const run = tool.execute;
export default tool;
