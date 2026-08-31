import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly reissuedTreasuryShares: number;
  readonly costPerTreasuryShareMinor: number;
  readonly reissuePricePerShareMinor: number;
  readonly availableTreasuryApicCreditMinor: number;
}>;
export type Output = Readonly<{
  readonly cashProceedsMinor: number;
  readonly treasuryStockCostReliefMinor: number;
  readonly signedTreasuryApicChangeMinor: number;
  readonly retainedEarningsDebitMinor: number;
  readonly incomeStatementGainMinor: number;
}>;
const inputFields = [
  {
    id: "reissuedTreasuryShares",
    label: "Reissued treasury shares",
    kind: "number",
  },
  {
    id: "costPerTreasuryShareMinor",
    label: "Cost per treasury share minor",
    kind: "number",
  },
  {
    id: "reissuePricePerShareMinor",
    label: "Reissue price per share minor",
    kind: "number",
  },
  {
    id: "availableTreasuryApicCreditMinor",
    label: "Available treasury apic credit minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.costPerTreasuryShareMinor, "costPerTreasuryShareMinor");
  money(input.reissuePricePerShareMinor, "reissuePricePerShareMinor");
  money(
    input.availableTreasuryApicCreditMinor,
    "availableTreasuryApicCreditMinor",
  );
  bounded(input.reissuedTreasuryShares, "shares", 0, 1000000000);
  const cash = money(
      input.reissuedTreasuryShares * input.reissuePricePerShareMinor,
      "cash",
    ),
    cost = money(
      input.reissuedTreasuryShares * input.costPerTreasuryShareMinor,
      "cost",
    ),
    delta = integer(cash - cost, "equityDifference"),
    apic =
      delta >= 0
        ? delta
        : -Math.min(-delta, input.availableTreasuryApicCreditMinor);
  return {
    cashProceedsMinor: cash,
    treasuryStockCostReliefMinor: cost,
    signedTreasuryApicChangeMinor: apic,
    retainedEarningsDebitMinor: Math.max(
      0,
      -delta - input.availableTreasuryApicCreditMinor,
    ),
    incomeStatementGainMinor: 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reissuedTreasuryShares: 10,
  costPerTreasuryShareMinor: 100,
  reissuePricePerShareMinor: 80,
  availableTreasuryApicCreditMinor: 150,
} satisfies Input;
export const exampleOutput = {
  cashProceedsMinor: 800,
  treasuryStockCostReliefMinor: 1000,
  signedTreasuryApicChangeMinor: -150,
  retainedEarningsDebitMinor: 50,
  incomeStatementGainMinor: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/treasury-stock-cost-method-no-gain-checker",
  title: "Treasury Stock Cost Method No Gain Checker",
  description:
    "Reconcile caller treasury-stock cost-method reissue above/below cost using available treasury APIC before retained-earnings debit; no income-statement gain/loss or legal issuance/solvency determination.",
  inputs: inputFields,
  outputs: [
    { id: "cashProceedsMinor", label: "Cash proceeds minor", kind: "number" },
    {
      id: "treasuryStockCostReliefMinor",
      label: "Treasury stock cost relief minor",
      kind: "number",
    },
    {
      id: "signedTreasuryApicChangeMinor",
      label: "Signed treasury apic change minor",
      kind: "number",
    },
    {
      id: "retainedEarningsDebitMinor",
      label: "Retained earnings debit minor",
      kind: "number",
    },
    {
      id: "incomeStatementGainMinor",
      label: "Income statement gain minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      reissuedTreasuryShares: value.reissuedTreasuryShares as number,
      costPerTreasuryShareMinor: value.costPerTreasuryShareMinor as number,
      reissuePricePerShareMinor: value.reissuePricePerShareMinor as number,
      availableTreasuryApicCreditMinor:
        value.availableTreasuryApicCreditMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
