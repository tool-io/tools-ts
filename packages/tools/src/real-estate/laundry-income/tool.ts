import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaundryIncomeInput = Readonly<{
  readonly monthlyPaidCycles: number;
  readonly revenuePerCycle: number;
}>;
export type LaundryIncomeOutput = Readonly<{
  readonly monthlyIncome: number;
}>;

export const calculateLaundryIncome = (
  x: LaundryIncomeInput,
): LaundryIncomeOutput => {
  if (!Number.isFinite(x.monthlyPaidCycles) || x.monthlyPaidCycles < 0)
    simpleError("monthlyPaidCycles", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.revenuePerCycle) || x.revenuePerCycle < 0)
    simpleError("revenuePerCycle", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.monthlyPaidCycles))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const monthlyIncome = x.monthlyPaidCycles * x.revenuePerCycle;
  if (!Number.isFinite(monthlyIncome))
    simpleError(
      "monthlyIncome",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { monthlyIncome: Object.is(monthlyIncome, -0) ? 0 : monthlyIncome };
};

export const example = {
  input: {
    monthlyPaidCycles: 300,
    revenuePerCycle: 2,
  },
  output: { monthlyIncome: 600 },
} satisfies ToolExample<LaundryIncomeInput, LaundryIncomeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/laundry-income",
  title: "Laundry Income",
  description:
    "Monthly laundry revenue from paid cycles and average revenue per cycle.",
  inputs: [
    {
      id: "monthlyPaidCycles",
      kind: "number",
      label: "Monthly Paid Cycles",
      minimum: 0,
    },
    {
      id: "revenuePerCycle",
      kind: "number",
      label: "Revenue Per Cycle",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "monthlyIncome",
      kind: "number",
      label: "Monthly Income",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateLaundryIncome({
      monthlyPaidCycles: input.monthlyPaidCycles as number,
      revenuePerCycle: input.revenuePerCycle as number,
    }),
});
export const laundryIncomeTool = tool;
export const runLaundryIncome = tool.execute;
export default tool;
