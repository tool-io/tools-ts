import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPooledIndependentT: number;
  readonly firstSampleSize: number;
  readonly secondSampleSize: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPooledIndependentT",
    label: "Actual pooled independent t",
    kind: "number",
  },
  { id: "firstSampleSize", label: "First sample size", kind: "number" },
  { id: "secondSampleSize", label: "Second sample size", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.firstSampleSize, "firstSampleSize", 1, 1000000);
  bounded(input.secondSampleSize, "secondSampleSize", 1, 1000000);
  if (input.firstSampleSize < 2 || input.secondSampleSize < 2)
    simpleError("samples", "Independentn1,n2≥2.");
  return {
    value:
      (1 - 3 / (4 * (input.firstSampleSize + input.secondSampleSize - 2) - 1)) *
      input.actualPooledIndependentT *
      Math.sqrt(1 / input.firstSampleSize + 1 / input.secondSampleSize),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPooledIndependentT: 2,
    firstSampleSize: 20,
    secondSampleSize: 20,
  },
  output: { result: { value: 0.6198901903376426 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/hedges-g-from-t-statistic",
  title: "Hedges g From t Statistic Converter",
  description:
    "Independent equal variance pool edt\u2192Hedgesgwith approximateJ=1\u22123/(4df\u22121), n1, n2\u22652. Not paired/Welcht, exact gamma correction or significance. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
