import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly verifiedVacancyCounts: readonly number[];
  readonly matchedUnemployedCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedVacancyCounts",
    label: "Verified vacancy counts",
    kind: "numberList",
  },
  {
    id: "matchedUnemployedCounts",
    label: "Matched unemployed counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.verifiedVacancyCounts,
    input.matchedUnemployedCounts,
    1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { verifiedVacancyCounts: [2, 4], matchedUnemployedCounts: [10, 20] },
  output: {
    result: {
      observedPooledRate: 0.2,
      observedNumeratorTotal: 6,
      observedDenominatorTotal: 30,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/beveridge-vacancy-unemployment-ratio",
  title: "Beveridge Vacancy-to-Unemployment Ratio",
  description:
    "Matched vacancy-to-unemployment count ratio under consistent geography/time. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
