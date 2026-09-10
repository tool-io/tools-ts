import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedTenureYears: readonly number[];
  readonly matchedEmployeeWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedTenureYears",
    label: "Observed tenure years",
    kind: "numberList",
  },
  {
    id: "matchedEmployeeWeights",
    label: "Matched employee weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(input.observedTenureYears, input.matchedEmployeeWeights, "cohort");
  [input.observedTenureYears, input.matchedEmployeeWeights].forEach((v) =>
    v.forEach((x) => nonnegative(x, "measurement")),
  );
  return {
    observedMeanTenureYears:
      sum(
        input.observedTenureYears.map(
          (v, i) => v * input.matchedEmployeeWeights[i],
        ),
      ) / positive(sum(input.matchedEmployeeWeights), "weights"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedTenureYears: [1, 3], matchedEmployeeWeights: [1, 3] },
  output: { result: { observedMeanTenureYears: 2.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/average-job-tenure-years",
  title: "Average Job Tenure Years Calculator",
  description:
    "Weighted actual completed/attained job-tenure observation mean; caller resolves censoring and definition, no unobserved expected career length.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
