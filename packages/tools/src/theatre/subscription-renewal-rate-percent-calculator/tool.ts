import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedRenewedEligibleSubscriptions: readonly number[];
  readonly matchedRenewalEligibleSubscriptions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedRenewedEligibleSubscriptions",
    label: "Observed renewed eligible subscriptions",
    kind: "numberList",
  },
  {
    id: "matchedRenewalEligibleSubscriptions",
    label: "Matched renewal eligible subscriptions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.observedRenewedEligibleSubscriptions,
    input.matchedRenewalEligibleSubscriptions,
    100,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedRenewedEligibleSubscriptions: [2, 4],
    matchedRenewalEligibleSubscriptions: [10, 20],
  },
  output: {
    result: {
      observedPooledRate: 20.0,
      observedNumeratorTotal: 6,
      observedDenominatorTotal: 30,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/subscription-renewal-rate-percent-calculator",
  title: "Subscription Renewal Rate Percent Calculator",
  description:
    "Actual subscription renewal cohort share, excluding new subscriptions; not forecast retention or equal compare of unmatched cohorts. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
