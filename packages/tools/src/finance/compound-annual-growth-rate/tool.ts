import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CompoundAnnualGrowthRateInput = {
  readonly beginValue: number;
  readonly endValue: number;
  readonly years: number;
};

export type CompoundAnnualGrowthRateOutput = {
  readonly cagrPercent: number;
};

export const compoundAnnualGrowthRateExample = {
  input: { beginValue: 100, endValue: 121, years: 2 },
  output: { cagrPercent: 10 },
} satisfies ToolExample<
  CompoundAnnualGrowthRateInput,
  CompoundAnnualGrowthRateOutput
>;

export const calculateCompoundAnnualGrowthRate = (
  input: CompoundAnnualGrowthRateInput,
): CompoundAnnualGrowthRateOutput => {
  const { beginValue, endValue, years } = input;
  if (beginValue <= 0 || endValue <= 0)
    simpleError(
      "beginValue",
      "Both values must be positive.",
      "invalid_values",
    );
  if (years <= 0)
    simpleError("years", "Years must be positive.", "invalid_years");
  const cagr = (endValue / beginValue) ** (1 / years) - 1;
  return { cagrPercent: roundStatistic(cagr * 100) };
};

export const compoundAnnualGrowthRateTool = createSimpleTool({
  calculate: (input) =>
    calculateCompoundAnnualGrowthRate(
      input as unknown as CompoundAnnualGrowthRateInput,
    ),
  description:
    "Compute the compound annual growth rate between two positive values.",
  id: "finance/compound-annual-growth-rate",
  inputs: [
    {
      description: "Starting value of the period.",
      id: "beginValue",
      kind: "number",
      label: "Begin value",
    },
    {
      description: "Ending value of the period.",
      id: "endValue",
      kind: "number",
      label: "End value",
    },
    {
      description: "Duration of the period in years.",
      id: "years",
      kind: "number",
      label: "Years",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Smoothed annual growth rate over the period.",
      format: "percent",
      id: "cagrPercent",
      kind: "number",
      label: "CAGR",
      unit: "%",
    },
  ],
  title: "Compound Annual Growth Rate Calculator",
});
export const runCompoundAnnualGrowthRate =
  compoundAnnualGrowthRateTool.execute;
export default compoundAnnualGrowthRateTool;
