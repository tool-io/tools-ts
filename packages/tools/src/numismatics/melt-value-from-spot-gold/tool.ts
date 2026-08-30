import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MeltValueFromSpotGoldInput = Readonly<{
  readonly grossWeightGrams: number;
  readonly goldFinenessPerMille: number;
  readonly spotPricePerTroyOunce: number;
}>;
export type MeltValueFromSpotGoldOutput = Readonly<{
  readonly goldMeltValue: number;
}>;

export const calculateMeltValueFromSpotGold = (
  x: MeltValueFromSpotGoldInput,
): MeltValueFromSpotGoldOutput => {
  if (!Number.isFinite(x.grossWeightGrams) || x.grossWeightGrams < 0)
    simpleError("grossWeightGrams", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.goldFinenessPerMille) ||
    x.goldFinenessPerMille < 0 ||
    x.goldFinenessPerMille > 1000
  )
    simpleError(
      "goldFinenessPerMille",
      "Provide a finite nonnegative number no greater than 1000.",
    );
  if (!Number.isFinite(x.spotPricePerTroyOunce) || x.spotPricePerTroyOunce < 0)
    simpleError(
      "spotPricePerTroyOunce",
      "Provide a finite nonnegative number.",
    );
  const goldMeltValue =
    ((x.grossWeightGrams * x.goldFinenessPerMille) / 1000 / 31.1034768) *
    x.spotPricePerTroyOunce;
  if (!Number.isFinite(goldMeltValue))
    simpleError(
      "goldMeltValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { goldMeltValue: Object.is(goldMeltValue, -0) ? 0 : goldMeltValue };
};

export const example = {
  input: {
    grossWeightGrams: 10,
    goldFinenessPerMille: 750,
    spotPricePerTroyOunce: 2000,
  },
  output: { goldMeltValue: 482.26119852941974 },
} satisfies ToolExample<
  MeltValueFromSpotGoldInput,
  MeltValueFromSpotGoldOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/melt-value-from-spot-gold",
  title: "Melt Value From Spot Gold",
  description:
    "Price contained gold at a supplied spot price, excluding transaction costs and collectible value.",
  inputs: [
    {
      id: "grossWeightGrams",
      kind: "number",
      label: "Gross Weight Grams",
      unit: "g",
    },
    {
      id: "goldFinenessPerMille",
      kind: "number",
      label: "Gold Fineness Per Mille",
      unit: "‰",
    },
    {
      id: "spotPricePerTroyOunce",
      kind: "number",
      label: "Spot Price Per Troy Ounce",
      unit: "currency/oz t",
    },
  ],
  outputs: [
    {
      id: "goldMeltValue",
      kind: "number",
      label: "Gold Melt Value",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateMeltValueFromSpotGold({
      grossWeightGrams: input.grossWeightGrams as number,
      goldFinenessPerMille: input.goldFinenessPerMille as number,
      spotPricePerTroyOunce: input.spotPricePerTroyOunce as number,
    }),
});
export const runMeltValueFromSpotGold = tool.execute;
export default tool;
