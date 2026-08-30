import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly sensitivityFraction: number;
  readonly specificityFraction: number;
  readonly prevalenceFraction: number;
}>;
export type Output = Readonly<{
  readonly positivePredictiveValue: number;
  readonly negativePredictiveValue: number;
  readonly positiveTestProbability: number;
}>;
export const calculate = (input: Input): Output => {
  const s = fraction(input.sensitivityFraction, "sensitivityFraction"),
    c = fraction(input.specificityFraction, "specificityFraction"),
    p = fraction(input.prevalenceFraction, "prevalenceFraction"),
    positiveTestProbability = s * p + (1 - c) * (1 - p),
    negativeTestProbability = (1 - s) * p + c * (1 - p);
  positive(positiveTestProbability, "prevalenceFraction");
  positive(negativeTestProbability, "prevalenceFraction");
  return {
    positivePredictiveValue: (s * p) / positiveTestProbability,
    negativePredictiveValue: (c * (1 - p)) / negativeTestProbability,
    positiveTestProbability,
  };
};
export const exampleInput = {
  sensitivityFraction: 0.9,
  specificityFraction: 0.9,
  prevalenceFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  positivePredictiveValue: 0.5,
  negativePredictiveValue: 0.9878048780487805,
  positiveTestProbability: 0.18,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/prevalence-predictive-values",
  title: "Prevalence Predictive Values",
  description:
    "Compute positive and negative predictive values from explicit prevalence, sensitivity, and specificity rather than observed classification counts.",
  inputs: [
    {
      id: "sensitivityFraction",
      label: "Sensitivity fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "specificityFraction",
      label: "Specificity fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "prevalenceFraction",
      label: "Prevalence fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "positivePredictiveValue",
      label: "Positive predictive value",
      kind: "number",
    },
    {
      id: "negativePredictiveValue",
      label: "Negative predictive value",
      kind: "number",
    },
    {
      id: "positiveTestProbability",
      label: "Positive test probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sensitivityFraction: value.sensitivityFraction as number,
      specificityFraction: value.specificityFraction as number,
      prevalenceFraction: value.prevalenceFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
