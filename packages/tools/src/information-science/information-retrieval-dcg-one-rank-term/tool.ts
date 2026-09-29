import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly relevance: number;
  readonly rank: number;
  readonly exponentialGain: boolean;
};
export type Output = {
  readonly gain: number;
  readonly discount: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relevance: { type: "number", minimum: 0 },
    rank: { type: "integer", minimum: 1 },
    exponentialGain: { type: "boolean" },
  },
  required: ["relevance", "rank", "exponentialGain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gain: { type: "number" },
    discount: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["gain", "discount", "contribution"],
} as const;
/** One DCG contribution with explicit linear versus exponential gain and one-based rank. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { relevance, rank, exponentialGain } = request;
  const compute = (): Output => {
    H.domain(relevance >= 0);
    H.integer(rank, 1);
    return {
      gain: exponentialGain ? 2 ** relevance - 1 : relevance,
      discount: 1 / Math.log2(rank + 1),
      contribution:
        (exponentialGain ? 2 ** relevance - 1 : relevance) /
        Math.log2(rank + 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { relevance: 3, rank: 3, exponentialGain: true },
  output: { gain: 7, discount: 0.5, contribution: 3.5 },
} satisfies ToolExample<Input, Output>;
export const informationRetrievalDcgOneRankTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/information-retrieval-dcg-one-rank-term",
    title: "Information Retrieval Dcg One Rank Term Tool",
    description:
      "One DCG contribution with explicit linear versus exponential gain and one-based rank.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relevance: { type: "number", minimum: 0 },
        rank: { type: "integer", minimum: 1 },
        exponentialGain: { type: "boolean" },
      },
      required: ["relevance", "rank", "exponentialGain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gain: { type: "number" },
        discount: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["gain", "discount", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "relevance",
          label: "Relevance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rank",
          label: "Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exponentialGain",
          label: "Exponential Gain",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gain", label: "Gain", valueType: { type: "number" } },
        { id: "discount", label: "Discount", valueType: { type: "number" } },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = informationRetrievalDcgOneRankTermTool.execute;
export default informationRetrievalDcgOneRankTermTool;
