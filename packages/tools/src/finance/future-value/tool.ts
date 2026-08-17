import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FutureValueInput = {
  readonly annualRatePercent: number;
  readonly compoundingPerYear?: number;
  readonly presentValue: number;
  readonly years: number;
};

export type FutureValueOutput = {
  readonly futureValue: number;
};

export const futureValueExample = {
  input: { annualRatePercent: 10, presentValue: 100, years: 2 },
  output: { futureValue: 121 },
} satisfies ToolExample<FutureValueInput, FutureValueOutput>;

export const calculateFutureValue = (
  input: FutureValueInput,
): FutureValueOutput => {
  const rate = input.annualRatePercent / 100;
  const periodsPerYear = input.compoundingPerYear ?? 1;
  if (periodsPerYear < 1 || !Number.isInteger(periodsPerYear))
    simpleError(
      "compoundingPerYear",
      "Compounding periods must be a positive integer.",
      "invalid_periods",
    );
  const growthFactor = 1 + rate / periodsPerYear;
  if (growthFactor <= 0)
    simpleError(
      "annualRatePercent",
      "The rate is too negative for this compounding frequency.",
      "invalid_rate",
    );
  if (input.years < 0)
    simpleError("years", "Years cannot be negative.", "invalid_years");
  const futureValue =
    input.presentValue *
    growthFactor ** (periodsPerYear * input.years);
  return { futureValue: roundStatistic(futureValue) };
};

export const futureValueTool = createSimpleTool({
  calculate: (input) =>
    calculateFutureValue(input as unknown as FutureValueInput),
  description:
    "Project the future value of a lump sum under compound interest.",
  id: "finance/future-value",
  inputs: [
    {
      description: "Invested amount today.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
    {
      description: "Nominal annual interest or growth rate.",
      id: "annualRatePercent",
      kind: "number",
      label: "Annual rate",
      unit: "%",
    },
    {
      description: "Growth horizon in years.",
      id: "years",
      kind: "number",
      label: "Years",
      minimum: 0,
    },
    {
      default: 1,
      description:
        "Compounding periods per year, for example four for quarterly.",
      id: "compoundingPerYear",
      kind: "integer",
      label: "Compounding per year",
      maximum: 365,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Projected balance after the horizon.",
      id: "futureValue",
      kind: "number",
      label: "Future value",
    },
  ],
  title: "Future Value Calculator",
});
export const runFutureValue = futureValueTool.execute;
export default futureValueTool;
