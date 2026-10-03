import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly rank: number; readonly relevant: boolean };
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rank: { type: "integer", minimum: 1, maximum: 1000000 },
    relevant: { type: "boolean" },
  },
  required: ["rank", "relevant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Compute ranking discount shared item contribution from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { rank, relevant } = input;
  const compute = (): Output => {
    integer(rank, 1, 1000000);
    return { contribution: relevant ? 1 / Math.log2(rank + 1) : 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { rank: 1, relevant: true },
  output: { contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const rankingDiscountSharedItemContributionTool =
  defineSchemaCalculation<Input, Output>({
    id: "similarity/ranking-discount-shared-item-contribution",
    title: "Ranking Discount Shared Item Contribution Tool",
    description:
      "Compute ranking discount shared item contribution from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "rank",
          label: "Rank",
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
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = rankingDiscountSharedItemContributionTool.execute;
export default rankingDiscountSharedItemContributionTool;
