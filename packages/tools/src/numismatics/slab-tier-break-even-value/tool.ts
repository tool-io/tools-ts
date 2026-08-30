import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlabTierBreakEvenValueInput = Readonly<{
  readonly rawCoinCost: number;
  readonly gradingFee: number;
  readonly shippingCost: number;
}>;
export type SlabTierBreakEvenValueOutput = Readonly<{
  readonly breakEvenSalePrice: number;
}>;

export const calculateSlabTierBreakEvenValue = (
  x: SlabTierBreakEvenValueInput,
): SlabTierBreakEvenValueOutput => {
  if (!Number.isFinite(x.rawCoinCost) || x.rawCoinCost < 0)
    simpleError("rawCoinCost", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.gradingFee) || x.gradingFee < 0)
    simpleError("gradingFee", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.shippingCost) || x.shippingCost < 0)
    simpleError("shippingCost", "Provide a finite nonnegative number.");
  const breakEvenSalePrice = x.rawCoinCost + x.gradingFee + x.shippingCost;
  if (!Number.isFinite(breakEvenSalePrice))
    simpleError(
      "breakEvenSalePrice",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    breakEvenSalePrice: Object.is(breakEvenSalePrice, -0)
      ? 0
      : breakEvenSalePrice,
  };
};

export const example = {
  input: {
    rawCoinCost: 80,
    gradingFee: 20,
    shippingCost: 10,
  },
  output: { breakEvenSalePrice: 110 },
} satisfies ToolExample<
  SlabTierBreakEvenValueInput,
  SlabTierBreakEvenValueOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/slab-tier-break-even-value",
  title: "Slab Tier Break Even Value",
  description:
    "Find the minimum sale price covering coin acquisition, grading, and shipping, before selling fees.",
  inputs: [
    {
      id: "rawCoinCost",
      kind: "number",
      label: "Raw Coin Cost",
      unit: "currency",
    },
    {
      id: "gradingFee",
      kind: "number",
      label: "Grading Fee",
      unit: "currency",
    },
    {
      id: "shippingCost",
      kind: "number",
      label: "Shipping Cost",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "breakEvenSalePrice",
      kind: "number",
      label: "Break Even Sale Price",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateSlabTierBreakEvenValue({
      rawCoinCost: input.rawCoinCost as number,
      gradingFee: input.gradingFee as number,
      shippingCost: input.shippingCost as number,
    }),
});
export const runSlabTierBreakEvenValue = tool.execute;
export default tool;
