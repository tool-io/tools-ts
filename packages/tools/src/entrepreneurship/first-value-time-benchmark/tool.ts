import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstValueMinutes: readonly number[];
  readonly maximumMinutes: number;
}>;
export type Output = Readonly<{
  readonly medianMinutes: number;
  readonly withinTargetCount: number;
  readonly withinTargetPercent: number;
}>;
export const calculate = (input: Input): Output => {
  const v = input.firstValueMinutes,
    n = v.length;
  if (!n || v.some((x) => x < 0) || input.maximumMinutes < 0)
    simpleError(
      "firstValueMinutes",
      "Nonnegative first-value durations and target required.",
    );
  const sorted = [...v].sort((a, b) => a - b),
    medianMinutes =
      n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2,
    withinTargetCount = v.filter((x) => x <= input.maximumMinutes).length;
  return {
    medianMinutes,
    withinTargetCount,
    withinTargetPercent: (100 * withinTargetCount) / n,
  };
};
export const exampleInput = {
  firstValueMinutes: [5, 15, 10],
  maximumMinutes: 10,
} satisfies Input;
export const exampleOutput = {
  medianMinutes: 10,
  withinTargetCount: 2,
  withinTargetPercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/first-value-time-benchmark",
  title: "First Value Time Benchmark",
  description:
    "Measure time-to-first-value distribution against a caller benchmark.",
  inputs: [
    {
      id: "firstValueMinutes",
      label: "First value minutes",
      kind: "numberList",
    },
    { id: "maximumMinutes", label: "Maximum minutes", kind: "number" },
  ],
  outputs: [
    { id: "medianMinutes", label: "Median minutes", kind: "number" },
    { id: "withinTargetCount", label: "Within target count", kind: "number" },
    {
      id: "withinTargetPercent",
      label: "Within target percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstValueMinutes: value.firstValueMinutes as readonly number[],
      maximumMinutes: value.maximumMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
