import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  bounded,
  roundMinor,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly cdPrincipalMinor: number;
  readonly nominalAnnualRateBasisPoints: number;
  readonly callerPenaltyMonths: number;
  readonly accruedInterestMinor: number;
  readonly callerPenaltyLimitedToAccruedInterest: boolean;
}>;
export type Output = Readonly<{
  readonly uncappedContractPenaltyMinor: number;
  readonly appliedWithdrawalPenaltyMinor: number;
  readonly netWithdrawalProceedsMinor: number;
  readonly penaltyInvadesPrincipal: boolean;
}>;
const inputFields = [
  { id: "cdPrincipalMinor", label: "Cd principal minor", kind: "number" },
  {
    id: "nominalAnnualRateBasisPoints",
    label: "Nominal annual rate basis points",
    kind: "number",
  },
  { id: "callerPenaltyMonths", label: "Caller penalty months", kind: "number" },
  {
    id: "accruedInterestMinor",
    label: "Accrued interest minor",
    kind: "number",
  },
  {
    id: "callerPenaltyLimitedToAccruedInterest",
    label: "Caller penalty limited to accrued interest",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.cdPrincipalMinor, "cdPrincipalMinor");
  money(input.accruedInterestMinor, "accruedInterestMinor");
  bounded(input.nominalAnnualRateBasisPoints, "rate", 0, 10000);
  bounded(input.callerPenaltyMonths, "months", 0, 1200);
  const raw = roundMinor(
      BigInt(input.cdPrincipalMinor) *
        BigInt(input.nominalAnnualRateBasisPoints) *
        BigInt(input.callerPenaltyMonths),
      120000n,
    ),
    penalty = input.callerPenaltyLimitedToAccruedInterest
      ? Math.min(raw, input.accruedInterestMinor)
      : raw,
    net = signedSum([
      input.cdPrincipalMinor,
      input.accruedInterestMinor,
      -penalty,
    ]);
  return {
    uncappedContractPenaltyMinor: raw,
    appliedWithdrawalPenaltyMinor: penalty,
    netWithdrawalProceedsMinor: net,
    penaltyInvadesPrincipal: penalty > input.accruedInterestMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cdPrincipalMinor: 100000,
  nominalAnnualRateBasisPoints: 1000,
  callerPenaltyMonths: 3,
  accruedInterestMinor: 1000,
  callerPenaltyLimitedToAccruedInterest: true,
} satisfies Input;
export const exampleOutput = {
  uncappedContractPenaltyMinor: 2500,
  appliedWithdrawalPenaltyMinor: 1000,
  netWithdrawalProceedsMinor: 100000,
  penaltyInvadesPrincipal: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cd-early-withdrawal-penalty-months",
  title: "CD Early Withdrawal Penalty Months Lookup",
  description:
    "Calculate withdrawal penalty from caller nominal annual basis points and penalty months with explicit accrued-interest cap policy; half-up minor rounding, signed proceeds preserved, no bank-specific penalty terms or APY substitution.",
  inputs: inputFields,
  outputs: [
    {
      id: "uncappedContractPenaltyMinor",
      label: "Uncapped contract penalty minor",
      kind: "number",
    },
    {
      id: "appliedWithdrawalPenaltyMinor",
      label: "Applied withdrawal penalty minor",
      kind: "number",
    },
    {
      id: "netWithdrawalProceedsMinor",
      label: "Net withdrawal proceeds minor",
      kind: "number",
    },
    {
      id: "penaltyInvadesPrincipal",
      label: "Penalty invades principal",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      cdPrincipalMinor: value.cdPrincipalMinor as number,
      nominalAnnualRateBasisPoints:
        value.nominalAnnualRateBasisPoints as number,
      callerPenaltyMonths: value.callerPenaltyMonths as number,
      accruedInterestMinor: value.accruedInterestMinor as number,
      callerPenaltyLimitedToAccruedInterest:
        value.callerPenaltyLimitedToAccruedInterest as boolean,
    }),
});
export const run = tool.execute;
export default tool;
