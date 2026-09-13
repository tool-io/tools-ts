import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly betweenSubjectsMeanSquare: number;
  readonly withinSubjectsMeanSquare: number;
  readonly ratingsPerPerson: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "betweenSubjectsMeanSquare",
    label: "Between subjects mean square",
    kind: "number",
  },
  {
    id: "withinSubjectsMeanSquare",
    label: "Within subjects mean square",
    kind: "number",
  },
  { id: "ratingsPerPerson", label: "Ratings per person", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.betweenSubjectsMeanSquare, "betweenSubjectsMeanSquare");
  nonnegative(input.withinSubjectsMeanSquare, "withinSubjectsMeanSquare");
  bounded(input.ratingsPerPerson, "ratingsPerPerson", 1, 1000000);
  if (input.ratingsPerPerson < 2)
    simpleError("ratings", "At least two rater evaluations.");
  return {
    value:
      (input.betweenSubjectsMeanSquare - input.withinSubjectsMeanSquare) /
      (input.betweenSubjectsMeanSquare +
        (input.ratingsPerPerson - 1) * input.withinSubjectsMeanSquare),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    betweenSubjectsMeanSquare: 3,
    withinSubjectsMeanSquare: 1,
    ratingsPerPerson: 3,
  },
  output: { result: { value: 0.4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/intraclass-correlation-reliability",
  title: "ICC Reliability Calculator",
  description:
    "Explicit ICC(1,1) one way random single measurement ANOVA estimate, actual externally established mean squares and equal k; negative results retained, not choose another ICC form. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
