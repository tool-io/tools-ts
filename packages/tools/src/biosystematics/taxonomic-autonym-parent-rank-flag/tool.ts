import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly epithet: string;
  readonly parentEpithet: string;
  readonly rank: string;
  readonly suppliedAutonymRanks: readonly string[];
};
export type Output = {
  readonly epithetMatches: boolean;
  readonly rankListed: boolean;
  readonly candidateUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    epithet: { type: "string", maxLength: 8192 },
    parentEpithet: { type: "string", maxLength: 8192 },
    rank: { type: "string", maxLength: 8192 },
    suppliedAutonymRanks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["epithet", "parentEpithet", "rank", "suppliedAutonymRanks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    epithetMatches: { type: "boolean" },
    rankListed: { type: "boolean" },
    candidateUnderFlags: { type: "boolean" },
  },
  required: ["epithetMatches", "rankListed", "candidateUnderFlags"],
} as const;
/** Inspect supplied autonym spelling/rank flags without asserting valid publication or nomenclatural status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { epithet, parentEpithet, rank, suppliedAutonymRanks } = request;
  const compute = (): Output => {
    const epithetMatches = epithet === parentEpithet,
      rankListed = suppliedAutonymRanks.includes(rank);
    return {
      epithetMatches,
      rankListed,
      candidateUnderFlags: epithetMatches && rankListed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    epithet: "alba",
    parentEpithet: "alba",
    rank: "var.",
    suppliedAutonymRanks: ["var.", "subsp."],
  },
  output: { epithetMatches: true, rankListed: true, candidateUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const taxonomicAutonymParentRankFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-autonym-parent-rank-flag",
    title: "Taxonomic Autonym Parent Rank Flag Tool",
    description:
      "Inspect supplied autonym spelling/rank flags without asserting valid publication or nomenclatural status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        epithet: { type: "string", maxLength: 8192 },
        parentEpithet: { type: "string", maxLength: 8192 },
        rank: { type: "string", maxLength: 8192 },
        suppliedAutonymRanks: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["epithet", "parentEpithet", "rank", "suppliedAutonymRanks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        epithetMatches: { type: "boolean" },
        rankListed: { type: "boolean" },
        candidateUnderFlags: { type: "boolean" },
      },
      required: ["epithetMatches", "rankListed", "candidateUnderFlags"],
    },
    ports: {
      inputs: [
        {
          id: "epithet",
          label: "Epithet",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentEpithet",
          label: "Parent Epithet",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rank",
          label: "Rank",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAutonymRanks",
          label: "Supplied Autonym Ranks",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "epithetMatches",
          label: "Epithet Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "rankListed",
          label: "Rank Listed",
          valueType: { type: "boolean" },
        },
        {
          id: "candidateUnderFlags",
          label: "Candidate Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonomicAutonymParentRankFlagTool.execute;
export default taxonomicAutonymParentRankFlagTool;
