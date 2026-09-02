import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  roundMinor,
  dateDay,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerDrawPhaseStart: string;
  readonly callerDrawPhaseEndExclusive: string;
  readonly asOfDate: string;
  readonly observedHelocDrawnPrincipalMinor: number;
  readonly callerAnnualRateBps: number;
  readonly callerAccrualDays: number;
  readonly callerDayCountYear: number;
  readonly observedStatementInterestMinor: number;
}>;
export type Output = Readonly<{
  readonly inCallerInterestOnlyPhase: boolean;
  readonly callerModeledAccruedInterestMinor: number;
  readonly signedStatementMinusModeledInterestMinor: number;
}>;
const inputFields = [
  {
    id: "callerDrawPhaseStart",
    label: "Caller draw phase start",
    kind: "string",
  },
  {
    id: "callerDrawPhaseEndExclusive",
    label: "Caller draw phase end exclusive",
    kind: "string",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
  {
    id: "observedHelocDrawnPrincipalMinor",
    label: "Observed heloc drawn principal minor",
    kind: "number",
  },
  {
    id: "callerAnnualRateBps",
    label: "Caller annual rate bps",
    kind: "number",
  },
  { id: "callerAccrualDays", label: "Caller accrual days", kind: "number" },
  { id: "callerDayCountYear", label: "Caller day count year", kind: "number" },
  {
    id: "observedStatementInterestMinor",
    label: "Observed statement interest minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const start = dateDay(input.callerDrawPhaseStart),
    end = dateDay(input.callerDrawPhaseEndExclusive),
    asOf = dateDay(input.asOfDate);
  if (end <= start)
    simpleError("phase", "Explicit nonempty half-open draw phase.");
  money(input.observedHelocDrawnPrincipalMinor);
  money(input.observedStatementInterestMinor);
  bounded(input.callerAnnualRateBps, "rate", 0, 100000);
  bounded(input.callerAccrualDays, "days", 0, 3660);
  bounded(input.callerDayCountYear, "year", 1, 3660);
  const interest = roundMinor(
    BigInt(input.observedHelocDrawnPrincipalMinor) *
      BigInt(input.callerAnnualRateBps) *
      BigInt(input.callerAccrualDays),
    10000n * BigInt(input.callerDayCountYear),
  );
  return {
    inCallerInterestOnlyPhase: asOf >= start && asOf < end,
    callerModeledAccruedInterestMinor: interest,
    signedStatementMinusModeledInterestMinor:
      input.observedStatementInterestMinor - interest,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDrawPhaseStart: "2026-01-01",
  callerDrawPhaseEndExclusive: "2027-01-01",
  asOfDate: "2026-06-01",
  observedHelocDrawnPrincipalMinor: 1000,
  callerAnnualRateBps: 1200,
  callerAccrualDays: 30,
  callerDayCountYear: 360,
  observedStatementInterestMinor: 100,
} satisfies Input;
export const exampleOutput = {
  inCallerInterestOnlyPhase: true,
  callerModeledAccruedInterestMinor: 10,
  signedStatementMinusModeledInterestMinor: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/heloc-interest-only-phase-checker",
  title: "HELOC Interest Only Phase Checker",
  description:
    "Check caller HELOC half-open draw phase and audit actual statement against explicit simple day-count interest, phase status does not establish allowed draw or contractual minimum. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "inCallerInterestOnlyPhase",
      label: "In caller interest only phase",
      kind: "boolean",
    },
    {
      id: "callerModeledAccruedInterestMinor",
      label: "Caller modeled accrued interest minor",
      kind: "number",
    },
    {
      id: "signedStatementMinusModeledInterestMinor",
      label: "Signed statement minus modeled interest minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDrawPhaseStart: value.callerDrawPhaseStart as string,
      callerDrawPhaseEndExclusive: value.callerDrawPhaseEndExclusive as string,
      asOfDate: value.asOfDate as string,
      observedHelocDrawnPrincipalMinor:
        value.observedHelocDrawnPrincipalMinor as number,
      callerAnnualRateBps: value.callerAnnualRateBps as number,
      callerAccrualDays: value.callerAccrualDays as number,
      callerDayCountYear: value.callerDayCountYear as number,
      observedStatementInterestMinor:
        value.observedStatementInterestMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
