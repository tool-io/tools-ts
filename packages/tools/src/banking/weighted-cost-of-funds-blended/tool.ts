import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
  bounded,
  aligned,
  roundMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly fundingBalanceMinor: readonly number[];
  readonly callerNominalAnnualCostBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalObservedFundingMinor: number;
  readonly roundedAnnualFundingCostMinor: number;
  readonly blendedNominalAnnualCostPercent: number;
}>;
const inputFields = [
  {
    id: "fundingBalanceMinor",
    label: "Funding balance minor",
    kind: "numberList",
  },
  {
    id: "callerNominalAnnualCostBasisPoints",
    label: "Caller nominal annual cost basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fundingBalanceMinor.forEach((v) => money(v, "fundingBalanceMinor"));
  aligned(
    input.fundingBalanceMinor,
    input.callerNominalAnnualCostBasisPoints,
    "fundingBalanceMinor",
  );
  input.callerNominalAnnualCostBasisPoints.forEach((v) =>
    bounded(v, "rate", 0, 100000),
  );
  const total = positive(sumMoney(input.fundingBalanceMinor), "funding"),
    numerator = input.fundingBalanceMinor.reduce(
      (s, v, i) =>
        s + BigInt(v) * BigInt(input.callerNominalAnnualCostBasisPoints[i]),
      0n,
    );
  return {
    totalObservedFundingMinor: total,
    roundedAnnualFundingCostMinor: roundMinor(numerator, 10000n),
    blendedNominalAnnualCostPercent: Number(numerator) / (100 * total),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fundingBalanceMinor: [1000, 3000],
  callerNominalAnnualCostBasisPoints: [100, 500],
} satisfies Input;
export const exampleOutput = {
  totalObservedFundingMinor: 4000,
  roundedAnnualFundingCostMinor: 160,
  blendedNominalAnnualCostPercent: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/weighted-cost-of-funds-blended",
  title: "Weighted Cost Of Funds Blended Calculator",
  description:
    "Reconcile actual funding balances and caller nominal annual costs, rounding annual cost once while exposing balance-weighted nominal rate; no effective-APY compounding, currency conversion or funding eligibility inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalObservedFundingMinor",
      label: "Total observed funding minor",
      kind: "number",
    },
    {
      id: "roundedAnnualFundingCostMinor",
      label: "Rounded annual funding cost minor",
      kind: "number",
    },
    {
      id: "blendedNominalAnnualCostPercent",
      label: "Blended nominal annual cost percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fundingBalanceMinor: value.fundingBalanceMinor as readonly number[],
      callerNominalAnnualCostBasisPoints:
        value.callerNominalAnnualCostBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
