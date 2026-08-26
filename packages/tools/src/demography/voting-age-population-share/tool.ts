import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VotingAgePopulationShareInput = {
  readonly votingAgePopulation: number;
  readonly totalPopulation: number;
};

export type VotingAgePopulationShareOutput = {
  readonly votingAgeSharePercent: number;
};

export const calculateVotingAgePopulationShare = (
  input: VotingAgePopulationShareInput,
): VotingAgePopulationShareOutput => {
  if (!(input.votingAgePopulation >= 0))
    return simpleError(
      "votingAgePopulation",
      "The voting-age population must be non-negative.",
      "invalid_population",
    );
  if (!(input.totalPopulation > 0))
    return simpleError(
      "totalPopulation",
      "The total population must be greater than zero.",
      "invalid_population",
    );
  if (input.votingAgePopulation > input.totalPopulation)
    return simpleError(
      "votingAgePopulation",
      "The voting-age population cannot exceed the total population.",
      "invalid_population",
    );
  return {
    votingAgeSharePercent:
      (input.votingAgePopulation / input.totalPopulation) * 100,
  };
};

export const votingAgePopulationShareExample = {
  input: { votingAgePopulation: 18000000, totalPopulation: 27000000 },
  output: { votingAgeSharePercent: 66.66666666666666 },
} satisfies ToolExample<
  VotingAgePopulationShareInput,
  VotingAgePopulationShareOutput
>;

export const votingAgePopulationShareTool = createSimpleTool({
  id: "demography/voting-age-population-share",
  title: "Voting Age Population Share",
  description:
    "Compute the share of the total population that has reached voting age (18 and over) as a percentage.",
  inputs: [
    {
      description: "Population aged 18 and over.",
      id: "votingAgePopulation",
      kind: "number",
      label: "VAP",
      minimum: 0,
    },
    {
      description: "Total population of all ages.",
      id: "totalPopulation",
      kind: "number",
      label: "Total",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Voting-age population as a percent of the total population.",
      id: "votingAgeSharePercent",
      kind: "number",
      label: "VAP share %",
    },
  ],
  calculate: (input) =>
    calculateVotingAgePopulationShare(
      input as unknown as VotingAgePopulationShareInput,
    ),
});

export const runVotingAgePopulationShare = votingAgePopulationShareTool.execute;
export default votingAgePopulationShareTool;
