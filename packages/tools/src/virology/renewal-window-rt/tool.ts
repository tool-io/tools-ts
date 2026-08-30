import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly incidenceCounts: readonly number[];
  readonly generationWeights: readonly number[];
  readonly windowDays: number;
}>;
export type Output = Readonly<{
  readonly windowEndIndexes: readonly number[];
  readonly reproductionEstimates: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  input.incidenceCounts.forEach((v) => nonnegative(v, "incidenceCounts"));
  input.generationWeights.forEach((v) => fraction(v, "generationWeights"));
  count(input.windowDays, "windowDays", 1);
  const lag = input.generationWeights.length;
  if (
    !lag ||
    Math.abs(input.generationWeights.reduce((a, b) => a + b, 0) - 1) > 1e-10 ||
    input.incidenceCounts.length < lag + input.windowDays ||
    input.incidenceCounts.length * lag > 1000000
  )
    simpleError(
      "generationWeights",
      "Normalized lag-one-first weights and enough observations within the convolution budget required.",
    );
  const infectivity = input.incidenceCounts.map((_, t) =>
      t < lag
        ? 0
        : input.generationWeights.reduce(
            (sum, w, j) => sum + w * input.incidenceCounts[t - j - 1],
            0,
          ),
    ),
    windowEndIndexes: number[] = [],
    reproductionEstimates: number[] = [];
  let numerator = 0,
    denominator = 0;
  for (let t = lag; t < input.incidenceCounts.length; t++) {
    numerator += input.incidenceCounts[t];
    denominator += infectivity[t];
    if (t >= lag + input.windowDays) {
      numerator -= input.incidenceCounts[t - input.windowDays];
      denominator -= infectivity[t - input.windowDays];
    }
    if (t >= lag + input.windowDays - 1) {
      positive(denominator, "incidenceCounts");
      windowEndIndexes.push(t);
      reproductionEstimates.push(numerator / denominator);
    }
  }
  return { windowEndIndexes, reproductionEstimates };
};
export const exampleInput = {
  incidenceCounts: [10, 10, 20, 20],
  generationWeights: [1],
  windowDays: 2,
} satisfies Input;
export const exampleOutput = {
  windowEndIndexes: [2, 3],
  reproductionEstimates: [1.5, 1.3333333333333333],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/renewal-window-rt",
  title: "Renewal Window RT",
  description:
    "Estimate rolling renewal-equation Rt as window incidence divided by lag-weighted infectiousness; no uncertainty interval or imported-case correction is inferred.",
  inputs: [
    { id: "incidenceCounts", label: "Incidence counts", kind: "numberList" },
    {
      id: "generationWeights",
      label: "Generation weights",
      kind: "numberList",
    },
    { id: "windowDays", label: "Window days", kind: "integer", minimum: 1 },
  ],
  outputs: [
    { id: "windowEndIndexes", label: "Window end indexes", kind: "numberList" },
    {
      id: "reproductionEstimates",
      label: "Reproduction estimates",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      incidenceCounts: value.incidenceCounts as readonly number[],
      generationWeights: value.generationWeights as readonly number[],
      windowDays: value.windowDays as number,
    }),
});
export const run = tool.execute;
export default tool;
