import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAgeEnrollmentFractions: readonly number[];
  readonly ageIntervalWidthsYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedAgeEnrollmentFractions",
    label: "Observed age enrollment fractions",
    kind: "numberList",
  },
  {
    id: "ageIntervalWidthsYears",
    label: "Age interval widths years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.observedAgeEnrollmentFractions,
    input.ageIntervalWidthsYears,
    "bands",
  );
  input.observedAgeEnrollmentFractions.forEach((v) =>
    fraction(v, "enrollment"),
  );
  input.ageIntervalWidthsYears.forEach((v) => positive(v, "width"));
  return {
    conditionalExpectedEnrollmentYears: sum(
      input.observedAgeEnrollmentFractions.map(
        (v, i) => v * input.ageIntervalWidthsYears[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedAgeEnrollmentFractions: [0.8, 0.9],
    ageIntervalWidthsYears: [5, 5],
  },
  output: { result: { conditionalExpectedEnrollmentYears: 8.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/expected-years-schooling",
  title: "Expected Years of Schooling Calculator",
  description:
    "Period expected schooling from independently matched enrollment fractions\u00d7nonoverlapping age-interval widths; no guaranteed attainment or automatic cohort survival assumption.",
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
