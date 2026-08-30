import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, safeCeil } from "../shared.js";
export type Input = Readonly<{
  readonly displayLux: number;
  readonly displayHoursPerDay: number;
  readonly callerDisplayRunDays: number;
  readonly callerLongRunLuxHoursPerCalendarDayBudget: number;
}>;
export type Output = Readonly<{
  readonly displayRunLuxHours: number;
  readonly minimumWholeRestDaysUnderAverageBudget: number;
}>;
const inputFields = [
  { id: "displayLux", label: "Display lux", kind: "number" },
  { id: "displayHoursPerDay", label: "Display hours per day", kind: "number" },
  {
    id: "callerDisplayRunDays",
    label: "Caller display run days",
    kind: "integer",
  },
  {
    id: "callerLongRunLuxHoursPerCalendarDayBudget",
    label: "Caller long run lux hours per calendar day budget",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.displayLux, "displayLux");
  positive(input.displayHoursPerDay, "displayHoursPerDay");
  positive(
    input.callerLongRunLuxHoursPerCalendarDayBudget,
    "callerLongRunLuxHoursPerCalendarDayBudget",
  );
  count(input.callerDisplayRunDays, "callerDisplayRunDays");
  if (input.displayHoursPerDay > 24)
    simpleError("hours", "At most 24 daily display hours.");
  const displayRunLuxHours =
    input.displayLux * input.displayHoursPerDay * input.callerDisplayRunDays;
  return {
    displayRunLuxHours,
    minimumWholeRestDaysUnderAverageBudget: safeCeil(
      Math.max(
        0,
        displayRunLuxHours / input.callerLongRunLuxHoursPerCalendarDayBudget -
          input.callerDisplayRunDays,
      ),
      "restDays",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  displayLux: 50,
  displayHoursPerDay: 10,
  callerDisplayRunDays: 10,
  callerLongRunLuxHoursPerCalendarDayBudget: 100,
} satisfies Input;
export const exampleOutput = {
  displayRunLuxHours: 5000,
  minimumWholeRestDaysUnderAverageBudget: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/textile-rest-period-planner",
  title: "Textile Display Rest Period Rotator Planner",
  description:
    "Budget dark calendar rest to meet caller long-run average dose with fixed display run; darkness reduces future exposure rate, not reversal or biological recovery of textile damage.",
  inputs: inputFields,
  outputs: [
    {
      id: "displayRunLuxHours",
      label: "Display run lux hours",
      kind: "number",
    },
    {
      id: "minimumWholeRestDaysUnderAverageBudget",
      label: "Minimum whole rest days under average budget",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      displayLux: value.displayLux as number,
      displayHoursPerDay: value.displayHoursPerDay as number,
      callerDisplayRunDays: value.callerDisplayRunDays as number,
      callerLongRunLuxHoursPerCalendarDayBudget:
        value.callerLongRunLuxHoursPerCalendarDayBudget as number,
    }),
});
export const run = tool.execute;
export default tool;
