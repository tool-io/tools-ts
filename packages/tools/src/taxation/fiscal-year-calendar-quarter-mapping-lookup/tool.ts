import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedCalendarMonth: number;
  readonly callerFiscalYearStartMonth: number;
}>;
export type Output = Readonly<{
  readonly fiscalMonthNumber: number;
  readonly fiscalQuarterNumber: number;
}>;
const inputFields = [
  {
    id: "observedCalendarMonth",
    label: "Observed calendar month",
    kind: "number",
  },
  {
    id: "callerFiscalYearStartMonth",
    label: "Caller fiscal year start month",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedCalendarMonth, "month", 1, 12);
  bounded(input.callerFiscalYearStartMonth, "startmonth", 1, 12);
  const m =
    ((input.observedCalendarMonth - input.callerFiscalYearStartMonth + 12) %
      12) +
    1;
  return { fiscalMonthNumber: m, fiscalQuarterNumber: Math.ceil(m / 3) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCalendarMonth: 2,
  callerFiscalYearStartMonth: 10,
} satisfies Input;
export const exampleOutput = {
  fiscalMonthNumber: 5,
  fiscalQuarterNumber: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/fiscal-year-calendar-quarter-mapping-lookup",
  title: "Fiscal Year Calendar Quarter Mapping Lookup",
  description:
    "Calendar month mapped to explicit fiscal start month and quarter, no4-4-5week calendar or reporting due date inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "fiscalMonthNumber", label: "Fiscal month number", kind: "number" },
    {
      id: "fiscalQuarterNumber",
      label: "Fiscal quarter number",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCalendarMonth: value.observedCalendarMonth as number,
      callerFiscalYearStartMonth: value.callerFiscalYearStartMonth as number,
    }),
});
export const run = tool.execute;
export default tool;
