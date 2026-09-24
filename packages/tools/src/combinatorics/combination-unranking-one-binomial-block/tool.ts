import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { binomial } from "../../math/pascal-row/tool.js";
export type Input = {
  readonly n: number;
  readonly k: number;
  readonly rank: string;
};
export type Output = {
  readonly skip: boolean;
  readonly nextRank: string;
  readonly blockSize: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: { type: "integer", minimum: 1, maximum: 128 },
    k: { type: "integer", minimum: 1 },
    rank: { type: "string", maxLength: 8192 },
  },
  required: ["n", "k", "rank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    skip: { type: "boolean" },
    nextRank: { type: "string", maxLength: 8192 },
    blockSize: { type: "string", maxLength: 8192 },
  },
  required: ["skip", "nextRank", "blockSize"],
} as const;
/** Compute combination unranking one binomial block from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { n, k, rank } = input;
  const compute = (): Output => {
    integer(n, 1, 128);
    integer(k, 1, n);
    const block = binomial(n - 1, k - 1);
    const r = decimal(rank);
    domain(r >= 0n);
    const skip = r >= block;
    return {
      skip,
      nextRank: (skip ? r - block : r).toString(),
      blockSize: block.toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { n: 5, k: 2, rank: "5" },
  output: { skip: true, nextRank: "1", blockSize: "4" },
} satisfies ToolExample<Input, Output>;
export const combinationUnrankingOneBinomialBlockTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/combination-unranking-one-binomial-block",
  title: "Combination Unranking One Binomial Block Tool",
  description:
    "Compute combination unranking one binomial block from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "n", label: "N", required: true, valueType: { type: "integer" } },
      { id: "k", label: "K", required: true, valueType: { type: "integer" } },
      {
        id: "rank",
        label: "Rank",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "skip", label: "Skip", valueType: { type: "boolean" } },
      { id: "nextRank", label: "Next Rank", valueType: { type: "string" } },
      { id: "blockSize", label: "Block Size", valueType: { type: "string" } },
    ],
  },
});
export const run = combinationUnrankingOneBinomialBlockTool.execute;
export default combinationUnrankingOneBinomialBlockTool;
