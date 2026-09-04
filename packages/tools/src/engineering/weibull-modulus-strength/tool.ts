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
  fraction,
  strictlyIncreasing,
  linearFit,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly orderedFailureStrengthPa: readonly number[];
  readonly callerPlottingFailureProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedWeibullStrengthModulus: number;
  readonly strengthFitRSquared: number;
}>;
const inputFields = [
  {
    id: "orderedFailureStrengthPa",
    label: "Ordered failure strength pa",
    kind: "numberList",
  },
  {
    id: "callerPlottingFailureProbabilities",
    label: "Caller plotting failure probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.orderedFailureStrengthPa.forEach((v) =>
    positive(v, "orderedFailureStrengthPa"),
  );
  input.callerPlottingFailureProbabilities.forEach((v) =>
    fraction(v, "callerPlottingFailureProbabilities"),
  );
  strictlyIncreasing(input.orderedFailureStrengthPa, "failure strengths");
  strictlyIncreasing(
    input.callerPlottingFailureProbabilities,
    "matched cumulative failure plotting positions",
  );
  if (input.callerPlottingFailureProbabilities.some((v) => v <= 0 || v >= 1))
    simpleError(
      "plotting",
      "Strict plotting probabilities(0,1), failure-only records independently selected.",
    );
  const fit = linearFit(
    input.orderedFailureStrengthPa.map(Math.log),
    input.callerPlottingFailureProbabilities.map((v) =>
      Math.log(-Math.log1p(-v)),
    ),
  );
  return {
    fittedWeibullStrengthModulus: fit.slope,
    strengthFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedFailureStrengthPa: [1, 2, 4],
  callerPlottingFailureProbabilities: [
    0.6321205588285577, 0.8646647167633873, 0.9816843611112658,
  ],
} satisfies Input;
export const exampleOutput = {
  fittedWeibullStrengthModulus: 1,
  strengthFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/weibull-modulus-strength",
  title: "Weibull Modulus Calculator",
  description:
    "Fit supplied failure-strength Weibull plotting positions, not censored maximum-likelihood reliability or automatic plotting-position policy. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedWeibullStrengthModulus",
      label: "Fitted weibull strength modulus",
      kind: "number",
    },
    {
      id: "strengthFitRSquared",
      label: "Strength fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      orderedFailureStrengthPa:
        value.orderedFailureStrengthPa as readonly number[],
      callerPlottingFailureProbabilities:
        value.callerPlottingFailureProbabilities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
