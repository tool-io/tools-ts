import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GoldSilverRatioCalculatorInput = Readonly<{
  readonly goldPricePerTroyOunce: number;
  readonly silverPricePerTroyOunce: number;
}>;
export type GoldSilverRatioCalculatorOutput = Readonly<{
  readonly goldSilverRatio: number;
}>;

export const calculateGoldSilverRatioCalculator = (
  x: GoldSilverRatioCalculatorInput,
): GoldSilverRatioCalculatorOutput => {
  if (!Number.isFinite(x.goldPricePerTroyOunce) || x.goldPricePerTroyOunce < 0)
    simpleError(
      "goldPricePerTroyOunce",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.silverPricePerTroyOunce) ||
    x.silverPricePerTroyOunce <= 0
  )
    simpleError("silverPricePerTroyOunce", "Provide a finite positive number.");
  const goldSilverRatio = x.goldPricePerTroyOunce / x.silverPricePerTroyOunce;
  if (!Number.isFinite(goldSilverRatio))
    simpleError(
      "goldSilverRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    goldSilverRatio: Object.is(goldSilverRatio, -0) ? 0 : goldSilverRatio,
  };
};

export const example = {
  input: {
    goldPricePerTroyOunce: 2400,
    silverPricePerTroyOunce: 30,
  },
  output: { goldSilverRatio: 80 },
} satisfies ToolExample<
  GoldSilverRatioCalculatorInput,
  GoldSilverRatioCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/gold-silver-ratio-calculator",
  title: "Gold Silver Ratio Calculator",
  description:
    "Divide same-currency, same-time gold and silver spot quotes per troy ounce.",
  inputs: [
    {
      id: "goldPricePerTroyOunce",
      kind: "number",
      label: "Gold Price Per Troy Ounce",
      unit: "currency/oz t",
    },
    {
      id: "silverPricePerTroyOunce",
      kind: "number",
      label: "Silver Price Per Troy Ounce",
      unit: "currency/oz t",
    },
  ],
  outputs: [
    {
      id: "goldSilverRatio",
      kind: "number",
      label: "Gold Silver Ratio",
      unit: "ratio",
    },
  ],
  calculate: (input) =>
    calculateGoldSilverRatioCalculator({
      goldPricePerTroyOunce: input.goldPricePerTroyOunce as number,
      silverPricePerTroyOunce: input.silverPricePerTroyOunce as number,
    }),
});
export const runGoldSilverRatioCalculator = tool.execute;
export default tool;
