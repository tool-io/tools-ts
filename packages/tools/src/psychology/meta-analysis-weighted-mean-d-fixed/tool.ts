import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  weightedMean,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualStudyEffects: readonly number[];
  readonly callerActualInverseVarianceWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStudyEffects",
    label: "Actual study effects",
    kind: "numberList",
  },
  {
    id: "callerActualInverseVarianceWeights",
    label: "Caller actual inverse variance weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualStudyEffects.length)
    simpleError("actualStudyEffects", "Actual nonempty observations.");
  if (!input.callerActualInverseVarianceWeights.length)
    simpleError(
      "callerActualInverseVarianceWeights",
      "Actual nonempty observations.",
    );
  input.callerActualInverseVarianceWeights.forEach((v) =>
    nonnegative(v, "callerActualInverseVarianceWeights"),
  );
  return {
    value: weightedMean(
      input.actualStudyEffects,
      input.callerActualInverseVarianceWeights,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualStudyEffects: [1, 3],
    callerActualInverseVarianceWeights: [1, 1],
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/meta-analysis-weighted-mean-d-fixed",
  title: "Fixed-Effect Weighted Mean d Calculator",
  description:
    "Fixed-effect inverse variance weighted mean study effect, caller independently established compatible study variance/effect metrics; not heterogeneity correction or bias removal. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
