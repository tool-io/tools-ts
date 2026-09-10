import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly youthPopulationCounts: readonly number[];
  readonly workingAgePopulationCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "youthPopulationCounts",
    label: "Youth population counts",
    kind: "numberList",
  },
  {
    id: "workingAgePopulationCounts",
    label: "Working age population counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.youthPopulationCounts,
    input.workingAgePopulationCounts,
    100,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    youthPopulationCounts: [2, 4],
    workingAgePopulationCounts: [10, 20],
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
  id: "sociology/dependency-ratio-youth",
  title: "Youth Dependency Ratio Calculator",
  description:
    "Youth demographic dependency ratio under independently defined age bands. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
