import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MeltValueFromSpotSilverInput = Readonly<{
  readonly grossWeightGrams: number;
  readonly silverFinenessPerMille: number;
  readonly spotPricePerTroyOunce: number;
}>;
export type MeltValueFromSpotSilverOutput = Readonly<{
  readonly silverMeltValue: number;
}>;

export const calculateMeltValueFromSpotSilver = (
  x: MeltValueFromSpotSilverInput,
): MeltValueFromSpotSilverOutput => {
  if (!Number.isFinite(x.grossWeightGrams) || x.grossWeightGrams < 0)
    simpleError("grossWeightGrams", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.silverFinenessPerMille) ||
    x.silverFinenessPerMille < 0 ||
    x.silverFinenessPerMille > 1000
  )
    simpleError(
      "silverFinenessPerMille",
      "Provide a finite nonnegative number no greater than 1000.",
    );
  if (!Number.isFinite(x.spotPricePerTroyOunce) || x.spotPricePerTroyOunce < 0)
    simpleError(
      "spotPricePerTroyOunce",
      "Provide a finite nonnegative number.",
    );
  const silverMeltValue =
    ((x.grossWeightGrams * x.silverFinenessPerMille) / 1000 / 31.1034768) *
    x.spotPricePerTroyOunce;
  if (!Number.isFinite(silverMeltValue))
    simpleError(
      "silverMeltValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    silverMeltValue: Object.is(silverMeltValue, -0) ? 0 : silverMeltValue,
  };
};

export const example = {
  input: {
    grossWeightGrams: 100,
    silverFinenessPerMille: 900,
    spotPricePerTroyOunce: 30,
  },
  output: { silverMeltValue: 86.80701573529555 },
} satisfies ToolExample<
  MeltValueFromSpotSilverInput,
  MeltValueFromSpotSilverOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/melt-value-from-spot-silver",
  title: "Melt Value From Spot Silver",
  description:
    "Price contained silver at a supplied spot price, before refining fees, tax, or collector premium.",
  inputs: [
    {
      id: "grossWeightGrams",
      kind: "number",
      label: "Gross Weight Grams",
      unit: "g",
    },
    {
      id: "silverFinenessPerMille",
      kind: "number",
      label: "Silver Fineness Per Mille",
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
      id: "silverMeltValue",
      kind: "number",
      label: "Silver Melt Value",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateMeltValueFromSpotSilver({
      grossWeightGrams: input.grossWeightGrams as number,
      silverFinenessPerMille: input.silverFinenessPerMille as number,
      spotPricePerTroyOunce: input.spotPricePerTroyOunce as number,
    }),
});
export const runMeltValueFromSpotSilver = tool.execute;
export default tool;
