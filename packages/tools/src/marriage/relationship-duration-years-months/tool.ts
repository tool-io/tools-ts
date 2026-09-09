import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, calendarDuration } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualRelationshipStartDate: string;
  readonly actualRelationshipEndDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRelationshipStartDate",
    label: "Actual relationship start date",
    kind: "string",
  },
  {
    id: "actualRelationshipEndDate",
    label: "Actual relationship end date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return calendarDuration(
    input.actualRelationshipStartDate,
    input.actualRelationshipEndDate,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRelationshipStartDate: "2024-01-31",
    actualRelationshipEndDate: "2025-03-02",
  },
  output: {
    result: {
      completedYears: 1,
      completedAdditionalMonths: 1,
      remainingDays: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/relationship-duration-years-months",
  title: "Relationship Duration Years Months Calculator",
  description:
    "Completed Gregorian years/months using direct anchored day-of-month clamp to each targetmonth, then remainingdays. Explicit convention, not30daymonths, legal duration or local datetime arithmetic.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
