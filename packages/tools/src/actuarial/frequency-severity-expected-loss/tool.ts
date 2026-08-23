import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrequencySeverityExpectedLossInput = {
  readonly averageClaimSeverity: number;
  readonly claimFrequency: number;
};

export type FrequencySeverityExpectedLossOutput = {
  readonly expectedLoss: number;
};

export const frequencySeverityExpectedLossExample = {
  input: {
    averageClaimSeverity: 3000,
    claimFrequency: 5,
  },
  output: {
    expectedLoss: 15000,
  },
} satisfies ToolExample<
  FrequencySeverityExpectedLossInput,
  FrequencySeverityExpectedLossOutput
>;

export const calculateFrequencySeverityExpectedLoss = (
  input: FrequencySeverityExpectedLossInput,
): FrequencySeverityExpectedLossOutput => {
  if (!(input.claimFrequency >= 0))
    simpleError(
      "claimFrequency",
      "Expected claim frequency cannot be negative.",
      "invalid_claim_frequency",
    );
  if (!(input.averageClaimSeverity >= 0))
    simpleError(
      "averageClaimSeverity",
      "Average claim severity cannot be negative.",
      "invalid_claim_severity",
    );
  const expectedLoss = input.claimFrequency * input.averageClaimSeverity;
  if (!Number.isFinite(expectedLoss))
    simpleError(
      "averageClaimSeverity",
      "Expected loss is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    expectedLoss,
  };
};

export const frequencySeverityExpectedLossTool = createSimpleTool({
  calculate: (input) =>
    calculateFrequencySeverityExpectedLoss({
      averageClaimSeverity: input.averageClaimSeverity as number,
      claimFrequency: input.claimFrequency as number,
    }),
  description:
    "Multiply expected claim frequency by average claim severity to obtain the expected loss.",
  id: "actuarial/frequency-severity-expected-loss",
  inputs: [
    {
      description: "Expected claims per exposure period.",
      id: "claimFrequency",
      kind: "number",
      label: "Claim frequency",
      minimum: 0,
    },
    {
      description: "Average cost of a single claim.",
      id: "averageClaimSeverity",
      kind: "number",
      label: "Average severity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Expected total loss for the period.",
      id: "expectedLoss",
      kind: "number",
      label: "Expected loss",
    },
  ],
  title: "Frequency Severity Expected Loss Calculator",
});
export const runFrequencySeverityExpectedLoss =
  frequencySeverityExpectedLossTool.execute;
export default frequencySeverityExpectedLossTool;
