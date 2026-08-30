import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly loanExpiryDayOrdinal: number;
  readonly callerRenewalLeadWorkingDays: number;
  readonly suppliedWorkingDayOrdinals: readonly number[];
}>;
export type Output = Readonly<{
  readonly latestModeledRenewalStartOrdinal: number;
  readonly sufficientCalendarLeadCoverage: boolean;
}>;
const inputFields = [
  {
    id: "loanExpiryDayOrdinal",
    label: "Loan expiry day ordinal",
    kind: "integer",
  },
  {
    id: "callerRenewalLeadWorkingDays",
    label: "Caller renewal lead working days",
    kind: "integer",
  },
  {
    id: "suppliedWorkingDayOrdinals",
    label: "Supplied working day ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.loanExpiryDayOrdinal, "loanExpiryDayOrdinal");
  count(input.callerRenewalLeadWorkingDays, "callerRenewalLeadWorkingDays");
  ordered(input.suppliedWorkingDayOrdinals, "calendar");
  input.suppliedWorkingDayOrdinals.forEach((v) => count(v, "calendar"));
  const days = input.suppliedWorkingDayOrdinals.filter(
      (v) => v < input.loanExpiryDayOrdinal,
    ),
    n = input.callerRenewalLeadWorkingDays,
    date =
      n === 0
        ? input.loanExpiryDayOrdinal
        : n <= days.length
          ? days[days.length - n]
          : -1;
  return {
    latestModeledRenewalStartOrdinal: date,
    sufficientCalendarLeadCoverage: date !== -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  loanExpiryDayOrdinal: 20,
  callerRenewalLeadWorkingDays: 2,
  suppliedWorkingDayOrdinals: [10, 11, 14, 15, 18, 19, 20],
} satisfies Input;
export const exampleOutput = {
  latestModeledRenewalStartOrdinal: 18,
  sufficientCalendarLeadCoverage: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/loan-renewal-lead-weeks",
  title: "Loan Renewal Lead Time Working Weeks Calculator",
  description:
    "Count backward on caller supplied working days strictly before loan expiry to resolve renewal lead policy; no fixed five-day week assumption or invented date when earlier coverage is absent.",
  inputs: inputFields,
  outputs: [
    {
      id: "latestModeledRenewalStartOrdinal",
      label: "Latest modeled renewal start ordinal",
      kind: "number",
    },
    {
      id: "sufficientCalendarLeadCoverage",
      label: "Sufficient calendar lead coverage",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      loanExpiryDayOrdinal: value.loanExpiryDayOrdinal as number,
      callerRenewalLeadWorkingDays:
        value.callerRenewalLeadWorkingDays as number,
      suppliedWorkingDayOrdinals:
        value.suppliedWorkingDayOrdinals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
