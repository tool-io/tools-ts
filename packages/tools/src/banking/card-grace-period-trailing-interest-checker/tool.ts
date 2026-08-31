import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  bounded,
  aligned,
  roundMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly postStatementInterestBearingBalancesMinor: readonly number[];
  readonly observedBinCivilDays: readonly number[];
  readonly callerAnnualRateBasisPoints: number;
  readonly callerAnnualDayBasis: number;
  readonly callerGraceStillEligible: boolean;
}>;
export type Output = Readonly<{
  readonly modeledTrailingInterestMinor: number;
  readonly interestBearingObservedDays: number;
  readonly interestSuppressedByCallerGraceEvidence: boolean;
}>;
const inputFields = [
  {
    id: "postStatementInterestBearingBalancesMinor",
    label: "Post statement interest bearing balances minor",
    kind: "numberList",
  },
  {
    id: "observedBinCivilDays",
    label: "Observed bin civil days",
    kind: "numberList",
  },
  {
    id: "callerAnnualRateBasisPoints",
    label: "Caller annual rate basis points",
    kind: "number",
  },
  {
    id: "callerAnnualDayBasis",
    label: "Caller annual day basis",
    kind: "number",
  },
  {
    id: "callerGraceStillEligible",
    label: "Caller grace still eligible",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.postStatementInterestBearingBalancesMinor.forEach((v) =>
    money(v, "postStatementInterestBearingBalancesMinor"),
  );
  aligned(
    input.postStatementInterestBearingBalancesMinor,
    input.observedBinCivilDays,
    "postStatementInterestBearingBalancesMinor",
  );
  bounded(input.callerAnnualRateBasisPoints, "rate", 0, 100000);
  bounded(input.callerAnnualDayBasis, "basis", 1, 366);
  input.observedBinCivilDays.forEach((v) => bounded(v, "days", 1, 3660));
  const numerator =
      input.postStatementInterestBearingBalancesMinor.reduce(
        (s, v, i) => s + BigInt(v) * BigInt(input.observedBinCivilDays[i]),
        0n,
      ) * BigInt(input.callerAnnualRateBasisPoints),
    interest = input.callerGraceStillEligible
      ? 0
      : roundMinor(numerator, BigInt(input.callerAnnualDayBasis) * 10000n);
  return {
    modeledTrailingInterestMinor: interest,
    interestBearingObservedDays: sumMoney(input.observedBinCivilDays),
    interestSuppressedByCallerGraceEvidence: input.callerGraceStillEligible,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  postStatementInterestBearingBalancesMinor: [10000, 5000],
  observedBinCivilDays: [2, 3],
  callerAnnualRateBasisPoints: 3650,
  callerAnnualDayBasis: 365,
  callerGraceStillEligible: false,
} satisfies Input;
export const exampleOutput = {
  modeledTrailingInterestMinor: 35,
  interestBearingObservedDays: 5,
  interestSuppressedByCallerGraceEvidence: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/card-grace-period-trailing-interest-checker",
  title: "Card Grace Period Trailing Interest Checker",
  description:
    "Accrue simple trailing interest over actual post-statement balance/day bins, rounding once over caller day basis and explicit remaining-grace evidence; no unobserved payment dates, compounding or issuer grace restoration inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledTrailingInterestMinor",
      label: "Modeled trailing interest minor",
      kind: "number",
    },
    {
      id: "interestBearingObservedDays",
      label: "Interest bearing observed days",
      kind: "number",
    },
    {
      id: "interestSuppressedByCallerGraceEvidence",
      label: "Interest suppressed by caller grace evidence",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      postStatementInterestBearingBalancesMinor:
        value.postStatementInterestBearingBalancesMinor as readonly number[],
      observedBinCivilDays: value.observedBinCivilDays as readonly number[],
      callerAnnualRateBasisPoints: value.callerAnnualRateBasisPoints as number,
      callerAnnualDayBasis: value.callerAnnualDayBasis as number,
      callerGraceStillEligible: value.callerGraceStillEligible as boolean,
    }),
});
export const run = tool.execute;
export default tool;
