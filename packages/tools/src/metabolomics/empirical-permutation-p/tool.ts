import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedStatistic: number;
  readonly permutedStatistics: readonly number[];
  readonly twoSided: boolean;
}>;
export type Output = Readonly<{
  readonly extremeCount: number;
  readonly empiricalP: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.permutedStatistics.length === 0)
    simpleError(
      "permutedStatistics",
      "At least one permutation statistic required.",
    );
  const observed = input.twoSided
      ? Math.abs(input.observedStatistic)
      : input.observedStatistic,
    extremeCount = input.permutedStatistics.filter(
      (v) => (input.twoSided ? Math.abs(v) : v) >= observed,
    ).length;
  return {
    extremeCount,
    empiricalP: (extremeCount + 1) / (input.permutedStatistics.length + 1),
  };
};
export const exampleInput = {
  observedStatistic: 3,
  permutedStatistics: [1, 2, 4],
  twoSided: true,
} satisfies Input;
export const exampleOutput = {
  extremeCount: 1,
  empiricalP: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/empirical-permutation-p",
  title: "Empirical Permutation P",
  description: "Estimate permutation p-value with plus-one correction.",
  inputs: [
    { id: "observedStatistic", kind: "number", label: "Observed statistic" },
    {
      id: "permutedStatistics",
      kind: "numberList",
      label: "Permuted statistics",
    },
    { id: "twoSided", kind: "boolean", label: "Two sided" },
  ],
  outputs: [
    { id: "extremeCount", kind: "number", label: "Extreme count" },
    { id: "empiricalP", kind: "number", label: "Empirical p" },
  ],
  calculate: (value) =>
    calculate({
      observedStatistic: value.observedStatistic as number,
      permutedStatistics: value.permutedStatistics as readonly number[],
      twoSided: value.twoSided as boolean,
    }),
});
export const run = tool.execute;
export default tool;
