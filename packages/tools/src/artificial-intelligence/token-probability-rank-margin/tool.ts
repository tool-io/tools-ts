import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly tokenIndex: number;
};
export type Output = {
  readonly rank: number;
  readonly marginToNext: number;
  readonly hasNext: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    tokenIndex: { type: "integer", minimum: 0 },
  },
  required: ["probabilities", "tokenIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rank: { type: "integer" },
    marginToNext: { type: "number" },
    hasNext: { type: "boolean" },
  },
  required: ["rank", "marginToNext", "hasNext"],
} as const;
/** Rank one supplied token probability with competition ties and compare to the next strictly lower probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, tokenIndex } = request;
  const compute = (): Output => {
    H.domain(
      probabilities.length > 0 && probabilities.every((x) => x >= 0 && x <= 1),
    );
    H.integer(tokenIndex, 0, probabilities.length - 1);
    const p = probabilities[tokenIndex],
      lower = probabilities.filter((x) => x < p);
    return {
      rank: 1 + probabilities.filter((x) => x > p).length,
      marginToNext: lower.length ? p - Math.max(...lower) : 0,
      hasNext: lower.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.5, 0.3, 0.2], tokenIndex: 1 },
  output: { rank: 2, marginToNext: 0.09999999999999998, hasNext: true },
} satisfies ToolExample<Input, Output>;
export const tokenProbabilityRankMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/token-probability-rank-margin",
    title: "Token Probability Rank Margin Tool",
    description:
      "Rank one supplied token probability with competition ties and compare to the next strictly lower probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        tokenIndex: { type: "integer", minimum: 0 },
      },
      required: ["probabilities", "tokenIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rank: { type: "integer" },
        marginToNext: { type: "number" },
        hasNext: { type: "boolean" },
      },
      required: ["rank", "marginToNext", "hasNext"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tokenIndex",
          label: "Token Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "rank", label: "Rank", valueType: { type: "integer" } },
        {
          id: "marginToNext",
          label: "Margin To Next",
          valueType: { type: "number" },
        },
        { id: "hasNext", label: "Has Next", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tokenProbabilityRankMarginTool.execute;
export default tokenProbabilityRankMarginTool;
