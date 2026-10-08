import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly newShares: number;
  readonly existingShares: number;
  readonly votesPerNewShare: number;
  readonly existingTotalVotes: number;
};
export type Output = {
  readonly economicShare: number;
  readonly votingShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newShares: { type: "integer", minimum: 0 },
    existingShares: { type: "integer", minimum: 0 },
    votesPerNewShare: { type: "number", minimum: 0 },
    existingTotalVotes: { type: "number", minimum: 0 },
  },
  required: [
    "newShares",
    "existingShares",
    "votesPerNewShare",
    "existingTotalVotes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    economicShare: { type: "number" },
    votingShare: { type: "number" },
  },
  required: ["economicShare", "votingShare"],
} as const;
/** Compare newly issued shares’ economic count share with their voting share using explicit share classes and existing votes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { newShares, existingShares, votesPerNewShare, existingTotalVotes } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(newShares) &&
        newShares >= 0 &&
        newShares <= Number.MAX_SAFE_INTEGER,
      "newShares",
    ),
      newShares);
    (H.domain(
      Number.isSafeInteger(existingShares) &&
        existingShares >= 0 &&
        existingShares <= Number.MAX_SAFE_INTEGER,
      "existingShares",
    ),
      existingShares);
    H.domain(
      newShares + existingShares > 0 &&
        votesPerNewShare >= 0 &&
        existingTotalVotes >= 0 &&
        newShares * votesPerNewShare + existingTotalVotes > 0,
      "newShares",
    );
    return {
      economicShare: newShares / (newShares + existingShares),
      votingShare:
        (newShares * votesPerNewShare) /
        (newShares * votesPerNewShare + existingTotalVotes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    newShares: 100,
    existingShares: 900,
    votesPerNewShare: 10,
    existingTotalVotes: 900,
  },
  output: { economicShare: 0.1, votingShare: 0.5263157894736842 },
} satisfies ToolExample<Input, Output>;
export const shareIssuanceEconomicVoteShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/share-issuance-economic-vote-share",
    title: "Share Issuance Economic Vote Share",
    description:
      "Compare newly issued shares’ economic count share with their voting share using explicit share classes and existing votes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newShares: { type: "integer", minimum: 0 },
        existingShares: { type: "integer", minimum: 0 },
        votesPerNewShare: { type: "number", minimum: 0 },
        existingTotalVotes: { type: "number", minimum: 0 },
      },
      required: [
        "newShares",
        "existingShares",
        "votesPerNewShare",
        "existingTotalVotes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        economicShare: { type: "number" },
        votingShare: { type: "number" },
      },
      required: ["economicShare", "votingShare"],
    },
    ports: {
      inputs: [
        {
          id: "newShares",
          label: "New Shares",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "existingShares",
          label: "Existing Shares",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "votesPerNewShare",
          label: "Votes Per New Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "existingTotalVotes",
          label: "Existing Total Votes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "economicShare",
          label: "Economic Share",
          valueType: { type: "number" },
        },
        {
          id: "votingShare",
          label: "Voting Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shareIssuanceEconomicVoteShareTool.execute;
export default shareIssuanceEconomicVoteShareTool;
