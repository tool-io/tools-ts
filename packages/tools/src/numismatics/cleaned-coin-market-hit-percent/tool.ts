import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CleanedCoinMarketHitPercentInput = Readonly<{
  readonly cleanedCoinPrice: number;
  readonly originalCoinPrice: number;
}>;
export type CleanedCoinMarketHitPercentOutput = Readonly<{
  readonly pricePenaltyPercent: number;
}>;

export const calculateCleanedCoinMarketHitPercent = (
  x: CleanedCoinMarketHitPercentInput,
): CleanedCoinMarketHitPercentOutput => {
  if (!Number.isFinite(x.cleanedCoinPrice) || x.cleanedCoinPrice < 0)
    simpleError("cleanedCoinPrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.originalCoinPrice) || x.originalCoinPrice <= 0)
    simpleError("originalCoinPrice", "Provide a finite positive number.");
  if (x.cleanedCoinPrice > x.originalCoinPrice)
    simpleError(
      "cleanedCoinPrice",
      "Cleaned-coin price cannot exceed the comparison price for a penalty estimate.",
    );
  const pricePenaltyPercent =
    ((x.originalCoinPrice - x.cleanedCoinPrice) / x.originalCoinPrice) * 100;
  if (!Number.isFinite(pricePenaltyPercent))
    simpleError(
      "pricePenaltyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pricePenaltyPercent: Object.is(pricePenaltyPercent, -0)
      ? 0
      : pricePenaltyPercent,
  };
};

export const example = {
  input: {
    cleanedCoinPrice: 60,
    originalCoinPrice: 100,
  },
  output: { pricePenaltyPercent: 40 },
} satisfies ToolExample<
  CleanedCoinMarketHitPercentInput,
  CleanedCoinMarketHitPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/cleaned-coin-market-hit-percent",
  title: "Cleaned Coin Market Hit Percent",
  description:
    "Measure a cleaning-related observed price difference using otherwise comparable coins; not a universal market discount.",
  inputs: [
    {
      id: "cleanedCoinPrice",
      kind: "number",
      label: "Cleaned Coin Price",
      unit: "currency",
    },
    {
      id: "originalCoinPrice",
      kind: "number",
      label: "Original Coin Price",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "pricePenaltyPercent",
      kind: "number",
      label: "Price Penalty Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateCleanedCoinMarketHitPercent({
      cleanedCoinPrice: input.cleanedCoinPrice as number,
      originalCoinPrice: input.originalCoinPrice as number,
    }),
});
export const runCleanedCoinMarketHitPercent = tool.execute;
export default tool;
