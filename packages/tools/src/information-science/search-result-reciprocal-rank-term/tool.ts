import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rank: number;
  readonly queryCount: number;
  readonly relevant: boolean;
};
export type Output = {
  readonly reciprocalRank: number;
  readonly meanContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rank: { type: "integer", minimum: 1 },
    queryCount: { type: "integer", minimum: 1 },
    relevant: { type: "boolean" },
  },
  required: ["rank", "queryCount", "relevant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reciprocalRank: { type: "number" },
    meanContribution: { type: "number" },
  },
  required: ["reciprocalRank", "meanContribution"],
} as const;
/** One first-relevant-result reciprocal-rank contribution; caller must identify the first relevant result and total query denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rank, queryCount, relevant } = request;
  const compute = (): Output => {
    H.integer(rank, 1);
    H.integer(queryCount, 1);
    return {
      reciprocalRank: relevant ? 1 / rank : 0,
      meanContribution: relevant ? 1 / (rank * queryCount) : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rank: 4, queryCount: 10, relevant: true },
  output: { reciprocalRank: 0.25, meanContribution: 0.025 },
} satisfies ToolExample<Input, Output>;
export const searchResultReciprocalRankTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/search-result-reciprocal-rank-term",
    title: "Search Result Reciprocal Rank Term Tool",
    description:
      "One first-relevant-result reciprocal-rank contribution; caller must identify the first relevant result and total query denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rank: { type: "integer", minimum: 1 },
        queryCount: { type: "integer", minimum: 1 },
        relevant: { type: "boolean" },
      },
      required: ["rank", "queryCount", "relevant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reciprocalRank: { type: "number" },
        meanContribution: { type: "number" },
      },
      required: ["reciprocalRank", "meanContribution"],
    },
    ports: {
      inputs: [
        {
          id: "rank",
          label: "Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "queryCount",
          label: "Query Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "relevant",
          label: "Relevant",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reciprocalRank",
          label: "Reciprocal Rank",
          valueType: { type: "number" },
        },
        {
          id: "meanContribution",
          label: "Mean Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = searchResultReciprocalRankTermTool.execute;
export default searchResultReciprocalRankTermTool;
