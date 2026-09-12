import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCompleteSampleSize: number;
  readonly actualVariableCount: number;
  readonly actualCorrelationMatrixDeterminant: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCompleteSampleSize",
    label: "Actual complete sample size",
    kind: "number",
  },
  { id: "actualVariableCount", label: "Actual variable count", kind: "number" },
  {
    id: "actualCorrelationMatrixDeterminant",
    label: "Actual correlation matrix determinant",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualCompleteSampleSize,
    "actualCompleteSampleSize",
    1,
    1000000,
  );
  bounded(input.actualVariableCount, "actualVariableCount", 1, 1000000);
  positive(
    input.actualCorrelationMatrixDeterminant,
    "actualCorrelationMatrixDeterminant",
  );
  if (
    input.actualCorrelationMatrixDeterminant > 1 ||
    input.actualVariableCount < 2 ||
    input.actualCompleteSampleSize -
      1 -
      (2 * input.actualVariableCount + 5) / 6 <=
      0
  )
    simpleError(
      "Bartlett",
      "Actual positive asymptotic correction, variables≥2,0<detR≤1.",
    );
  return {
    value:
      -(
        input.actualCompleteSampleSize -
        1 -
        (2 * input.actualVariableCount + 5) / 6
      ) * Math.log(input.actualCorrelationMatrixDeterminant),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCompleteSampleSize: 100,
    actualVariableCount: 3,
    actualCorrelationMatrixDeterminant: 0.5,
  },
  output: { result: { value: 67.35080104440802 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/bartlett-sphericity-statistic",
  title: "Bartlett Sphericity Statistic Calculator",
  description:
    "Bartlett sphericity chi\u00b2approximation\u2212(n\u22121\u2212(2p+5)/6) ln(detR), dfp(p\u22121)/2external; valid correlation determinant0<d\u22641and positive correction. No automatic pvalue. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
