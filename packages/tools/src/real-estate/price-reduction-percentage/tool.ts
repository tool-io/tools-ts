import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PriceReductionPercentageInput = Readonly<{
  readonly originalPrice: number;
  readonly revisedPrice: number;
}>;
export type PriceReductionPercentageOutput = Readonly<{
  readonly reductionPercent: number;
}>;

export const calculatePriceReductionPercentage = (
  x: PriceReductionPercentageInput,
): PriceReductionPercentageOutput => {
  if (!Number.isFinite(x.originalPrice) || x.originalPrice <= 0)
    simpleError("originalPrice", "Provide a finite positive number.");
  if (!Number.isFinite(x.revisedPrice) || x.revisedPrice < 0)
    simpleError("revisedPrice", "Provide a finite nonnegative number.");
  if (!(x.revisedPrice <= x.originalPrice))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const reductionPercent =
    (100 * (x.originalPrice - x.revisedPrice)) / x.originalPrice;
  if (!Number.isFinite(reductionPercent))
    simpleError(
      "reductionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    reductionPercent: Object.is(reductionPercent, -0) ? 0 : reductionPercent,
  };
};

export const example = {
  input: {
    originalPrice: 200000,
    revisedPrice: 190000,
  },
  output: { reductionPercent: 5 },
} satisfies ToolExample<
  PriceReductionPercentageInput,
  PriceReductionPercentageOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/price-reduction-percentage",
  title: "Price Reduction Percentage",
  description:
    "Percentage decrease from original asking price to revised asking price.",
  inputs: [
    {
      id: "originalPrice",
      kind: "number",
      label: "Original Price",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "revisedPrice",
      kind: "number",
      label: "Revised Price",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "reductionPercent",
      kind: "number",
      label: "Reduction Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculatePriceReductionPercentage({
      originalPrice: input.originalPrice as number,
      revisedPrice: input.revisedPrice as number,
    }),
});
export const priceReductionPercentageTool = tool;
export const runPriceReductionPercentage = tool.execute;
export default tool;
