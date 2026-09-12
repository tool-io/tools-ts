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
  readonly actualStandardizedLoadings: readonly number[];
  readonly actualResidualVariances: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStandardizedLoadings",
    label: "Actual standardized loadings",
    kind: "numberList",
  },
  {
    id: "actualResidualVariances",
    label: "Actual residual variances",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualStandardizedLoadings.length)
    simpleError("actualStandardizedLoadings", "Actual nonempty observations.");
  if (!input.actualResidualVariances.length)
    simpleError("actualResidualVariances", "Actual nonempty observations.");
  input.actualResidualVariances.forEach((v) =>
    nonnegative(v, "actualResidualVariances"),
  );
  aligned(
    input.actualStandardizedLoadings,
    input.actualResidualVariances,
    "items",
  );
  positive(
    sum(input.actualStandardizedLoadings.map((v) => v * v)) +
      sum(input.actualResidualVariances),
    "variance",
  );
  return {
    value:
      sum(input.actualStandardizedLoadings.map((v) => v * v)) /
      (sum(input.actualStandardizedLoadings.map((v) => v * v)) +
        sum(input.actualResidualVariances)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualStandardizedLoadings: [0.5, 0.5],
    actualResidualVariances: [0.25, 0.25],
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/average-variance-extracted-fornell-larcker",
  title: "Fornell-Larcker AVE Calculator",
  description:
    "Fornell\u2013Larcker AVE loading squared sum/(sum+residual), independent standardized factor/unit measurement conventions; not reliability sum loadings\u00b2. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
