import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AverageCostBasisCalculatorInput = Readonly<{
  readonly totalAcquisitionCost: number;
  readonly coinCount: number;
}>;
export type AverageCostBasisCalculatorOutput = Readonly<{
  readonly averageCostBasisPerCoin: number;
}>;

export const calculateAverageCostBasisCalculator = (
  x: AverageCostBasisCalculatorInput,
): AverageCostBasisCalculatorOutput => {
  if (!Number.isFinite(x.totalAcquisitionCost) || x.totalAcquisitionCost < 0)
    simpleError("totalAcquisitionCost", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.coinCount) ||
    x.coinCount <= 0 ||
    !Number.isSafeInteger(x.coinCount)
  )
    simpleError("coinCount", "Provide a positive whole number.");
  const averageCostBasisPerCoin = x.totalAcquisitionCost / x.coinCount;
  if (!Number.isFinite(averageCostBasisPerCoin))
    simpleError(
      "averageCostBasisPerCoin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageCostBasisPerCoin: Object.is(averageCostBasisPerCoin, -0)
      ? 0
      : averageCostBasisPerCoin,
  };
};

export const example = {
  input: {
    totalAcquisitionCost: 500,
    coinCount: 20,
  },
  output: { averageCostBasisPerCoin: 25 },
} satisfies ToolExample<
  AverageCostBasisCalculatorInput,
  AverageCostBasisCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/average-cost-basis-calculator",
  title: "Average Cost Basis Calculator",
  description:
    "Average a lot's acquisition cost over its coins; individual coins may have different actual bases.",
  inputs: [
    {
      id: "totalAcquisitionCost",
      kind: "number",
      label: "Total Acquisition Cost",
      unit: "currency",
    },
    { id: "coinCount", kind: "number", label: "Coin Count", unit: "coins" },
  ],
  outputs: [
    {
      id: "averageCostBasisPerCoin",
      kind: "number",
      label: "Average Cost Basis Per Coin",
      unit: "currency/coin",
    },
  ],
  calculate: (input) =>
    calculateAverageCostBasisCalculator({
      totalAcquisitionCost: input.totalAcquisitionCost as number,
      coinCount: input.coinCount as number,
    }),
});
export const runAverageCostBasisCalculator = tool.execute;
export default tool;
