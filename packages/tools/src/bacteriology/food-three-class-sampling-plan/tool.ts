import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, count } from "../shared.js";

export type Input = Readonly<{
  readonly sampleCountsPerGram: readonly number[];
  readonly acceptableLimit: number;
  readonly maximumLimit: number;
  readonly maximumMarginalSamples: number;
}>;
export type Output = Readonly<{
  readonly marginalSampleIndexes: readonly number[];
  readonly unacceptableSampleIndexes: readonly number[];
  readonly planSatisfied: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (!input.sampleCountsPerGram.length)
    simpleError("sampleCountsPerGram", "Nonempty sample results required.");
  input.sampleCountsPerGram.forEach((v) =>
    nonnegative(v, "sampleCountsPerGram"),
  );
  nonnegative(input.acceptableLimit, "acceptableLimit");
  count(input.maximumMarginalSamples, "maximumMarginalSamples");
  if (
    input.maximumLimit < input.acceptableLimit ||
    input.maximumMarginalSamples > input.sampleCountsPerGram.length
  )
    simpleError(
      "maximumLimit",
      "Ordered limits and a marginal-sample allowance within the sample count required.",
    );
  const marginalSampleIndexes = input.sampleCountsPerGram.flatMap((v, i) =>
      v > input.acceptableLimit && v <= input.maximumLimit ? [i] : [],
    ),
    unacceptableSampleIndexes = input.sampleCountsPerGram.flatMap((v, i) =>
      v > input.maximumLimit ? [i] : [],
    );
  return {
    marginalSampleIndexes,
    unacceptableSampleIndexes,
    planSatisfied:
      unacceptableSampleIndexes.length === 0 &&
      marginalSampleIndexes.length <= input.maximumMarginalSamples,
  };
};
export const exampleInput = {
  sampleCountsPerGram: [5, 15, 25],
  acceptableLimit: 10,
  maximumLimit: 20,
  maximumMarginalSamples: 1,
} satisfies Input;
export const exampleOutput = {
  marginalSampleIndexes: [1],
  unacceptableSampleIndexes: [2],
  planSatisfied: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/food-three-class-sampling-plan",
  title: "Food Three Class Sampling Plan",
  description:
    "Evaluate an n/c/m/M-style three-class food plate-count plan using caller limits, not a universal food-safety determination.",
  inputs: [
    {
      id: "sampleCountsPerGram",
      label: "Sample counts per gram",
      kind: "numberList",
    },
    {
      id: "acceptableLimit",
      label: "Acceptable limit",
      kind: "number",
      minimum: 0,
    },
    { id: "maximumLimit", label: "Maximum limit", kind: "number" },
    {
      id: "maximumMarginalSamples",
      label: "Maximum marginal samples",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "marginalSampleIndexes",
      label: "Marginal sample indexes",
      kind: "numberList",
    },
    {
      id: "unacceptableSampleIndexes",
      label: "Unacceptable sample indexes",
      kind: "numberList",
    },
    { id: "planSatisfied", label: "Plan satisfied", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sampleCountsPerGram: value.sampleCountsPerGram as readonly number[],
      acceptableLimit: value.acceptableLimit as number,
      maximumLimit: value.maximumLimit as number,
      maximumMarginalSamples: value.maximumMarginalSamples as number,
    }),
});
export const run = tool.execute;
export default tool;
