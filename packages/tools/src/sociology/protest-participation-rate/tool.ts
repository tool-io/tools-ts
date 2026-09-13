import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedProtestParticipantPeople: number;
  readonly actualEligibleSurveyPeople: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedProtestParticipantPeople",
    label: "Actual qualified protest participant people",
    kind: "number",
  },
  {
    id: "actualEligibleSurveyPeople",
    label: "Actual eligible survey people",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualQualifiedProtestParticipantPeople,
    "actualQualifiedProtestParticipantPeople",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleSurveyPeople,
    "actualEligibleSurveyPeople",
    1,
    1000000,
  );
  if (
    input.actualQualifiedProtestParticipantPeople >
    input.actualEligibleSurveyPeople
  )
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualQualifiedProtestParticipantPeople) /
      input.actualEligibleSurveyPeople,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedProtestParticipantPeople: 2,
    actualEligibleSurveyPeople: 4,
  },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/protest-participation-rate",
  title: "Protest Participation Rate Calculator",
  description:
    "Actual protest participant percentage, no infer political views from contacts. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
