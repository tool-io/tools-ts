import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  count,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly separationsMm: readonly number[];
  readonly correctCounts: readonly number[];
  readonly trialCounts: readonly number[];
  readonly criterionFraction: number;
}>;
export type Output = Readonly<{
  readonly interpolatedThresholdMm: number;
  readonly bracketingSeparationsMm: readonly number[];
}>;
const inputFields = [
  { id: "separationsMm", label: "Separations mm", kind: "numberList" },
  { id: "correctCounts", label: "Correct counts", kind: "numberList" },
  { id: "trialCounts", label: "Trial counts", kind: "numberList" },
  { id: "criterionFraction", label: "Criterion fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.separationsMm, input.correctCounts, "separationsMm");
  aligned(input.separationsMm, input.trialCounts, "separationsMm");
  ordered(input.separationsMm, "separationsMm");
  input.separationsMm.forEach((v) => nonnegative(v, "separationsMm"));
  fraction(input.criterionFraction, "criterionFraction");
  const rates = input.correctCounts.map((v, i) => {
    count(v, "correctCounts");
    count(input.trialCounts[i], "trialCounts", 1);
    if (v > input.trialCounts[i])
      simpleError("correctCounts", "Correct responses cannot exceed trials.");
    return v / input.trialCounts[i];
  });
  if (rates.some((v, i) => i > 0 && v < rates[i - 1]))
    simpleError(
      "correctCounts",
      "Observed response fractions must be nondecreasing for interpolation.",
    );
  const i = rates.findIndex((v) => v >= input.criterionFraction);
  if (i <= 0)
    simpleError(
      "criterionFraction",
      "Criterion must be bracketed by measured levels; no extrapolation performed.",
    );
  const low = input.separationsMm[i - 1],
    high = input.separationsMm[i];
  return {
    interpolatedThresholdMm:
      low +
      ((high - low) * (input.criterionFraction - rates[i - 1])) /
        (rates[i] - rates[i - 1]),
    bracketingSeparationsMm: [low, high],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  separationsMm: [1, 2, 3],
  correctCounts: [5, 7, 9],
  trialCounts: [10, 10, 10],
  criterionFraction: 0.75,
} satisfies Input;
export const exampleOutput = {
  interpolatedThresholdMm: 2.25,
  bracketingSeparationsMm: [2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/two-point-psychometric-threshold",
  title: "Two-Point Discrimination",
  description:
    "Interpolate a two-point tactile discrimination criterion from monotone trial-count psychometric data; out-of-range criteria remain unestimated.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedThresholdMm",
      label: "Interpolated threshold mm",
      kind: "number",
    },
    {
      id: "bracketingSeparationsMm",
      label: "Bracketing separations mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      separationsMm: value.separationsMm as readonly number[],
      correctCounts: value.correctCounts as readonly number[],
      trialCounts: value.trialCounts as readonly number[],
      criterionFraction: value.criterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
