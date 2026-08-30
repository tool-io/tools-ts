import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProblemCoinDiscountPercentInput = Readonly<{
  readonly problemCoinPrice: number;
  readonly straightGradePrice: number;
}>;
export type ProblemCoinDiscountPercentOutput = Readonly<{
  readonly discountPercent: number;
}>;

export const calculateProblemCoinDiscountPercent = (
  x: ProblemCoinDiscountPercentInput,
): ProblemCoinDiscountPercentOutput => {
  if (!Number.isFinite(x.problemCoinPrice) || x.problemCoinPrice < 0)
    simpleError("problemCoinPrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.straightGradePrice) || x.straightGradePrice <= 0)
    simpleError("straightGradePrice", "Provide a finite positive number.");
  if (x.problemCoinPrice > x.straightGradePrice)
    simpleError(
      "problemCoinPrice",
      "Problem-coin price cannot exceed the straight-grade comparison price for a discount estimate.",
    );
  const discountPercent =
    ((x.straightGradePrice - x.problemCoinPrice) / x.straightGradePrice) * 100;
  if (!Number.isFinite(discountPercent))
    simpleError(
      "discountPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    discountPercent: Object.is(discountPercent, -0) ? 0 : discountPercent,
  };
};

export const example = {
  input: {
    problemCoinPrice: 70,
    straightGradePrice: 100,
  },
  output: { discountPercent: 30 },
} satisfies ToolExample<
  ProblemCoinDiscountPercentInput,
  ProblemCoinDiscountPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/problem-coin-discount-percent",
  title: "Problem Coin Discount Percent",
  description:
    "Quantify the observed discount of a problem coin against a specified comparable straight-grade coin.",
  inputs: [
    {
      id: "problemCoinPrice",
      kind: "number",
      label: "Problem Coin Price",
      unit: "currency",
    },
    {
      id: "straightGradePrice",
      kind: "number",
      label: "Straight Grade Price",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "discountPercent",
      kind: "number",
      label: "Discount Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateProblemCoinDiscountPercent({
      problemCoinPrice: input.problemCoinPrice as number,
      straightGradePrice: input.straightGradePrice as number,
    }),
});
export const runProblemCoinDiscountPercent = tool.execute;
export default tool;
