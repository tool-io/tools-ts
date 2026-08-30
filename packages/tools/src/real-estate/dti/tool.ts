import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DtiInput = Readonly<{
  readonly monthlyDebtPayments: number;
  readonly grossMonthlyIncome: number;
}>;
export type DtiOutput = Readonly<{
  readonly dtiPercent: number;
}>;

export const calculateDti = (x: DtiInput): DtiOutput => {
  if (!Number.isFinite(x.monthlyDebtPayments) || x.monthlyDebtPayments < 0)
    simpleError("monthlyDebtPayments", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.grossMonthlyIncome) || x.grossMonthlyIncome <= 0)
    simpleError("grossMonthlyIncome", "Provide a finite positive number.");
  const dtiPercent = (100 * x.monthlyDebtPayments) / x.grossMonthlyIncome;
  if (!Number.isFinite(dtiPercent))
    simpleError(
      "dtiPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dtiPercent: Object.is(dtiPercent, -0) ? 0 : dtiPercent };
};

export const example = {
  input: {
    monthlyDebtPayments: 2000,
    grossMonthlyIncome: 6000,
  },
  output: { dtiPercent: 33.333333333333336 },
} satisfies ToolExample<DtiInput, DtiOutput>;

export const tool = createSimpleTool({
  id: "real-estate/dti",
  title: "Dti",
  description:
    "Debt-to-income percentage: total monthly debt payments divided by gross monthly income.",
  inputs: [
    {
      id: "monthlyDebtPayments",
      kind: "number",
      label: "Monthly Debt Payments",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "grossMonthlyIncome",
      kind: "number",
      label: "Gross Monthly Income",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dtiPercent", kind: "number", label: "Dti Percent", unit: "percent" },
  ],
  calculate: (input) =>
    calculateDti({
      monthlyDebtPayments: input.monthlyDebtPayments as number,
      grossMonthlyIncome: input.grossMonthlyIncome as number,
    }),
});
export const dtiTool = tool;
export const runDti = tool.execute;
export default tool;
