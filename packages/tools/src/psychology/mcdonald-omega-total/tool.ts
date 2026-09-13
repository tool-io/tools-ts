import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualGeneralFactorLoadings: readonly number[];
  readonly actualUncorrelatedResidualVariances: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualGeneralFactorLoadings",
    label: "Actual general factor loadings",
    kind: "numberList",
  },
  {
    id: "actualUncorrelatedResidualVariances",
    label: "Actual uncorrelated residual variances",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualGeneralFactorLoadings.length)
    simpleError("actualGeneralFactorLoadings", "Actual nonempty observations.");
  if (!input.actualUncorrelatedResidualVariances.length)
    simpleError(
      "actualUncorrelatedResidualVariances",
      "Actual nonempty observations.",
    );
  input.actualUncorrelatedResidualVariances.forEach((v) =>
    nonnegative(v, "actualUncorrelatedResidualVariances"),
  );
  aligned(
    input.actualGeneralFactorLoadings,
    input.actualUncorrelatedResidualVariances,
    "items",
  );
  positive(
    sum(input.actualGeneralFactorLoadings) ** 2 +
      sum(input.actualUncorrelatedResidualVariances),
    "variance",
  );
  return {
    value:
      sum(input.actualGeneralFactorLoadings) ** 2 /
      (sum(input.actualGeneralFactorLoadings) ** 2 +
        sum(input.actualUncorrelatedResidualVariances)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualGeneralFactorLoadings: [1, 1],
    actualUncorrelatedResidualVariances: [0.5, 0.5],
  },
  output: { result: { value: 0.8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/mcdonald-omega-total",
  title: "McDonald's Omega Total Reliability",
  description:
    "Restricted unidimensional McDonaldomegatotal(sum loadings)\u00b2/[(sum loadings)\u00b2+\u03a3residual], unit factor variance and uncorrelatedresiduals. Not hierarchical omega, multi factor fit or norm. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
