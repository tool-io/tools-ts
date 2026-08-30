import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly factorVarianceShares: readonly number[];
  readonly factorIndex: number;
}>;
export type Output = Readonly<{
  readonly selectedVarianceShare: number;
  readonly descendingRank: number;
  readonly cumulativeShareThroughRank: number;
  readonly topFactor: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.factorVarianceShares.length === 0 ||
    input.factorIndex >= input.factorVarianceShares.length ||
    input.factorVarianceShares.some((value) => value < 0)
  )
    simpleError(
      "factorIndex",
      "Variance shares must be nonempty and factor index valid.",
      "invalid_factors",
    );
  const selectedVarianceShare = input.factorVarianceShares[input.factorIndex],
    sorted = [...input.factorVarianceShares].sort((a, b) => b - a),
    descendingRank = sorted.indexOf(selectedVarianceShare) + 1;
  return {
    selectedVarianceShare,
    descendingRank,
    cumulativeShareThroughRank: sorted
      .slice(0, descendingRank)
      .reduce((a, b) => a + b, 0),
    topFactor: descendingRank === 1,
  };
};

export const exampleInput = {
  factorVarianceShares: [0.1, 0.4, 0.2],
  factorIndex: 2,
} satisfies Input;
export const exampleOutput = {
  selectedVarianceShare: 0.2,
  descendingRank: 2,
  cumulativeShareThroughRank: 0.6000000000000001,
  topFactor: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      factorVarianceShares: input.factorVarianceShares as readonly number[],
      factorIndex: input.factorIndex as number,
    }),
  description: "Rank a MOFA factor by explained variance share.",
  id: "epigenetics/mofa-factor-rank",
  inputs: [
    {
      id: "factorVarianceShares",
      label: "Factor variance shares",
      kind: "numberList",
    },
    {
      id: "factorIndex",
      label: "Zero-based factor index",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "selectedVarianceShare",
      label: "Selected factor variance share",
      kind: "number",
      minimum: 0,
    },
    {
      id: "descendingRank",
      label: "Descending variance rank",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "cumulativeShareThroughRank",
      label: "Cumulative share through rank",
      kind: "number",
      minimum: 0,
    },
    {
      id: "topFactor",
      label: "Selected factor has top share",
      kind: "boolean",
    },
  ],
  title: "MOFA Factor Rank",
});

export const run = tool.execute;
export default tool;
