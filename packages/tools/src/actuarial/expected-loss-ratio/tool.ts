import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExpectedLossRatioInput = {
  readonly earnedPremium: number;
  readonly expectedLosses: number;
};

export type ExpectedLossRatioOutput = {
  readonly expectedLossRatio: number;
};

export const expectedLossRatioExample = {
  input: {
    earnedPremium: 1000000,
    expectedLosses: 700000,
  },
  output: {
    expectedLossRatio: 0.7,
  },
} satisfies ToolExample<ExpectedLossRatioInput, ExpectedLossRatioOutput>;

export const calculateExpectedLossRatio = (
  input: ExpectedLossRatioInput,
): ExpectedLossRatioOutput => {
  if (!(input.earnedPremium > 0))
    simpleError(
      "earnedPremium",
      "The earned premium must be positive to form a loss ratio.",
      "positive_earned_premium_required",
    );
  return {
    expectedLossRatio: input.expectedLosses / input.earnedPremium,
  };
};

export const expectedLossRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateExpectedLossRatio({
      earnedPremium: input.earnedPremium as number,
      expectedLosses: input.expectedLosses as number,
    }),
  description:
    "Calculate an expected loss ratio by dividing selected expected losses by earned premium for the same exposure period.",
  id: "actuarial/expected-loss-ratio",
  inputs: [
    {
      description:
        "Premium earned over the exposure period; must be positive to form a ratio.",
      id: "earnedPremium",
      kind: "number",
      label: "Earned premium",
      minimum: 0,
    },
    {
      description: "Selected expected losses for the exposure period.",
      id: "expectedLosses",
      kind: "number",
      label: "Expected losses",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Losses divided by earned premium.",
      id: "expectedLossRatio",
      kind: "number",
      label: "Expected loss ratio",
    },
  ],
  title: "Expected Loss Ratio Calculator",
});
export const runExpectedLossRatio = expectedLossRatioTool.execute;
export default expectedLossRatioTool;
