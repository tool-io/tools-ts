import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transitionSeconds: readonly number[];
  readonly maximumSeconds: number;
}>;
export type Output = Readonly<{
  readonly withinBenchmarkCount: number;
  readonly overBenchmarkIndexes: readonly number[];
  readonly averageTransitionSeconds: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !input.transitionSeconds.length ||
    input.transitionSeconds.some((v) => v < 0) ||
    input.maximumSeconds < 0
  )
    simpleError(
      "transitionSeconds",
      "Nonnegative observed transition times and benchmark required.",
    );
  return {
    withinBenchmarkCount: input.transitionSeconds.filter(
      (v) => v <= input.maximumSeconds,
    ).length,
    overBenchmarkIndexes: input.transitionSeconds.flatMap((v, i) =>
      v > input.maximumSeconds ? [i] : [],
    ),
    averageTransitionSeconds:
      input.transitionSeconds.reduce((a, b) => a + b, 0) /
      input.transitionSeconds.length,
  };
};
export const exampleInput = {
  transitionSeconds: [20, 35, 30],
  maximumSeconds: 30,
} satisfies Input;
export const exampleOutput = {
  withinBenchmarkCount: 2,
  overBenchmarkIndexes: [1],
  averageTransitionSeconds: 28.333333333333332,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/transition-time-gate",
  title: "Transition Time Gate",
  description:
    "Compare observed classroom transition times with a caller-supplied benchmark.",
  inputs: [
    {
      id: "transitionSeconds",
      label: "Transition seconds",
      kind: "numberList",
    },
    { id: "maximumSeconds", label: "Maximum seconds", kind: "number" },
  ],
  outputs: [
    {
      id: "withinBenchmarkCount",
      label: "Within benchmark count",
      kind: "number",
    },
    {
      id: "overBenchmarkIndexes",
      label: "Over benchmark indexes",
      kind: "numberList",
    },
    {
      id: "averageTransitionSeconds",
      label: "Average transition seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      transitionSeconds: value.transitionSeconds as readonly number[],
      maximumSeconds: value.maximumSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
