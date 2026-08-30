import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GradingSubmissionCostPerCoinInput = Readonly<{
  readonly gradingFees: number;
  readonly shippingAndInsurance: number;
  readonly coinCount: number;
}>;
export type GradingSubmissionCostPerCoinOutput = Readonly<{
  readonly costPerCoin: number;
}>;

export const calculateGradingSubmissionCostPerCoin = (
  x: GradingSubmissionCostPerCoinInput,
): GradingSubmissionCostPerCoinOutput => {
  if (!Number.isFinite(x.gradingFees) || x.gradingFees < 0)
    simpleError("gradingFees", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.shippingAndInsurance) || x.shippingAndInsurance < 0)
    simpleError("shippingAndInsurance", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.coinCount) ||
    x.coinCount <= 0 ||
    !Number.isSafeInteger(x.coinCount)
  )
    simpleError("coinCount", "Provide a positive whole number.");
  const costPerCoin = (x.gradingFees + x.shippingAndInsurance) / x.coinCount;
  if (!Number.isFinite(costPerCoin))
    simpleError(
      "costPerCoin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { costPerCoin: Object.is(costPerCoin, -0) ? 0 : costPerCoin };
};

export const example = {
  input: {
    gradingFees: 100,
    shippingAndInsurance: 20,
    coinCount: 5,
  },
  output: { costPerCoin: 24 },
} satisfies ToolExample<
  GradingSubmissionCostPerCoinInput,
  GradingSubmissionCostPerCoinOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/grading-submission-cost-per-coin",
  title: "Grading Submission Cost Per Coin",
  description:
    "Allocate grading, shipping, and insurance costs evenly across submitted coins.",
  inputs: [
    {
      id: "gradingFees",
      kind: "number",
      label: "Grading Fees",
      unit: "currency",
    },
    {
      id: "shippingAndInsurance",
      kind: "number",
      label: "Shipping And Insurance",
      unit: "currency",
    },
    { id: "coinCount", kind: "number", label: "Coin Count", unit: "coins" },
  ],
  outputs: [
    {
      id: "costPerCoin",
      kind: "number",
      label: "Cost Per Coin",
      unit: "currency/coin",
    },
  ],
  calculate: (input) =>
    calculateGradingSubmissionCostPerCoin({
      gradingFees: input.gradingFees as number,
      shippingAndInsurance: input.shippingAndInsurance as number,
      coinCount: input.coinCount as number,
    }),
});
export const runGradingSubmissionCostPerCoin = tool.execute;
export default tool;
