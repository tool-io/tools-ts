import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly openingSalesTaxPayableMinor: number;
  readonly taxCollectedMinor: readonly number[];
  readonly taxRemittedMinor: readonly number[];
  readonly taxRefundedToCustomersMinor: readonly number[];
  readonly reportedClosingSalesTaxPayableMinor: number;
}>;
export type Output = Readonly<{
  readonly expectedClosingSalesTaxPayableMinor: number;
  readonly signedReportedMinusExpectedTaxPayableMinor: number;
}>;
const inputFields = [
  {
    id: "openingSalesTaxPayableMinor",
    label: "Opening sales tax payable minor",
    kind: "number",
  },
  { id: "taxCollectedMinor", label: "Tax collected minor", kind: "numberList" },
  { id: "taxRemittedMinor", label: "Tax remitted minor", kind: "numberList" },
  {
    id: "taxRefundedToCustomersMinor",
    label: "Tax refunded to customers minor",
    kind: "numberList",
  },
  {
    id: "reportedClosingSalesTaxPayableMinor",
    label: "Reported closing sales tax payable minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.taxCollectedMinor.forEach((v) => money(v, "taxCollectedMinor"));
  input.taxRemittedMinor.forEach((v) => money(v, "taxRemittedMinor"));
  input.taxRefundedToCustomersMinor.forEach((v) =>
    money(v, "taxRefundedToCustomersMinor"),
  );
  integer(input.openingSalesTaxPayableMinor, "openingSalesTaxPayableMinor");
  integer(
    input.reportedClosingSalesTaxPayableMinor,
    "reportedClosingSalesTaxPayableMinor",
  );
  const expected = signedSum([
    input.openingSalesTaxPayableMinor,
    sumMoney(input.taxCollectedMinor),
    -sumMoney(input.taxRemittedMinor),
    -sumMoney(input.taxRefundedToCustomersMinor),
  ]);
  return {
    expectedClosingSalesTaxPayableMinor: expected,
    signedReportedMinusExpectedTaxPayableMinor: integer(
      input.reportedClosingSalesTaxPayableMinor - expected,
      "difference",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingSalesTaxPayableMinor: 100,
  taxCollectedMinor: [50, 30],
  taxRemittedMinor: [60],
  taxRefundedToCustomersMinor: [10],
  reportedClosingSalesTaxPayableMinor: 50,
} satisfies Input;
export const exampleOutput = {
  expectedClosingSalesTaxPayableMinor: 110,
  signedReportedMinusExpectedTaxPayableMinor: -60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/sales-tax-collected-vs-remitted-reconciliation",
  title: "Sales Tax Collected vs Remitted Reconciliation Tool",
  description:
    "Reconcile actual sales-tax liability collection/remittance/refund ledger with reported closing balance, preserving possible debit balance and unexplained difference; tax rates, nexus and legal remittance dates are not supplied.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedClosingSalesTaxPayableMinor",
      label: "Expected closing sales tax payable minor",
      kind: "number",
    },
    {
      id: "signedReportedMinusExpectedTaxPayableMinor",
      label: "Signed reported minus expected tax payable minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      openingSalesTaxPayableMinor: value.openingSalesTaxPayableMinor as number,
      taxCollectedMinor: value.taxCollectedMinor as readonly number[],
      taxRemittedMinor: value.taxRemittedMinor as readonly number[],
      taxRefundedToCustomersMinor:
        value.taxRefundedToCustomersMinor as readonly number[],
      reportedClosingSalesTaxPayableMinor:
        value.reportedClosingSalesTaxPayableMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
