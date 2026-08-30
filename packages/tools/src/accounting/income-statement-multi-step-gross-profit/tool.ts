import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly grossSalesMinor: number;
  readonly salesReturnsMinor: number;
  readonly salesDiscountsMinor: number;
  readonly cogsMinor: number;
  readonly sellingExpensesMinor: number;
  readonly administrativeExpensesMinor: number;
  readonly otherIncomeMinor: number;
  readonly interestExpenseMinor: number;
  readonly incomeTaxExpenseMinor: number;
}>;
export type Output = Readonly<{
  readonly netSalesMinor: number;
  readonly grossProfitMinor: number;
  readonly operatingIncomeMinor: number;
  readonly pretaxIncomeMinor: number;
  readonly multiStepNetIncomeMinor: number;
}>;
const inputFields = [
  { id: "grossSalesMinor", label: "Gross sales minor", kind: "number" },
  { id: "salesReturnsMinor", label: "Sales returns minor", kind: "number" },
  { id: "salesDiscountsMinor", label: "Sales discounts minor", kind: "number" },
  { id: "cogsMinor", label: "Cogs minor", kind: "number" },
  {
    id: "sellingExpensesMinor",
    label: "Selling expenses minor",
    kind: "number",
  },
  {
    id: "administrativeExpensesMinor",
    label: "Administrative expenses minor",
    kind: "number",
  },
  { id: "otherIncomeMinor", label: "Other income minor", kind: "number" },
  {
    id: "interestExpenseMinor",
    label: "Interest expense minor",
    kind: "number",
  },
  {
    id: "incomeTaxExpenseMinor",
    label: "Income tax expense minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.grossSalesMinor, "grossSalesMinor");
  money(input.salesReturnsMinor, "salesReturnsMinor");
  money(input.salesDiscountsMinor, "salesDiscountsMinor");
  money(input.cogsMinor, "cogsMinor");
  money(input.sellingExpensesMinor, "sellingExpensesMinor");
  money(input.administrativeExpensesMinor, "administrativeExpensesMinor");
  money(input.otherIncomeMinor, "otherIncomeMinor");
  money(input.interestExpenseMinor, "interestExpenseMinor");
  money(input.incomeTaxExpenseMinor, "incomeTaxExpenseMinor");
  const sales = signedSum([
      input.grossSalesMinor,
      -input.salesReturnsMinor,
      -input.salesDiscountsMinor,
    ]),
    gross = integer(sales - input.cogsMinor, "grossProfit"),
    op = signedSum([
      gross,
      -input.sellingExpensesMinor,
      -input.administrativeExpensesMinor,
    ]),
    pretax = signedSum([
      op,
      input.otherIncomeMinor,
      -input.interestExpenseMinor,
    ]);
  return {
    netSalesMinor: sales,
    grossProfitMinor: gross,
    operatingIncomeMinor: op,
    pretaxIncomeMinor: pretax,
    multiStepNetIncomeMinor: integer(
      pretax - input.incomeTaxExpenseMinor,
      "netIncome",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grossSalesMinor: 1000,
  salesReturnsMinor: 100,
  salesDiscountsMinor: 50,
  cogsMinor: 400,
  sellingExpensesMinor: 100,
  administrativeExpensesMinor: 50,
  otherIncomeMinor: 30,
  interestExpenseMinor: 20,
  incomeTaxExpenseMinor: 10,
} satisfies Input;
export const exampleOutput = {
  netSalesMinor: 850,
  grossProfitMinor: 450,
  operatingIncomeMinor: 300,
  pretaxIncomeMinor: 310,
  multiStepNetIncomeMinor: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/income-statement-multi-step-gross-profit",
  title: "Income Statement Multi Step Gross Profit Builder",
  description:
    "Build caller classified multistep sales/returns/discounts, COGS, operating/nonoperating and tax statement; negative margins remain visible, no tax or recognition policy inferred.",
  inputs: inputFields,
  outputs: [
    { id: "netSalesMinor", label: "Net sales minor", kind: "number" },
    { id: "grossProfitMinor", label: "Gross profit minor", kind: "number" },
    {
      id: "operatingIncomeMinor",
      label: "Operating income minor",
      kind: "number",
    },
    { id: "pretaxIncomeMinor", label: "Pretax income minor", kind: "number" },
    {
      id: "multiStepNetIncomeMinor",
      label: "Multi step net income minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      grossSalesMinor: value.grossSalesMinor as number,
      salesReturnsMinor: value.salesReturnsMinor as number,
      salesDiscountsMinor: value.salesDiscountsMinor as number,
      cogsMinor: value.cogsMinor as number,
      sellingExpensesMinor: value.sellingExpensesMinor as number,
      administrativeExpensesMinor: value.administrativeExpensesMinor as number,
      otherIncomeMinor: value.otherIncomeMinor as number,
      interestExpenseMinor: value.interestExpenseMinor as number,
      incomeTaxExpenseMinor: value.incomeTaxExpenseMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
