import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedUnionMemberCounts: readonly number[];
  readonly matchedEligibleEmployeeCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedUnionMemberCounts",
    label: "Observed union member counts",
    kind: "numberList",
  },
  {
    id: "matchedEligibleEmployeeCounts",
    label: "Matched eligible employee counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.observedUnionMemberCounts,
    input.matchedEligibleEmployeeCounts,
    100,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedUnionMemberCounts: [2, 4],
    matchedEligibleEmployeeCounts: [10, 20],
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
  id: "sociology/union-density-membership-rate",
  title: "Union Density Membership Rate Calculator",
  description:
    "Union membership density under compatible actual eligibility definition. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
