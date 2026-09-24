import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferredShares: number;
  readonly votesPerPreferred: number;
  readonly ordinaryVotes: number;
  readonly eligibleFraction: number;
};
export type Output = {
  readonly preferredVotes: number;
  readonly totalVotes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredShares: { type: "integer", minimum: 0 },
    votesPerPreferred: { type: "number", minimum: 0 },
    ordinaryVotes: { type: "number", minimum: 0 },
    eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "preferredShares",
    "votesPerPreferred",
    "ordinaryVotes",
    "eligibleFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredVotes: { type: "number" },
    totalVotes: { type: "number" },
  },
  required: ["preferredVotes", "totalVotes"],
} as const;
/** Calculate preferred share vote count factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    preferredShares,
    votesPerPreferred,
    ordinaryVotes,
    eligibleFraction,
  } = request;
  const compute = (): Output => {
    H.integer(preferredShares, 0);
    H.domain(votesPerPreferred >= 0 && ordinaryVotes >= 0);
    H.probability(eligibleFraction);
    return {
      preferredVotes: preferredShares * votesPerPreferred * eligibleFraction,
      totalVotes:
        ordinaryVotes + preferredShares * votesPerPreferred * eligibleFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preferredShares: 100,
    votesPerPreferred: 2,
    ordinaryVotes: 500,
    eligibleFraction: 0.5,
  },
  output: { preferredVotes: 100, totalVotes: 600 },
} satisfies ToolExample<Input, Output>;
export const preferredShareVoteCountFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/preferred-share-vote-count-factor",
    title: "Preferred Share Vote Count Factor Tool",
    description:
      "Calculate preferred share vote count factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredShares: { type: "integer", minimum: 0 },
        votesPerPreferred: { type: "number", minimum: 0 },
        ordinaryVotes: { type: "number", minimum: 0 },
        eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "preferredShares",
        "votesPerPreferred",
        "ordinaryVotes",
        "eligibleFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredVotes: { type: "number" },
        totalVotes: { type: "number" },
      },
      required: ["preferredVotes", "totalVotes"],
    },
    ports: {
      inputs: [
        {
          id: "preferredShares",
          label: "Preferred Shares",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "votesPerPreferred",
          label: "Votes Per Preferred",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ordinaryVotes",
          label: "Ordinary Votes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleFraction",
          label: "Eligible Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "preferredVotes",
          label: "Preferred Votes",
          valueType: { type: "number" },
        },
        {
          id: "totalVotes",
          label: "Total Votes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = preferredShareVoteCountFactorTool.execute;
export default preferredShareVoteCountFactorTool;
