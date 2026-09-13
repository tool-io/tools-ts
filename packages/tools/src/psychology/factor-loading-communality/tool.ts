import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, sum } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualOrthogonalFactorLoadings: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOrthogonalFactorLoadings",
    label: "Actual orthogonal factor loadings",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualOrthogonalFactorLoadings.length)
    simpleError(
      "actualOrthogonalFactorLoadings",
      "Actual nonempty observations.",
    );
  return { value: sum(input.actualOrthogonalFactorLoadings.map((v) => v * v)) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOrthogonalFactorLoadings: [0.5, 0.5] },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/factor-loading-communality",
  title: "Factor Communality From Loadings Calculator",
  description:
    "Communality sum squared loadings only for independently established orthogonal/unit variance latent factors. Correlated factors require fullcovariance, not this model. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
