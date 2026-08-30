import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlatinumGoldRatioCalculatorInput = Readonly<{
  readonly platinumPricePerTroyOunce: number;
  readonly goldPricePerTroyOunce: number;
}>;
export type PlatinumGoldRatioCalculatorOutput = Readonly<{
  readonly platinumGoldRatio: number;
}>;

export const calculatePlatinumGoldRatioCalculator = (
  x: PlatinumGoldRatioCalculatorInput,
): PlatinumGoldRatioCalculatorOutput => {
  if (
    !Number.isFinite(x.platinumPricePerTroyOunce) ||
    x.platinumPricePerTroyOunce < 0
  )
    simpleError(
      "platinumPricePerTroyOunce",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.goldPricePerTroyOunce) || x.goldPricePerTroyOunce <= 0)
    simpleError("goldPricePerTroyOunce", "Provide a finite positive number.");
  const platinumGoldRatio =
    x.platinumPricePerTroyOunce / x.goldPricePerTroyOunce;
  if (!Number.isFinite(platinumGoldRatio))
    simpleError(
      "platinumGoldRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    platinumGoldRatio: Object.is(platinumGoldRatio, -0) ? 0 : platinumGoldRatio,
  };
};

export const example = {
  input: {
    platinumPricePerTroyOunce: 1000,
    goldPricePerTroyOunce: 2000,
  },
  output: { platinumGoldRatio: 0.5 },
} satisfies ToolExample<
  PlatinumGoldRatioCalculatorInput,
  PlatinumGoldRatioCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/platinum-gold-ratio-calculator",
  title: "Platinum Gold Ratio Calculator",
  description:
    "Divide same-currency, same-time platinum and gold quotes per troy ounce.",
  inputs: [
    {
      id: "platinumPricePerTroyOunce",
      kind: "number",
      label: "Platinum Price Per Troy Ounce",
      unit: "currency/oz t",
    },
    {
      id: "goldPricePerTroyOunce",
      kind: "number",
      label: "Gold Price Per Troy Ounce",
      unit: "currency/oz t",
    },
  ],
  outputs: [
    {
      id: "platinumGoldRatio",
      kind: "number",
      label: "Platinum Gold Ratio",
      unit: "ratio",
    },
  ],
  calculate: (input) =>
    calculatePlatinumGoldRatioCalculator({
      platinumPricePerTroyOunce: input.platinumPricePerTroyOunce as number,
      goldPricePerTroyOunce: input.goldPricePerTroyOunce as number,
    }),
});
export const runPlatinumGoldRatioCalculator = tool.execute;
export default tool;
