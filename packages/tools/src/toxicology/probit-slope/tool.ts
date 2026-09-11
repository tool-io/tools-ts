import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fit } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualLogDoseCoordinates: readonly number[];
  readonly actualIndependentlyEstablishedProbitScores: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLogDoseCoordinates",
    label: "Actual log dose coordinates",
    kind: "numberList",
  },
  {
    id: "actualIndependentlyEstablishedProbitScores",
    label: "Actual independently established probit scores",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const f = fit(
    input.actualLogDoseCoordinates,
    input.actualIndependentlyEstablishedProbitScores,
  );
  return {
    observedLeastSquaresLinkSlope: f.slope,
    observedLeastSquaresLinkIntercept: f.intercept,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLogDoseCoordinates: [0, 1, 2],
    actualIndependentlyEstablishedProbitScores: [1, 3, 5],
  },
  output: {
    result: {
      observedLeastSquaresLinkSlope: 2,
      observedLeastSquaresLinkIntercept: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/probit-slope",
  title: "Probit Slope Calculator",
  description:
    "OLSof actual fitted probit-5 response slope against actual independently defined log-dose coordinates, not maximum-likelihood binomial dose-response fit, automatic link transformation or statistical uncertainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
