import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type WithdrawalProbabilityServiceTableInput = {
  readonly annualWithdrawalProbability: number;
  readonly serviceYears: number;
};

export type WithdrawalProbabilityServiceTableOutput = {
  readonly cumulativeWithdrawalProbability: number;
  readonly retentionProbability: number;
};

export const withdrawalProbabilityServiceTableExample = {
  input: {
    annualWithdrawalProbability: 0.1,
    serviceYears: 2,
  },
  output: {
    cumulativeWithdrawalProbability: 0.19,
    retentionProbability: 0.81,
  },
} satisfies ToolExample<
  WithdrawalProbabilityServiceTableInput,
  WithdrawalProbabilityServiceTableOutput
>;

export const calculateWithdrawalServiceProbabilities = (
  input: WithdrawalProbabilityServiceTableInput,
): WithdrawalProbabilityServiceTableOutput => {
  const retention =
    (1 - input.annualWithdrawalProbability) ** input.serviceYears;
  return {
    cumulativeWithdrawalProbability: roundStatistic(1 - retention),
    retentionProbability: roundStatistic(retention),
  };
};

export const withdrawalProbabilityServiceTableTool = createSimpleTool({
  calculate: (input) =>
    calculateWithdrawalServiceProbabilities(
      input as unknown as WithdrawalProbabilityServiceTableInput,
    ),
  description:
    "Calculate the probability an active member is still in service after the given years, and the cumulative chance they have withdrawn.",
  id: "actuarial/withdrawal-probability-service-table",
  inputs: [
    {
      description:
        "Constant probability of withdrawing at each service anniversary.",
      id: "annualWithdrawalProbability",
      kind: "number",
      label: "Annual withdrawal probability",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Completed years of service.",
      id: "serviceYears",
      kind: "integer",
      label: "Service years",
      maximum: 1200,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Probability the member has withdrawn before completing the service years.",
      id: "cumulativeWithdrawalProbability",
      kind: "number",
      label: "Cumulative withdrawal probability",
    },
    {
      description: "Probability the member remains in active service.",
      id: "retentionProbability",
      kind: "number",
      label: "Retention probability",
    },
  ],
  title: "Withdrawal Probability Service Table Calculator",
});
export const runWithdrawalProbabilityServiceTable =
  withdrawalProbabilityServiceTableTool.execute;
export default withdrawalProbabilityServiceTableTool;
