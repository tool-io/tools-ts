import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly verifiedRecordedOffenseCounts: readonly number[];
  readonly matchedObservedActiveCareerYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedRecordedOffenseCounts",
    label: "Verified recorded offense counts",
    kind: "numberList",
  },
  {
    id: "matchedObservedActiveCareerYears",
    label: "Matched observed active career years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.verifiedRecordedOffenseCounts,
    input.matchedObservedActiveCareerYears,
    1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedRecordedOffenseCounts: [2, 4],
    matchedObservedActiveCareerYears: [10, 20],
  },
  output: {
    result: {
      observedPooledRate: 0.2,
      observedNumeratorTotal: 6,
      observedDenominatorTotal: 30,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/lambda-offenses-per-active-year-lookup",
  title: "Lambda Offenses Per Active Year Lookup",
  description:
    "Observed lambda event rate per independently established active-career year, not predict offending. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
