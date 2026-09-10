import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedNewEntrantCounts: readonly number[];
  readonly matchedEligibleHouseholdMemberCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedNewEntrantCounts",
    label: "Observed new entrant counts",
    kind: "numberList",
  },
  {
    id: "matchedEligibleHouseholdMemberCounts",
    label: "Matched eligible household member counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.observedNewEntrantCounts,
    input.matchedEligibleHouseholdMemberCounts,
    100,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedNewEntrantCounts: [2, 4],
    matchedEligibleHouseholdMemberCounts: [10, 20],
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
  id: "sociology/added-worker-effect-share",
  title: "Added Worker Effect Share Calculator",
  description:
    "Observed added-worker transition share in matched affected households, not a causal added-worker effect. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
