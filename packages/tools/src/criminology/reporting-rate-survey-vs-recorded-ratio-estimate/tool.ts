import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly matchedSurveyEstimatedEvents: number;
  readonly independentlyVerifiedReportedEvents: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "matchedSurveyEstimatedEvents",
    label: "Matched survey estimated events",
    kind: "number",
  },
  {
    id: "independentlyVerifiedReportedEvents",
    label: "Independently verified reported events",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.matchedSurveyEstimatedEvents, "estimate");
  nonnegative(input.independentlyVerifiedReportedEvents, "reported");
  return {
    conditionalReportedFraction:
      input.independentlyVerifiedReportedEvents /
      input.matchedSurveyEstimatedEvents,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    matchedSurveyEstimatedEvents: 100,
    independentlyVerifiedReportedEvents: 60,
  },
  output: { result: { conditionalReportedFraction: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/reporting-rate-survey-vs-recorded-ratio-estimate",
  title: "Reporting Rate Survey vs Recorded Ratio Estimator",
  description:
    "Observed independently harmonized survey reporting/estimated-event ratio; not police clearance or infer causes of nonreporting. Ratios above one retained as comparability discrepancy, not probability.",
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
