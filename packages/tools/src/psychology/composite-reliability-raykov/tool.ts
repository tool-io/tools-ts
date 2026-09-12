import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerLatentVariance: number;
  readonly actualFactorLoadings: readonly number[];
  readonly actualResidualSumVarianceIncludingCovariances: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerLatentVariance",
    label: "Caller latent variance",
    kind: "number",
  },
  {
    id: "actualFactorLoadings",
    label: "Actual factor loadings",
    kind: "numberList",
  },
  {
    id: "actualResidualSumVarianceIncludingCovariances",
    label: "Actual residual sum variance including covariances",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerLatentVariance, "callerLatentVariance");
  if (!input.actualFactorLoadings.length)
    simpleError("actualFactorLoadings", "Actual nonempty observations.");
  nonnegative(
    input.actualResidualSumVarianceIncludingCovariances,
    "actualResidualSumVarianceIncludingCovariances",
  );
  positive(
    input.callerLatentVariance * sum(input.actualFactorLoadings) ** 2 +
      input.actualResidualSumVarianceIncludingCovariances,
    "totalvariance",
  );
  return {
    value:
      (input.callerLatentVariance * sum(input.actualFactorLoadings) ** 2) /
      (input.callerLatentVariance * sum(input.actualFactorLoadings) ** 2 +
        input.actualResidualSumVarianceIncludingCovariances),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerLatentVariance: 2,
    actualFactorLoadings: [1, 1],
    actualResidualSumVarianceIncludingCovariances: 2,
  },
  output: { result: { value: 0.8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/composite-reliability-raykov",
  title: "Raykov Composite Reliability Calculator",
  description:
    "Explicit Raykov composite reliability with independent latent variance and FULL residual sum variance inclcovariances, not force residual independence or unit factor variance. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
