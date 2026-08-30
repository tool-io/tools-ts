import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PreciousMetalAllocationPercentInput = Readonly<{
  readonly metalHoldingValue: number;
  readonly totalPortfolioValue: number;
}>;
export type PreciousMetalAllocationPercentOutput = Readonly<{
  readonly metalAllocationPercent: number;
}>;

export const calculatePreciousMetalAllocationPercent = (
  x: PreciousMetalAllocationPercentInput,
): PreciousMetalAllocationPercentOutput => {
  if (!Number.isFinite(x.metalHoldingValue) || x.metalHoldingValue < 0)
    simpleError("metalHoldingValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.totalPortfolioValue) || x.totalPortfolioValue <= 0)
    simpleError("totalPortfolioValue", "Provide a finite positive number.");
  if (x.metalHoldingValue > x.totalPortfolioValue)
    simpleError(
      "metalHoldingValue",
      "Metal holding value cannot exceed total portfolio value.",
    );
  const metalAllocationPercent =
    (x.metalHoldingValue / x.totalPortfolioValue) * 100;
  if (!Number.isFinite(metalAllocationPercent))
    simpleError(
      "metalAllocationPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    metalAllocationPercent: Object.is(metalAllocationPercent, -0)
      ? 0
      : metalAllocationPercent,
  };
};

export const example = {
  input: {
    metalHoldingValue: 2500,
    totalPortfolioValue: 10000,
  },
  output: { metalAllocationPercent: 25 },
} satisfies ToolExample<
  PreciousMetalAllocationPercentInput,
  PreciousMetalAllocationPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/precious-metal-allocation-percent",
  title: "Precious Metal Allocation Percent",
  description:
    "Find precious-metal holdings as a share of a supplied portfolio value; this is not an allocation recommendation.",
  inputs: [
    {
      id: "metalHoldingValue",
      kind: "number",
      label: "Metal Holding Value",
      unit: "currency",
    },
    {
      id: "totalPortfolioValue",
      kind: "number",
      label: "Total Portfolio Value",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "metalAllocationPercent",
      kind: "number",
      label: "Metal Allocation Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculatePreciousMetalAllocationPercent({
      metalHoldingValue: input.metalHoldingValue as number,
      totalPortfolioValue: input.totalPortfolioValue as number,
    }),
});
export const runPreciousMetalAllocationPercent = tool.execute;
export default tool;
