import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly verifiedDisciplinaryIncidentCounts: readonly number[];
  readonly matchedInmatePersonYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedDisciplinaryIncidentCounts",
    label: "Verified disciplinary incident counts",
    kind: "numberList",
  },
  {
    id: "matchedInmatePersonYears",
    label: "Matched inmate person years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.verifiedDisciplinaryIncidentCounts,
    input.matchedInmatePersonYears,
    1000,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedDisciplinaryIncidentCounts: [2, 4],
    matchedInmatePersonYears: [10, 20],
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
  id: "criminology/disciplinary-incident-rate-per-1000-inmates",
  title: "Disciplinary Incident Rate Per 1000 Inmates Calculator",
  description:
    "Actual institutional disciplinary incident rate, not probability a particular inmate is violent. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
