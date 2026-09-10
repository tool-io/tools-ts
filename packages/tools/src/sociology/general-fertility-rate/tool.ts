import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedBirthCounts: readonly number[];
  readonly matchedReproductiveAgePersonYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedBirthCounts",
    label: "Observed birth counts",
    kind: "numberList",
  },
  {
    id: "matchedReproductiveAgePersonYears",
    label: "Matched reproductive age person years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.observedBirthCounts,
    input.matchedReproductiveAgePersonYears,
    1000,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedBirthCounts: [2, 4],
    matchedReproductiveAgePersonYears: [10, 20],
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
  id: "sociology/general-fertility-rate",
  title: "General Fertility Rate Calculator",
  description:
    "General fertility events per1000caller independently defined reproductive-age person-years. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
