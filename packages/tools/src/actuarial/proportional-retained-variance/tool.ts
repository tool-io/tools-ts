import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ProportionalRetainedVarianceInput = {
  readonly cededShare: number;
  readonly totalVariance: number;
};

export type ProportionalRetainedVarianceOutput = {
  readonly retainedVariance: number;
};

export const proportionalRetainedVarianceExample = {
  input: { cededShare: 0.2, totalVariance: 50000 },
  output: { retainedVariance: 32000.000000000007 },
} satisfies ToolExample<
  ProportionalRetainedVarianceInput,
  ProportionalRetainedVarianceOutput
>;

export const calculateProportionalRetainedVariance = (
  input: ProportionalRetainedVarianceInput,
): ProportionalRetainedVarianceOutput => {
  const retainedShare = 1 - input.cededShare;
  return { retainedVariance: retainedShare ** 2 * input.totalVariance };
};

export const proportionalRetainedVarianceTool = createSimpleTool({
  calculate: (input) =>
    calculateProportionalRetainedVariance({
      cededShare: input.cededShare as number,
      totalVariance: input.totalVariance as number,
    }),
  description:
    "Calculate retained aggregate-loss variance after proportional reinsurance by multiplying total variance by the square of the retained share.",
  id: "actuarial/proportional-retained-variance",
  inputs: [
    {
      description: "Proportion of every covered loss ceded to the reinsurer.",
      id: "cededShare",
      kind: "number",
      label: "Ceded share",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Variance of aggregate losses before reinsurance.",
      id: "totalVariance",
      kind: "number",
      label: "Total variance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Aggregate-loss variance retained by the insurer.",
      id: "retainedVariance",
      kind: "number",
      label: "Retained variance",
    },
  ],
  title: "Proportional Reinsurance Retained Variance Calculator",
});
export const runProportionalRetainedVariance =
  proportionalRetainedVarianceTool.execute;
export default proportionalRetainedVarianceTool;
