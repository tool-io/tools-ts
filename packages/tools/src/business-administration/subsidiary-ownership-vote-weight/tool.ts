import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heldVotingShares: number;
  readonly totalVotingShares: number;
  readonly voteMultiplier: number;
};
export type Output = {
  readonly ownershipFraction: number;
  readonly weightedVote: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heldVotingShares: { type: "number", minimum: 0 },
    totalVotingShares: { type: "number", exclusiveMinimum: 0 },
    voteMultiplier: { type: "number", minimum: 0 },
  },
  required: ["heldVotingShares", "totalVotingShares", "voteMultiplier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ownershipFraction: { type: "number" },
    weightedVote: { type: "number" },
  },
  required: ["ownershipFraction", "weightedVote"],
} as const;
/** Apply an explicit vote multiplier to a supplied voting-share ownership fraction without inferring control. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heldVotingShares, totalVotingShares, voteMultiplier } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalVotingShares) && totalVotingShares > 0,
      "totalVotingShares",
    ),
      totalVotingShares);
    H.domain(
      heldVotingShares >= 0 && heldVotingShares <= totalVotingShares,
      "heldVotingShares",
    );
    H.domain(voteMultiplier >= 0, "voteMultiplier");
    return {
      ownershipFraction: heldVotingShares / totalVotingShares,
      weightedVote: (heldVotingShares / totalVotingShares) * voteMultiplier,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heldVotingShares: 30, totalVotingShares: 120, voteMultiplier: 2 },
  output: { ownershipFraction: 0.25, weightedVote: 0.5 },
} satisfies ToolExample<Input, Output>;
export const subsidiaryOwnershipVoteWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/subsidiary-ownership-vote-weight",
    title: "Subsidiary Ownership Vote Weight",
    description:
      "Apply an explicit vote multiplier to a supplied voting-share ownership fraction without inferring control.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heldVotingShares: { type: "number", minimum: 0 },
        totalVotingShares: { type: "number", exclusiveMinimum: 0 },
        voteMultiplier: { type: "number", minimum: 0 },
      },
      required: ["heldVotingShares", "totalVotingShares", "voteMultiplier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ownershipFraction: { type: "number" },
        weightedVote: { type: "number" },
      },
      required: ["ownershipFraction", "weightedVote"],
    },
    ports: {
      inputs: [
        {
          id: "heldVotingShares",
          label: "Held Voting Shares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalVotingShares",
          label: "Total Voting Shares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voteMultiplier",
          label: "Vote Multiplier",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ownershipFraction",
          label: "Ownership Fraction",
          valueType: { type: "number" },
        },
        {
          id: "weightedVote",
          label: "Weighted Vote",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsidiaryOwnershipVoteWeightTool.execute;
export default subsidiaryOwnershipVoteWeightTool;
