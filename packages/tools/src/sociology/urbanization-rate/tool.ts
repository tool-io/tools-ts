import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedUrbanPopulation: readonly number[];
  readonly matchedTotalPopulation: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedUrbanPopulation",
    label: "Observed urban population",
    kind: "numberList",
  },
  {
    id: "matchedTotalPopulation",
    label: "Matched total population",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.observedUrbanPopulation,
    input.matchedTotalPopulation,
    100,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedUrbanPopulation: [2, 4], matchedTotalPopulation: [10, 20] },
  output: {
    result: {
      observedPooledRate: 20.0,
      observedNumeratorTotal: 6,
      observedDenominatorTotal: 30,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/urbanization-rate",
  title: "Urbanization Rate Calculator",
  description:
    "Observed urban share under independently established geographic/census boundaries. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
