import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BreakevenRatioInput = Readonly<{
  readonly operatingExpenses: number;
  readonly annualDebtService: number;
  readonly effectiveGrossIncome: number;
}>;
export type BreakevenRatioOutput = Readonly<{
  readonly breakevenRatioPercent: number;
}>;

export const calculateBreakevenRatio = (
  x: BreakevenRatioInput,
): BreakevenRatioOutput => {
  if (!Number.isFinite(x.operatingExpenses) || x.operatingExpenses < 0)
    simpleError("operatingExpenses", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.annualDebtService) || x.annualDebtService < 0)
    simpleError("annualDebtService", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.effectiveGrossIncome) || x.effectiveGrossIncome <= 0)
    simpleError("effectiveGrossIncome", "Provide a finite positive number.");
  const breakevenRatioPercent =
    (100 * (x.operatingExpenses + x.annualDebtService)) /
    x.effectiveGrossIncome;
  if (!Number.isFinite(breakevenRatioPercent))
    simpleError(
      "breakevenRatioPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    breakevenRatioPercent: Object.is(breakevenRatioPercent, -0)
      ? 0
      : breakevenRatioPercent,
  };
};

export const example = {
  input: {
    operatingExpenses: 40000,
    annualDebtService: 30000,
    effectiveGrossIncome: 100000,
  },
  output: { breakevenRatioPercent: 70 },
} satisfies ToolExample<BreakevenRatioInput, BreakevenRatioOutput>;

export const tool = createSimpleTool({
  id: "real-estate/breakeven-ratio",
  title: "Breakeven Ratio",
  description:
    "Break-even ratio for a property: operating expenses plus debt service divided by effective gross income.",
  inputs: [
    {
      id: "operatingExpenses",
      kind: "number",
      label: "Operating Expenses",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "annualDebtService",
      kind: "number",
      label: "Annual Debt Service",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "effectiveGrossIncome",
      kind: "number",
      label: "Effective Gross Income",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "breakevenRatioPercent",
      kind: "number",
      label: "Breakeven Ratio Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateBreakevenRatio({
      operatingExpenses: input.operatingExpenses as number,
      annualDebtService: input.annualDebtService as number,
      effectiveGrossIncome: input.effectiveGrossIncome as number,
    }),
});
export const breakevenRatioTool = tool;
export const runBreakevenRatio = tool.execute;
export default tool;
