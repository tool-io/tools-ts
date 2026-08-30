import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction, quantile } from "../shared.js";
export type Input = Readonly<{
  readonly permutationMaxStatistics: readonly number[];
  readonly observedStatistics: readonly number[];
  readonly alpha: number;
}>;
export type Output = Readonly<{
  readonly referenceQuantile: number;
  readonly correctedPValues: readonly number[];
  readonly significantFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "permutationMaxStatistics",
    label: "Permutation max statistics",
    kind: "numberList",
  },
  {
    id: "observedStatistics",
    label: "Observed statistics",
    kind: "numberList",
  },
  { id: "alpha", label: "Alpha", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.permutationMaxStatistics.length ||
    !input.observedStatistics.length
  )
    simpleError(
      "permutationMaxStatistics",
      "Nonempty permutation maxima and observations required.",
    );
  if (
    input.permutationMaxStatistics.length * input.observedStatistics.length >
    1000000
  )
    simpleError(
      "observedStatistics",
      "Pairwise comparisons exceed the bounded work budget.",
    );
  fraction(input.alpha, "alpha");
  if (input.alpha === 0 || input.alpha === 1)
    simpleError("alpha", "Alpha must lie strictly between zero and one.");
  const correctedPValues = input.observedStatistics.map(
    (v) =>
      (1 + input.permutationMaxStatistics.filter((x) => x >= v).length) /
      (input.permutationMaxStatistics.length + 1),
  );
  return {
    referenceQuantile: quantile(
      input.permutationMaxStatistics,
      1 - input.alpha,
    ),
    correctedPValues,
    significantFlags: correctedPValues.map((p) => (p <= input.alpha ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  permutationMaxStatistics: [1, 2, 3, 4],
  observedStatistics: [2, 5],
  alpha: 0.4,
} satisfies Input;
export const exampleOutput = {
  referenceQuantile: 2.8,
  correctedPValues: [0.8, 0.2],
  significantFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/max-statistic-permutation-threshold",
  title: "Permutation Threshold",
  description:
    "Calculate upper-tail max-statistic permutation p-values with the plus-one correction and a separately labeled interpolated reference quantile; decisions use p-values, not an incompatible quantile cutoff.",
  inputs: inputFields,
  outputs: [
    { id: "referenceQuantile", label: "Reference quantile", kind: "number" },
    { id: "correctedPValues", label: "Corrected p values", kind: "numberList" },
    { id: "significantFlags", label: "Significant flags", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      permutationMaxStatistics:
        value.permutationMaxStatistics as readonly number[],
      observedStatistics: value.observedStatistics as readonly number[],
      alpha: value.alpha as number,
    }),
});
export const run = tool.execute;
export default tool;
