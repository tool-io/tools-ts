import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyClassifiedDrugOffenseCustodyCounts: readonly number[];
  readonly matchedAssessedCustodyCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyClassifiedDrugOffenseCustodyCounts",
    label: "Independently classified drug offense custody counts",
    kind: "numberList",
  },
  {
    id: "matchedAssessedCustodyCounts",
    label: "Matched assessed custody counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.independentlyClassifiedDrugOffenseCustodyCounts,
    input.matchedAssessedCustodyCounts,
    100,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyClassifiedDrugOffenseCustodyCounts: [2, 4],
    matchedAssessedCustodyCounts: [10, 20],
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
  id: "criminology/incarceration-drug-offense-share-trend-percent",
  title: "Incarceration Drug Offense Share Trend Percent Calculator",
  description:
    "Actual independently coded custody offense-category share; overlapping/multiple conviction conventions externally resolved, not a trend forecast. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
