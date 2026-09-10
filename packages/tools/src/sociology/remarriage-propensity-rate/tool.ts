import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedRemarriageEvents: readonly number[];
  readonly matchedEligiblePostDissolutionPersonYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedRemarriageEvents",
    label: "Observed remarriage events",
    kind: "numberList",
  },
  {
    id: "matchedEligiblePostDissolutionPersonYears",
    label: "Matched eligible post dissolution person years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.observedRemarriageEvents,
    input.matchedEligiblePostDissolutionPersonYears,
    1000,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedRemarriageEvents: [2, 4],
    matchedEligiblePostDissolutionPersonYears: [10, 20],
  },
  output: {
    result: {
      observedPooledRate: 200.0,
      observedNumeratorTotal: 6,
      observedDenominatorTotal: 30,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/remarriage-propensity-rate",
  title: "Remarriage Propensity Rate Calculator",
  description:
    "Remarriage events per 1,000 matched eligible person-years, not individual propensity prediction. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
