import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly fishWeightsGrams: readonly number[];
  readonly fishCounts: readonly number[];
  readonly gradingBoundariesGrams: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedMeanGrams: number;
  readonly populationCvPercent: number;
  readonly gradeBinCounts: readonly number[];
}>;
const inputFields = [
  { id: "fishWeightsGrams", label: "Fish weights grams", kind: "numberList" },
  { id: "fishCounts", label: "Fish counts", kind: "numberList" },
  {
    id: "gradingBoundariesGrams",
    label: "Grading boundaries grams",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fishWeightsGrams.forEach((v) => positive(v, "fishWeightsGrams"));
  input.fishCounts.forEach((v) => count(v, "fishCounts"));
  aligned(input.fishWeightsGrams, input.fishCounts, "fishWeightsGrams");
  if (input.gradingBoundariesGrams.length > 127)
    simpleError("gradingBoundariesGrams", "At most 128 bins supported.");
  input.gradingBoundariesGrams.forEach((v, i) => {
    positive(v, "gradingBoundariesGrams");
    if (i && v <= input.gradingBoundariesGrams[i - 1])
      simpleError("gradingBoundariesGrams", "Increasing boundaries required.");
  });
  const total = positive(
    input.fishCounts.reduce((a, b) => a + b, 0),
    "fishCounts",
  );
  count(total, "fishCounts");
  const weightedMeanGrams =
      input.fishWeightsGrams.reduce(
        (s, v, i) => s + v * input.fishCounts[i],
        0,
      ) / total,
    varianceValue =
      input.fishWeightsGrams.reduce(
        (s, v, i) => s + (v - weightedMeanGrams) ** 2 * input.fishCounts[i],
        0,
      ) / total,
    gradeBinCounts = Array<number>(
      input.gradingBoundariesGrams.length + 1,
    ).fill(0);
  input.fishWeightsGrams.forEach((v, i) => {
    let low = 0,
      high = input.gradingBoundariesGrams.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (v < input.gradingBoundariesGrams[mid]) high = mid;
      else low = mid + 1;
    }
    gradeBinCounts[low] += input.fishCounts[i];
  });
  return {
    weightedMeanGrams,
    populationCvPercent: (100 * Math.sqrt(varianceValue)) / weightedMeanGrams,
    gradeBinCounts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fishWeightsGrams: [10, 20, 30],
  fishCounts: [1, 2, 1],
  gradingBoundariesGrams: [15, 25],
} satisfies Input;
export const exampleOutput = {
  weightedMeanGrams: 20,
  populationCvPercent: 35.35533905932738,
  gradeBinCounts: [1, 2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/grading-size-variation",
  title: "Grading Size Variation",
  description:
    "Calculate weighted population size CV and grading counts from weight/frequency observations; bins are left-closed at boundaries and no cannibalism threshold is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "weightedMeanGrams", label: "Weighted mean grams", kind: "number" },
    {
      id: "populationCvPercent",
      label: "Population cv percent",
      kind: "number",
    },
    { id: "gradeBinCounts", label: "Grade bin counts", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      fishWeightsGrams: value.fishWeightsGrams as readonly number[],
      fishCounts: value.fishCounts as readonly number[],
      gradingBoundariesGrams: value.gradingBoundariesGrams as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
