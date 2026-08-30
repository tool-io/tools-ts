import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GradeGapPriceJumpPercentInput = Readonly<{
  readonly higherGradePrice: number;
  readonly lowerGradePrice: number;
}>;
export type GradeGapPriceJumpPercentOutput = Readonly<{
  readonly priceJumpPercent: number;
}>;

export const calculateGradeGapPriceJumpPercent = (
  x: GradeGapPriceJumpPercentInput,
): GradeGapPriceJumpPercentOutput => {
  if (!Number.isFinite(x.higherGradePrice) || x.higherGradePrice < 0)
    simpleError("higherGradePrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.lowerGradePrice) || x.lowerGradePrice <= 0)
    simpleError("lowerGradePrice", "Provide a finite positive number.");
  const priceJumpPercent =
    ((x.higherGradePrice - x.lowerGradePrice) / x.lowerGradePrice) * 100;
  if (!Number.isFinite(priceJumpPercent))
    simpleError(
      "priceJumpPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    priceJumpPercent: Object.is(priceJumpPercent, -0) ? 0 : priceJumpPercent,
  };
};

export const example = {
  input: {
    higherGradePrice: 150,
    lowerGradePrice: 100,
  },
  output: { priceJumpPercent: 50 },
} satisfies ToolExample<
  GradeGapPriceJumpPercentInput,
  GradeGapPriceJumpPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/grade-gap-price-jump-percent",
  title: "Grade Gap Price Jump Percent",
  description:
    "Measure an observed price difference between two coin grades relative to the lower-grade price.",
  inputs: [
    {
      id: "higherGradePrice",
      kind: "number",
      label: "Higher Grade Price",
      unit: "currency",
    },
    {
      id: "lowerGradePrice",
      kind: "number",
      label: "Lower Grade Price",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "priceJumpPercent",
      kind: "number",
      label: "Price Jump Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateGradeGapPriceJumpPercent({
      higherGradePrice: input.higherGradePrice as number,
      lowerGradePrice: input.lowerGradePrice as number,
    }),
});
export const runGradeGapPriceJumpPercent = tool.execute;
export default tool;
