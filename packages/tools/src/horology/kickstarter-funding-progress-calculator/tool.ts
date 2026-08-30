import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KickstarterFundingInput = {
  readonly fundingGoal: number;
  readonly pledgedAmount: number;
};

export type KickstarterFundingOutput = {
  readonly fundingPercent: number;
  readonly goalReached: boolean;
  readonly remainingToGoal: number;
  readonly riskCaution: string;
};

export const calculateKickstarterFundingProgress = (
  input: KickstarterFundingInput,
): KickstarterFundingOutput => {
  if (!Number.isFinite(input.fundingGoal) || input.fundingGoal <= 0)
    simpleError(
      "fundingGoal",
      "Funding goal must be finite and positive.",
      "funding_goal_invalid",
    );
  if (!Number.isFinite(input.pledgedAmount) || input.pledgedAmount < 0)
    simpleError(
      "pledgedAmount",
      "Pledged amount must be finite and nonnegative.",
      "pledged_amount_invalid",
    );
  return {
    fundingPercent: (100 * input.pledgedAmount) / input.fundingGoal,
    goalReached: input.pledgedAmount >= input.fundingGoal,
    remainingToGoal: Math.max(0, input.fundingGoal - input.pledgedAmount),
    riskCaution:
      "Kickstarter is all-or-nothing, but reaching the goal does not prove the creator can manufacture and deliver a watch; review the budget, production evidence, and fulfillment terms.",
  };
};

export const kickstarterFundingExample = {
  input: { fundingGoal: 100_000, pledgedAmount: 75_000 },
  output: {
    fundingPercent: 75,
    goalReached: false,
    remainingToGoal: 25_000,
    riskCaution:
      "Kickstarter is all-or-nothing, but reaching the goal does not prove the creator can manufacture and deliver a watch; review the budget, production evidence, and fulfillment terms.",
  },
} satisfies ToolExample<KickstarterFundingInput, KickstarterFundingOutput>;

export const kickstarterFundingTool = createSimpleTool({
  calculate: (input) =>
    calculateKickstarterFundingProgress({
      fundingGoal: input.fundingGoal as number,
      pledgedAmount: input.pledgedAmount as number,
    }),
  description:
    "Calculate Kickstarter goal progress and all-or-nothing status without assigning a delivery-risk score from funding percentage alone.",
  id: "horology/kickstarter-funding-progress-calculator",
  inputs: [
    {
      id: "fundingGoal",
      kind: "number",
      label: "Campaign funding goal",
      minimum: 0,
    },
    {
      id: "pledgedAmount",
      kind: "number",
      label: "Current pledged amount",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fundingPercent",
      kind: "number",
      label: "Funding progress",
      minimum: 0,
      unit: "%",
    },
    { id: "goalReached", kind: "boolean", label: "Funding goal reached" },
    {
      id: "remainingToGoal",
      kind: "number",
      label: "Remaining to funding goal",
      minimum: 0,
    },
    { id: "riskCaution", kind: "string", label: "Fulfillment-risk caution" },
  ],
  title: "Kickstarter Funding Progress Calculator",
});

export const runKickstarterFunding = kickstarterFundingTool.execute;
export default kickstarterFundingTool;
