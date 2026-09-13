import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualEligibleCohortRecidivists: number;
  readonly actualFollowedEligibleCohort: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEligibleCohortRecidivists",
    label: "Actual eligible cohort recidivists",
    kind: "number",
  },
  {
    id: "actualFollowedEligibleCohort",
    label: "Actual followed eligible cohort",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualEligibleCohortRecidivists,
    "actualEligibleCohortRecidivists",
    0,
    1000000,
  );
  bounded(
    input.actualFollowedEligibleCohort,
    "actualFollowedEligibleCohort",
    1,
    1000000,
  );
  if (
    input.actualEligibleCohortRecidivists > input.actualFollowedEligibleCohort
  )
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualEligibleCohortRecidivists) /
      input.actualFollowedEligibleCohort,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEligibleCohortRecidivists: 2,
    actualFollowedEligibleCohort: 4,
  },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/recidivism-rate",
  title: "Recidivism Rate Calculator",
  description:
    "Actual same cohort/time window recidivism percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
