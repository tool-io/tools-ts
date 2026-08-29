import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EbitdaInput = {
  readonly amortization: number;
  readonly depreciation: number;
  readonly interestExpense: number;
  readonly incomeTaxExpense: number;
  readonly netIncome: number;
};

export type EbitdaOutput = {
  readonly ebitda: number;
};

export const ebitdaExample = {
  input: {
    amortization: 5000,
    depreciation: 20000,
    incomeTaxExpense: 10000,
    interestExpense: 2000,
    netIncome: 35000,
  },
  output: { ebitda: 72000 },
} satisfies ToolExample<EbitdaInput, EbitdaOutput>;

export const calculateEbitda = (input: EbitdaInput): EbitdaOutput => {
  for (const [field, value] of Object.entries(input)) {
    if (!Number.isFinite(value))
      simpleError(
        field,
        "The amount must be a finite number.",
        "invalid_amount",
      );
  }
  const ebitda =
    input.netIncome +
    input.interestExpense +
    input.incomeTaxExpense +
    input.depreciation +
    input.amortization;
  if (!Number.isFinite(ebitda))
    simpleError(
      "netIncome",
      "EBITDA is outside the representable numeric range.",
      "result_not_finite",
    );
  return { ebitda: ebitda === 0 ? 0 : ebitda };
};

export const ebitdaTool = createSimpleTool({
  calculate: (input) =>
    calculateEbitda({
      amortization: input.amortization as number,
      depreciation: input.depreciation as number,
      incomeTaxExpense: input.incomeTaxExpense as number,
      interestExpense: input.interestExpense as number,
      netIncome: input.netIncome as number,
    }),
  description:
    "Calculate EBITDA as net income plus interest, taxes, depreciation, and amortization addbacks, all from the same period and currency.",
  id: "accounting/ebitda-from-net-income-addbacks",
  inputs: [
    {
      description: "Net income for the period.",
      id: "netIncome",
      kind: "number",
      label: "Net income",
    },
    {
      description: "Interest expense for the period.",
      id: "interestExpense",
      kind: "number",
      label: "Interest expense",
      minimum: 0,
    },
    {
      description: "Income tax expense for the period.",
      id: "incomeTaxExpense",
      kind: "number",
      label: "Income tax expense",
      minimum: 0,
    },
    {
      description: "Depreciation expense for the period.",
      id: "depreciation",
      kind: "number",
      label: "Depreciation",
      minimum: 0,
    },
    {
      description: "Amortization expense for the period.",
      id: "amortization",
      kind: "number",
      label: "Amortization",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Earnings before interest, taxes, depreciation, and amortization.",
      id: "ebitda",
      kind: "number",
      label: "EBITDA",
    },
  ],
  title: "EBITDA from Net Income Addbacks Calculator",
});
export const runEbitda = ebitdaTool.execute;
export default ebitdaTool;
