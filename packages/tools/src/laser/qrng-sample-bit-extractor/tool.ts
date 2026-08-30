import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly shotNoiseSamples: readonly number[];
  readonly threshold: number;
}>;
export type Output = Readonly<{
  readonly bits: readonly number[];
  readonly zeroCount: number;
  readonly oneCount: number;
  readonly oneFraction: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.shotNoiseSamples.length === 0)
    simpleError(
      "shotNoiseSamples",
      "At least one sample is required.",
      "empty_samples",
    );
  const bits = input.shotNoiseSamples.map((value) =>
    value >= input.threshold ? 1 : 0,
  );
  const oneCount = bits.reduce<number>((sum, value) => sum + value, 0);
  return {
    bits,
    zeroCount: bits.length - oneCount,
    oneCount,
    oneFraction: oneCount / bits.length,
  };
};

export const exampleInput = {
  shotNoiseSamples: [-1, 0.2, 0.5, -0.1],
  threshold: 0,
} satisfies Input;
export const exampleOutput = {
  bits: [0, 1, 1, 0],
  zeroCount: 2,
  oneCount: 2,
  oneFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      shotNoiseSamples: input.shotNoiseSamples as readonly number[],
      threshold: input.threshold as number,
    }),
  description:
    "Threshold supplied vacuum-noise samples into a deterministic bit sequence for downstream randomness testing.",
  id: "laser/qrng-sample-bit-extractor",
  inputs: [
    {
      id: "shotNoiseSamples",
      label: "Normalized shot-noise samples",
      kind: "numberList",
    },
    { id: "threshold", label: "Bit threshold", kind: "number" },
  ],
  outputs: [
    { id: "bits", label: "Extracted bits", kind: "numberList" },
    { id: "zeroCount", label: "Zero count", kind: "integer", minimum: 0 },
    { id: "oneCount", label: "One count", kind: "integer", minimum: 0 },
    {
      id: "oneFraction",
      label: "One fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "QRNG Sample Bit Extractor",
});

export const run = tool.execute;
export default tool;
