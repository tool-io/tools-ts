import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly votes: readonly string[];
  readonly weights: readonly number[];
  readonly supportLabel: string;
  readonly oppositionLabel: string;
};
export type Output = {
  readonly supportWeight: number;
  readonly oppositionWeight: number;
  readonly netWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    votes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    supportLabel: { type: "string", maxLength: 8192 },
    oppositionLabel: { type: "string", maxLength: 8192 },
  },
  required: ["votes", "weights", "supportLabel", "oppositionLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportWeight: { type: "number" },
    oppositionWeight: { type: "number" },
    netWeight: { type: "number" },
  },
  required: ["supportWeight", "oppositionWeight", "netWeight"],
} as const;
/** Balance explicit public vote weights; no institutional voting rule or inferred position. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { votes, weights, supportLabel, oppositionLabel } = request;
  const compute = (): Output => {
    H.sameLength(votes, weights);
    H.domain(supportLabel !== oppositionLabel && weights.every((x) => x >= 0));
    return (() => {
      const supportWeight = weights.reduce(
          (s, w, i) => s + (votes[i] === supportLabel ? w : 0),
          0,
        ),
        oppositionWeight = weights.reduce(
          (s, w, i) => s + (votes[i] === oppositionLabel ? w : 0),
          0,
        );
      return {
        supportWeight,
        oppositionWeight,
        netWeight: supportWeight - oppositionWeight,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    votes: ["yes", "no", "abstain"],
    weights: [2, 1, 3],
    supportLabel: "yes",
    oppositionLabel: "no",
  },
  output: { supportWeight: 2, oppositionWeight: 1, netWeight: 1 },
} satisfies ToolExample<Input, Output>;
export const publicResolutionVoteWeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/public-resolution-vote-weight-gap",
    title: "Public Resolution Vote Weight Gap Tool",
    description:
      "Balance explicit public vote weights; no institutional voting rule or inferred position.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        votes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        supportLabel: { type: "string", maxLength: 8192 },
        oppositionLabel: { type: "string", maxLength: 8192 },
      },
      required: ["votes", "weights", "supportLabel", "oppositionLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportWeight: { type: "number" },
        oppositionWeight: { type: "number" },
        netWeight: { type: "number" },
      },
      required: ["supportWeight", "oppositionWeight", "netWeight"],
    },
    ports: {
      inputs: [
        {
          id: "votes",
          label: "Votes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "supportLabel",
          label: "Support Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oppositionLabel",
          label: "Opposition Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "supportWeight",
          label: "Support Weight",
          valueType: { type: "number" },
        },
        {
          id: "oppositionWeight",
          label: "Opposition Weight",
          valueType: { type: "number" },
        },
        { id: "netWeight", label: "Net Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicResolutionVoteWeightGapTool.execute;
export default publicResolutionVoteWeightGapTool;
