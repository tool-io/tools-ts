import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleSignals: readonly number[];
  readonly referenceSignals: readonly number[];
}>;
export type Output = Readonly<{
  readonly quotient: number;
  readonly normalizedSignals: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.sampleSignals.length;
  if (
    n === 0 ||
    input.referenceSignals.length !== n ||
    input.sampleSignals.some((v) => v < 0) ||
    input.referenceSignals.some((v) => v <= 0)
  )
    simpleError(
      "referenceSignals",
      "Aligned sample signals and positive reference signals required.",
    );
  const ratios = input.sampleSignals
      .map((v, i) => v / input.referenceSignals[i])
      .sort((a, b) => a - b),
    mid = Math.floor(n / 2),
    quotient = n % 2 ? ratios[mid] : (ratios[mid - 1] + ratios[mid]) / 2;
  if (quotient <= 0)
    simpleError("sampleSignals", "Median quotient must be positive.");
  return {
    quotient,
    normalizedSignals: input.sampleSignals.map((v) => v / quotient),
  };
};
export const exampleInput = {
  sampleSignals: [10, 30, 80],
  referenceSignals: [10, 10, 20],
} satisfies Input;
export const exampleOutput = {
  quotient: 3,
  normalizedSignals: [3.3333333333333335, 10, 26.666666666666668],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/probabilistic-quotient",
  title: "Probabilistic Quotient",
  description:
    "Normalize a metabolite profile by median sample/reference fold quotient.",
  inputs: [
    { id: "sampleSignals", kind: "numberList", label: "Sample signals" },
    { id: "referenceSignals", kind: "numberList", label: "Reference signals" },
  ],
  outputs: [
    { id: "quotient", kind: "number", label: "Quotient" },
    {
      id: "normalizedSignals",
      kind: "numberList",
      label: "Normalized signals",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleSignals: value.sampleSignals as readonly number[],
      referenceSignals: value.referenceSignals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
