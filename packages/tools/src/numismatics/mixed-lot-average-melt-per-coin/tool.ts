import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MixedLotAverageMeltPerCoinInput = Readonly<{
  readonly totalMeltValue: number;
  readonly coinCount: number;
}>;
export type MixedLotAverageMeltPerCoinOutput = Readonly<{
  readonly averageMeltValuePerCoin: number;
}>;

export const calculateMixedLotAverageMeltPerCoin = (
  x: MixedLotAverageMeltPerCoinInput,
): MixedLotAverageMeltPerCoinOutput => {
  if (!Number.isFinite(x.totalMeltValue) || x.totalMeltValue < 0)
    simpleError("totalMeltValue", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.coinCount) ||
    x.coinCount <= 0 ||
    !Number.isSafeInteger(x.coinCount)
  )
    simpleError("coinCount", "Provide a positive whole number.");
  const averageMeltValuePerCoin = x.totalMeltValue / x.coinCount;
  if (!Number.isFinite(averageMeltValuePerCoin))
    simpleError(
      "averageMeltValuePerCoin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageMeltValuePerCoin: Object.is(averageMeltValuePerCoin, -0)
      ? 0
      : averageMeltValuePerCoin,
  };
};

export const example = {
  input: {
    totalMeltValue: 500,
    coinCount: 20,
  },
  output: { averageMeltValuePerCoin: 25 },
} satisfies ToolExample<
  MixedLotAverageMeltPerCoinInput,
  MixedLotAverageMeltPerCoinOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/mixed-lot-average-melt-per-coin",
  title: "Mixed Lot Average Melt Per Coin",
  description:
    "Average the known combined metal value over a mixed lot's coin count.",
  inputs: [
    {
      id: "totalMeltValue",
      kind: "number",
      label: "Total Melt Value",
      unit: "currency",
    },
    { id: "coinCount", kind: "number", label: "Coin Count", unit: "coins" },
  ],
  outputs: [
    {
      id: "averageMeltValuePerCoin",
      kind: "number",
      label: "Average Melt Value Per Coin",
      unit: "currency/coin",
    },
  ],
  calculate: (input) =>
    calculateMixedLotAverageMeltPerCoin({
      totalMeltValue: input.totalMeltValue as number,
      coinCount: input.coinCount as number,
    }),
});
export const runMixedLotAverageMeltPerCoin = tool.execute;
export default tool;
