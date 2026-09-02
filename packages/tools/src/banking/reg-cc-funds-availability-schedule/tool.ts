import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  sequence,
  sumMoney,
  money,
  businessDate,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly depositDate: string;
  readonly depositMinor: number;
  readonly callerTrancheMinor: readonly number[];
  readonly callerTrancheBusinessDayLags: readonly number[];
  readonly callerWeekendWeekdays: readonly number[];
  readonly callerHolidayDates: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerTrancheAvailabilityDates: readonly string[];
  readonly callerCumulativeAvailableMinor: readonly number[];
}>;
const inputFields = [
  { id: "depositDate", label: "Deposit date", kind: "string" },
  { id: "depositMinor", label: "Deposit minor", kind: "number" },
  {
    id: "callerTrancheMinor",
    label: "Caller tranche minor",
    kind: "numberList",
  },
  {
    id: "callerTrancheBusinessDayLags",
    label: "Caller tranche business day lags",
    kind: "numberList",
  },
  {
    id: "callerWeekendWeekdays",
    label: "Caller weekend weekdays",
    kind: "numberList",
  },
  {
    id: "callerHolidayDates",
    label: "Caller holiday dates",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.depositMinor);
  aligned(
    input.callerTrancheMinor,
    input.callerTrancheBusinessDayLags,
    "tranches",
  );
  input.callerTrancheMinor.forEach((v) => money(v));
  sequence(input.callerTrancheBusinessDayLags, "lags");
  if (sumMoney(input.callerTrancheMinor) !== input.depositMinor)
    simpleError(
      "tranches",
      "Explicit caller tranche ledger closes to deposit amount.",
    );
  let cumulative = 0;
  return {
    callerTrancheAvailabilityDates: input.callerTrancheBusinessDayLags.map(
      (v) =>
        businessDate(
          input.depositDate,
          v,
          input.callerWeekendWeekdays,
          input.callerHolidayDates,
        ),
    ),
    callerCumulativeAvailableMinor: input.callerTrancheMinor.map((v) => {
      cumulative = sumMoney([cumulative, v]);
      return cumulative;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depositDate: "2026-01-02",
  depositMinor: 1000,
  callerTrancheMinor: [200, 800],
  callerTrancheBusinessDayLags: [1, 2],
  callerWeekendWeekdays: [0, 6],
  callerHolidayDates: ["2026-01-05"],
} satisfies Input;
export const exampleOutput = {
  callerTrancheAvailabilityDates: ["2026-01-06", "2026-01-07"],
  callerCumulativeAvailableMinor: [200, 1000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/reg-cc-funds-availability-schedule",
  title: "Reg CC Funds Availability Schedule Calculator",
  description:
    "Route caller verified RegCC tranche amounts/lags through explicit holiday/weekend calendar excluding deposit day, distinct from ACH cutoff/settlement schedule; no standard threshold or exemption invented. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTrancheAvailabilityDates",
      label: "Caller tranche availability dates",
      kind: "stringList",
    },
    {
      id: "callerCumulativeAvailableMinor",
      label: "Caller cumulative available minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depositDate: value.depositDate as string,
      depositMinor: value.depositMinor as number,
      callerTrancheMinor: value.callerTrancheMinor as readonly number[],
      callerTrancheBusinessDayLags:
        value.callerTrancheBusinessDayLags as readonly number[],
      callerWeekendWeekdays: value.callerWeekendWeekdays as readonly number[],
      callerHolidayDates: value.callerHolidayDates as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
