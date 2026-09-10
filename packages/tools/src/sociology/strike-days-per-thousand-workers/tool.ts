import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedStrikePersonDays: readonly number[];
  readonly matchedWorkerPersonYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedStrikePersonDays",
    label: "Observed strike person days",
    kind: "numberList",
  },
  {
    id: "matchedWorkerPersonYears",
    label: "Matched worker person years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.observedStrikePersonDays,
    input.matchedWorkerPersonYears,
    1000,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedStrikePersonDays: [2, 4],
    matchedWorkerPersonYears: [10, 20],
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
  id: "sociology/strike-days-per-thousand-workers",
  title: "Strike Days Per Thousand Workers Calculator",
  description:
    "Observed strike person-days per1000worker-person-years. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
