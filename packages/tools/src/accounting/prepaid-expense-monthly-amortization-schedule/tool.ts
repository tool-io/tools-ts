import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  bounded,
  allocateMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly prepaidOpeningCostMinor: number;
  readonly serviceMonthCount: number;
}>;
export type Output = Readonly<{
  readonly monthlyAmortizationMinor: readonly number[];
  readonly prepaidClosingBalancesMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "prepaidOpeningCostMinor",
    label: "Prepaid opening cost minor",
    kind: "number",
  },
  { id: "serviceMonthCount", label: "Service month count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.prepaidOpeningCostMinor, "prepaidOpeningCostMinor");
  bounded(input.serviceMonthCount, "months", 1, 1200);
  const amounts = allocateMinor(
    input.prepaidOpeningCostMinor,
    Array(input.serviceMonthCount).fill(1),
  );
  let balance = input.prepaidOpeningCostMinor;
  return {
    monthlyAmortizationMinor: amounts,
    prepaidClosingBalancesMinor: amounts.map((v) => (balance -= v)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  prepaidOpeningCostMinor: 100,
  serviceMonthCount: 3,
} satisfies Input;
export const exampleOutput = {
  monthlyAmortizationMinor: [34, 33, 33],
  prepaidClosingBalancesMinor: [66, 33, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/prepaid-expense-monthly-amortization-schedule",
  title: "Prepaid Expense Monthly Amortization Schedule Generator",
  description:
    "Generate finite equal-month prepaid schedule in exact integer minor units, distributing remainder by largest-remainder earliest-month tie rule; equal service months are caller assumptions, no partial-month dates or tax rules.",
  inputs: inputFields,
  outputs: [
    {
      id: "monthlyAmortizationMinor",
      label: "Monthly amortization minor",
      kind: "numberList",
    },
    {
      id: "prepaidClosingBalancesMinor",
      label: "Prepaid closing balances minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      prepaidOpeningCostMinor: value.prepaidOpeningCostMinor as number,
      serviceMonthCount: value.serviceMonthCount as number,
    }),
});
export const run = tool.execute;
export default tool;
