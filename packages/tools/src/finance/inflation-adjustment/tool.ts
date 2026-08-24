import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InflationAdjustmentInput = {
  readonly amount: number;
  readonly annualInflationRatePercent: number;
  readonly years: number;
};

export type InflationAdjustmentOutput = {
  readonly inflatedAmount: number;
  readonly cumulativeInflationPercent: number;
};

export const calculateInflationAdjustment = (
  input: InflationAdjustmentInput,
): InflationAdjustmentOutput => {
  const growthFactor =
    (1 + input.annualInflationRatePercent / 100) ** input.years;
  const inflatedAmount = input.amount * growthFactor;
  const cumulativeInflationPercent = (growthFactor - 1) * 100;
  if (
    ![growthFactor, inflatedAmount, cumulativeInflationPercent].every(
      Number.isFinite,
    )
  )
    return simpleError(
      "years",
      "The adjustment overflows finite numbers for these inputs.",
      "overflow",
    );
  return {
    inflatedAmount,
    cumulativeInflationPercent,
  };
};

export const inflationAdjustmentExample = {
  input: {
    amount: 1000,
    annualInflationRatePercent: 3,
    years: 10,
  },
  output: {
    inflatedAmount: 1343.9163793441223,
    cumulativeInflationPercent: 34.39163793441222,
  },
} satisfies ToolExample<InflationAdjustmentInput, InflationAdjustmentOutput>;

export const inflationAdjustmentTool = createSimpleTool({
  id: "finance/inflation-adjustment",
  title: "Inflation Adjustment Calculator",
  description:
    "Project the inflated cost of an amount after a fixed annual inflation rate over a number of years using compound growth.",
  inputs: [
    {
      description: "Money amount in today's currency units.",
      id: "amount",
      kind: "number",
      label: "Amount",
      minimum: 0,
      unit: "currency",
    },
    {
      description: "Fixed annual inflation rate in percent.",
      id: "annualInflationRatePercent",
      kind: "number",
      label: "Annual inflation rate",
      minimum: -100,
    },
    {
      description: "Number of years to project.",
      id: "years",
      kind: "number",
      label: "Years",
      minimum: 0,
      unit: "a",
    },
  ],
  outputs: [
    {
      description: "Amount after compound inflation, in future currency units.",
      id: "inflatedAmount",
      kind: "number",
      label: "Inflated amount",
      unit: "currency",
    },
    {
      description: "Total percent change of the amount over the period.",
      id: "cumulativeInflationPercent",
      kind: "number",
      label: "Cumulative inflation",
    },
  ],
  calculate: (input) =>
    calculateInflationAdjustment({
      amount: input.amount as number,
      annualInflationRatePercent: input.annualInflationRatePercent as number,
      years: input.years as number,
    }),
});

export const runInflationAdjustment = inflationAdjustmentTool.execute;
export default inflationAdjustmentTool;
