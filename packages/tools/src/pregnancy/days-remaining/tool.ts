import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, daysBetween } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly asOfDate: string;
  readonly independentlyEstablishedDueDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "asOfDate", label: "As of date", kind: "string" },
  {
    id: "independentlyEstablishedDueDate",
    label: "Independently established due date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    signedCalendarDaysToDueDate: daysBetween(
      input.asOfDate,
      input.independentlyEstablishedDueDate,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    asOfDate: "2026-01-01",
    independentlyEstablishedDueDate: "2026-01-31",
  },
  output: { result: { signedCalendarDaysToDueDate: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/days-remaining",
  title: "Days Remaining Calculator",
  description:
    "Actual signed calendar-day difference to an independently established obstetric due-date estimate, not guaranteed delivery timing, viability or indication to change clinical care.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
