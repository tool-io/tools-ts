import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ContributionMarginInput = {
  readonly revenue: number;
  readonly variableCosts: number;
};

export type ContributionMarginOutput = {
  readonly contributionMargin: number;
  readonly marginRatioPercent: number;
};

export const contributionMarginExample = {
  input: { revenue: 500, variableCosts: 300 },
  output: { contributionMargin: 200, marginRatioPercent: 40 },
} satisfies ToolExample<ContributionMarginInput, ContributionMarginOutput>;

export const calculateContributionMargin = (
  input: ContributionMarginInput,
): ContributionMarginOutput => {
  const { revenue, variableCosts } = input;
  if (revenue === 0)
    simpleError("revenue", "Revenue cannot be zero.", "zero_revenue");
  const margin = revenue - variableCosts;
  return {
    contributionMargin: roundStatistic(margin),
    marginRatioPercent: roundStatistic((margin / revenue) * 100),
  };
};

export const contributionMarginTool = createSimpleTool({
  calculate: (input) =>
    calculateContributionMargin(input as unknown as ContributionMarginInput),
  description:
    "Compute the contribution margin left after variable costs and its share of revenue.",
  id: "finance/contribution-margin",
  inputs: [
    {
      description: "Total sales revenue.",
      id: "revenue",
      kind: "number",
      label: "Revenue",
    },
    {
      description: "Total variable costs of producing the sold units.",
      id: "variableCosts",
      kind: "number",
      label: "Variable costs",
    },
  ],
  outputs: [
    {
      description: "Revenue minus variable costs.",
      id: "contributionMargin",
      kind: "number",
      label: "Contribution margin",
    },
    {
      description: "Contribution margin as a share of revenue.",
      format: "percent",
      id: "marginRatioPercent",
      kind: "number",
      label: "Margin ratio",
      unit: "%",
    },
  ],
  title: "Contribution Margin Calculator",
});
export const runContributionMargin = contributionMarginTool.execute;
export default contributionMarginTool;
