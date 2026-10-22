import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedVolunteerPeople: number;
  readonly actualEligibleSurveyPeople: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualQualifiedVolunteerPeople",
    label: "Actual qualified volunteer people",
    kind: "number",
  },
  {
    id: "actualEligibleSurveyPeople",
    label: "Actual eligible survey people",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  bounded(
    input.actualQualifiedVolunteerPeople,
    "actualQualifiedVolunteerPeople",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleSurveyPeople,
    "actualEligibleSurveyPeople",
    1,
    1000000,
  );
  if (input.actualQualifiedVolunteerPeople > input.actualEligibleSurveyPeople)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualQualifiedVolunteerPeople) /
      input.actualEligibleSurveyPeople,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQualifiedVolunteerPeople: 2, actualEligibleSurveyPeople: 4 },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/volunteering-rate",
  title: "Volunteering Rate Calculator",
  description:
    "Actual volunteering percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
