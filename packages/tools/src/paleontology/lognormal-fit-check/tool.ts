import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly bodySizes: readonly number[];
  readonly callerMaximumAbsoluteLogSkewness: number;
}>;
export type Output = Readonly<{
  readonly meanNaturalLogSize: number;
  readonly populationLogStandardDeviation: number;
  readonly populationLogSkewness: number;
  readonly populationLogExcessKurtosis: number;
  readonly withinCallerLogSkewnessScreen: boolean;
}>;
const inputFields = [
  { id: "bodySizes", label: "Body sizes", kind: "numberList" },
  {
    id: "callerMaximumAbsoluteLogSkewness",
    label: "Caller maximum absolute log skewness",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.bodySizes.forEach((v) => positive(v, "bodySizes"));
  nonnegative(
    input.callerMaximumAbsoluteLogSkewness,
    "callerMaximumAbsoluteLogSkewness",
  );
  if (input.bodySizes.length < 3)
    simpleError("bodySizes", "At least three positive observations required.");
  const x = input.bodySizes.map(Math.log),
    m = mean(x),
    v = positive(mean(x.map((t) => (t - m) ** 2)), "logVariance"),
    skew = mean(x.map((t) => (t - m) ** 3)) / v ** 1.5;
  return {
    meanNaturalLogSize: m,
    populationLogStandardDeviation: Math.sqrt(v),
    populationLogSkewness: skew,
    populationLogExcessKurtosis: mean(x.map((t) => (t - m) ** 4)) / v ** 2 - 3,
    withinCallerLogSkewnessScreen:
      Math.abs(skew) <= input.callerMaximumAbsoluteLogSkewness,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bodySizes: [1, 2.718281828459045, 7.38905609893065],
  callerMaximumAbsoluteLogSkewness: 0.5,
} satisfies Input;
export const exampleOutput = {
  meanNaturalLogSize: 1,
  populationLogStandardDeviation: 0.816496580927726,
  populationLogSkewness: 0,
  populationLogExcessKurtosis: -1.5,
  withinCallerLogSkewnessScreen: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/lognormal-fit-check",
  title: "Body Size Frequency Log-Normal Fit Check",
  description:
    "Summarize empirical population moments in log body-size space with a caller skewness screen; not a formal distribution goodness-of-fit test or proof of lognormality.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanNaturalLogSize",
      label: "Mean natural log size",
      kind: "number",
    },
    {
      id: "populationLogStandardDeviation",
      label: "Population log standard deviation",
      kind: "number",
    },
    {
      id: "populationLogSkewness",
      label: "Population log skewness",
      kind: "number",
    },
    {
      id: "populationLogExcessKurtosis",
      label: "Population log excess kurtosis",
      kind: "number",
    },
    {
      id: "withinCallerLogSkewnessScreen",
      label: "Within caller log skewness screen",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      bodySizes: value.bodySizes as readonly number[],
      callerMaximumAbsoluteLogSkewness:
        value.callerMaximumAbsoluteLogSkewness as number,
    }),
});
export const run = tool.execute;
export default tool;
