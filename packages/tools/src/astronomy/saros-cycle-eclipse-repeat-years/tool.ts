import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerMatchedSynodicMonthDays: number;
  readonly callerCycleMonthCount: number;
}>;
export type Output = Readonly<{
  readonly callerSarosDays: number;
  readonly callerSarosJulianYears: number;
}>;
const inputFields = [
  {
    id: "callerMatchedSynodicMonthDays",
    label: "Caller matched synodic month days",
    kind: "number",
  },
  {
    id: "callerCycleMonthCount",
    label: "Caller cycle month count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedSynodicMonthDays,
    "callerMatchedSynodicMonthDays",
  );
  bounded(input.callerCycleMonthCount, "months", 1, 10000);
  return {
    callerSarosDays:
      input.callerMatchedSynodicMonthDays * input.callerCycleMonthCount,
    callerSarosJulianYears:
      (input.callerMatchedSynodicMonthDays * input.callerCycleMonthCount) /
      365.25,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedSynodicMonthDays: 29.530588853,
  callerCycleMonthCount: 223,
} satisfies Input;
export const exampleOutput = {
  callerSarosDays: 6585.321314219001,
  callerSarosJulianYears: 18.029627143652295,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/saros-cycle-eclipse-repeat-years",
  title: "Saros Cycle Eclipse Repeat Years",
  description:
    "Saros 223 synodic-month mean timescale from explicit matched period/count, not geographic eclipse-repeat prediction or exact calendar years. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "callerSarosDays", label: "Caller saros days", kind: "number" },
    {
      id: "callerSarosJulianYears",
      label: "Caller saros julian years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedSynodicMonthDays:
        value.callerMatchedSynodicMonthDays as number,
      callerCycleMonthCount: value.callerCycleMonthCount as number,
    }),
});
export const run = tool.execute;
export default tool;
