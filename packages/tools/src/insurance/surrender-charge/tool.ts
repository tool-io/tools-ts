import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly accountValue: number;
  readonly withdrawalAmount: number;
  readonly freeWithdrawalAmount: number;
  readonly surrenderChargePercent: number;
}>;
export type Output = Readonly<{
  readonly chargeableWithdrawal: number;
  readonly surrenderCharge: number;
  readonly netWithdrawal: number;
  readonly remainingAccountValue: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.withdrawalAmount > input.accountValue)
    simpleError(
      "withdrawalAmount",
      "Withdrawal cannot exceed account value.",
      "invalid_withdrawal",
    );
  const chargeableWithdrawal = Math.max(
      0,
      input.withdrawalAmount - input.freeWithdrawalAmount,
    ),
    surrenderCharge =
      (chargeableWithdrawal * input.surrenderChargePercent) / 100;
  return {
    chargeableWithdrawal,
    surrenderCharge,
    netWithdrawal: input.withdrawalAmount - surrenderCharge,
    remainingAccountValue: input.accountValue - input.withdrawalAmount,
  };
};

export const exampleInput = {
  accountValue: 100000,
  withdrawalAmount: 20000,
  freeWithdrawalAmount: 10000,
  surrenderChargePercent: 5,
} satisfies Input;
export const exampleOutput = {
  chargeableWithdrawal: 10000,
  surrenderCharge: 500,
  netWithdrawal: 19500,
  remainingAccountValue: 80000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      accountValue: input.accountValue as number,
      withdrawalAmount: input.withdrawalAmount as number,
      freeWithdrawalAmount: input.freeWithdrawalAmount as number,
      surrenderChargePercent: input.surrenderChargePercent as number,
    }),
  description:
    "Calculate annuity surrender charge after a free-withdrawal allowance.",
  id: "insurance/surrender-charge",
  inputs: [
    {
      id: "accountValue",
      label: "Annuity account value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "withdrawalAmount",
      label: "Withdrawal amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "freeWithdrawalAmount",
      label: "Free withdrawal amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "surrenderChargePercent",
      label: "Surrender charge rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "chargeableWithdrawal",
      label: "Chargeable withdrawal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "surrenderCharge",
      label: "Surrender charge",
      kind: "number",
      minimum: 0,
    },
    {
      id: "netWithdrawal",
      label: "Net withdrawal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "remainingAccountValue",
      label: "Remaining account value",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Surrender Charge",
});

export const run = tool.execute;
export default tool;
