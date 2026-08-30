import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  aligned,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly openingPtoHours: readonly number[];
  readonly earnedPtoHours: readonly number[];
  readonly usedPtoHours: readonly number[];
  readonly hourlyPayMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedClosingPtoHours: readonly number[];
  readonly unfundedAdvanceHours: readonly number[];
  readonly closingPositivePtoLiabilityMinor: number;
}>;
const inputFields = [
  { id: "openingPtoHours", label: "Opening pto hours", kind: "numberList" },
  { id: "earnedPtoHours", label: "Earned pto hours", kind: "numberList" },
  { id: "usedPtoHours", label: "Used pto hours", kind: "numberList" },
  { id: "hourlyPayMinor", label: "Hourly pay minor", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.hourlyPayMinor.forEach((v) => money(v, "hourlyPayMinor"));
  input.openingPtoHours.forEach((v) => integer(v, "openingPtoHours"));
  input.earnedPtoHours.forEach((v) => integer(v, "earnedPtoHours"));
  input.usedPtoHours.forEach((v) => integer(v, "usedPtoHours"));
  aligned(input.openingPtoHours, input.earnedPtoHours, "openingPtoHours");
  aligned(input.openingPtoHours, input.usedPtoHours, "openingPtoHours");
  aligned(input.openingPtoHours, input.hourlyPayMinor, "openingPtoHours");
  if (
    input.openingPtoHours.some((v) => v < 0) ||
    input.earnedPtoHours.some((v) => v < 0) ||
    input.usedPtoHours.some((v) => v < 0)
  )
    simpleError(
      "hours",
      "Nonnegative whole-hour observed opening/earned/used ledger required.",
    );
  const hours = input.openingPtoHours.map((v, i) =>
    signedSum([v, input.earnedPtoHours[i], -input.usedPtoHours[i]]),
  );
  return {
    signedClosingPtoHours: hours,
    unfundedAdvanceHours: hours.map((v) => Math.max(0, -v)),
    closingPositivePtoLiabilityMinor: sumMoney(
      hours.map((v, i) =>
        money(Math.max(0, v) * input.hourlyPayMinor[i], "liability"),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingPtoHours: [10, 5],
  earnedPtoHours: [2, 0],
  usedPtoHours: [3, 6],
  hourlyPayMinor: [100, 200],
} satisfies Input;
export const exampleOutput = {
  signedClosingPtoHours: [9, -1],
  unfundedAdvanceHours: [0, 1],
  closingPositivePtoLiabilityMinor: 900,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/pto-accrual-liability-hours-rate-update",
  title: "PTO Accrual Liability Hours Rate Update Calculator",
  description:
    "Roll forward actual whole-hour PTO and caller pay rates, retaining advanced leave deficits while valuing only positive accrued hours; no vesting, forfeiture, tax, salary burden or legal payout entitlement inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedClosingPtoHours",
      label: "Signed closing pto hours",
      kind: "numberList",
    },
    {
      id: "unfundedAdvanceHours",
      label: "Unfunded advance hours",
      kind: "numberList",
    },
    {
      id: "closingPositivePtoLiabilityMinor",
      label: "Closing positive pto liability minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      openingPtoHours: value.openingPtoHours as readonly number[],
      earnedPtoHours: value.earnedPtoHours as readonly number[],
      usedPtoHours: value.usedPtoHours as readonly number[],
      hourlyPayMinor: value.hourlyPayMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
