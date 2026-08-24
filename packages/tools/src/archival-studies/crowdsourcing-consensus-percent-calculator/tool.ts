import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrowdsourcingConsensusPercentCalculatorInput = {
  readonly agreeingContributions: number;
  readonly totalContributions: number;
};

export type CrowdsourcingConsensusPercentCalculatorOutput = {
  readonly agreementPercent: number;
  readonly dissentingContributions: number;
};

export const calculateCrowdsourcingConsensusPercentCalculator = (
  input: CrowdsourcingConsensusPercentCalculatorInput,
): CrowdsourcingConsensusPercentCalculatorOutput => {
  if (
    !Number.isSafeInteger(input.totalContributions) ||
    input.totalContributions < 1
  )
    simpleError(
      "totalContributions",
      "Total contributions must be a safe integer at least 1.",
      "invalid_counts",
    );
  if (
    !Number.isSafeInteger(input.agreeingContributions) ||
    input.agreeingContributions < 0
  )
    simpleError(
      "agreeingContributions",
      "Agreeing contributions must be a non-negative safe integer.",
      "invalid_counts",
    );
  if (input.agreeingContributions > input.totalContributions)
    return simpleError(
      "agreeingContributions",
      "Agreeing contributions cannot exceed the total contributions.",
      "invalid_counts",
    );
  return {
    agreementPercent:
      (input.agreeingContributions / input.totalContributions) * 100,
    dissentingContributions:
      input.totalContributions - input.agreeingContributions,
  };
};

export const crowdsourcingConsensusPercentCalculatorExample = {
  input: { agreeingContributions: 37, totalContributions: 40 },
  output: { agreementPercent: 92.5, dissentingContributions: 3 },
} satisfies ToolExample<
  CrowdsourcingConsensusPercentCalculatorInput,
  CrowdsourcingConsensusPercentCalculatorOutput
>;

export const crowdsourcingConsensusPercentCalculatorTool = createSimpleTool({
  id: "archival-studies/crowdsourcing-consensus-percent-calculator",
  title: "Crowdsourcing Review Consensus Agreement Percent Calculator",
  description:
    "Measure crowdsourced transcription consensus as the percentage of reviewer contributions that agree with the accepted reading.",
  inputs: [
    {
      description: "Reviewer contributions matching the accepted value.",
      id: "agreeingContributions",
      kind: "integer",
      label: "Agreeing",
      minimum: 0,
    },
    {
      description: "Total reviewer contributions for the field.",
      id: "totalContributions",
      kind: "integer",
      label: "Total",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Agreement percentage from 0 to 100.",
      id: "agreementPercent",
      kind: "number",
      label: "Agreement",
    },
    {
      description: "Contributions that disagreed with the accepted value.",
      id: "dissentingContributions",
      kind: "integer",
      label: "Dissenting",
    },
  ],
  calculate: (input) =>
    calculateCrowdsourcingConsensusPercentCalculator({
      agreeingContributions: input.agreeingContributions as number,
      totalContributions: input.totalContributions as number,
    }),
});

export const runCrowdsourcingConsensusPercentCalculator =
  crowdsourcingConsensusPercentCalculatorTool.execute;
export default crowdsourcingConsensusPercentCalculatorTool;
