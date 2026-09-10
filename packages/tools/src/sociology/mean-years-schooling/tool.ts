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
  readonly observedCompletedSchoolYears: readonly number[];
  readonly matchedSurveyWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedCompletedSchoolYears",
    label: "Observed completed school years",
    kind: "numberList",
  },
  {
    id: "matchedSurveyWeights",
    label: "Matched survey weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.observedCompletedSchoolYears,
    input.matchedSurveyWeights,
    "survey",
  );
  [input.observedCompletedSchoolYears, input.matchedSurveyWeights].forEach(
    (v) => v.forEach((x) => nonnegative(x, "survey")),
  );
  return {
    observedMeanCompletedYears:
      sum(
        input.observedCompletedSchoolYears.map(
          (v, i) => v * input.matchedSurveyWeights[i],
        ),
      ) / positive(sum(input.matchedSurveyWeights), "weights"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedCompletedSchoolYears: [0, 6, 12],
    matchedSurveyWeights: [1, 1, 2],
  },
  output: { result: { observedMeanCompletedYears: 7.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/mean-years-schooling",
  title: "Mean Years of Schooling Calculator",
  description:
    "Actual weighted completed-schooling cohort mean; actual definitions and weights independently verified, not unobserved years or a universal education ranking.",
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
