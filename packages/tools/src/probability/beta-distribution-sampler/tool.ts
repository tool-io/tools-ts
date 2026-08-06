import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";
import { randomGamma } from "../gamma-sampler/tool.js";

export type BetaDistributionSample = {
  readonly sampleMean: number;
  readonly samples: readonly number[];
  readonly theoreticalMean: number;
  readonly theoreticalVariance: number;
};

const round = (value: number): number => Number(value.toPrecision(12));

export const sampleBetaDistribution = (
  alpha: number,
  beta: number,
  sampleCount: number,
  seed: string,
): BetaDistributionSample | null => {
  if (!seed.trim()) return null;
  const random = createSeededRandom(seed);
  const samples: number[] = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const first = randomGamma(alpha, random);
    const second = randomGamma(beta, random);
    if (first === null || second === null || first + second === 0) return null;
    samples.push(round(first / (first + second)));
  }
  return {
    sampleMean: round(
      samples.reduce((sum, value) => sum + value, 0) / sampleCount,
    ),
    samples,
    theoreticalMean: round(alpha / (alpha + beta)),
    theoreticalVariance: round(
      (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1)),
    ),
  };
};

export const betaDistributionExample = {
  input: { alpha: 2, beta: 5, sampleCount: 3, seed: "tool.io" },
  output: {
    result: {
      sampleMean: 0.351736221304,
      samples: [0.28377496882, 0.277604872593, 0.4938288225],
      theoreticalMean: 0.285714285714,
      theoreticalVariance: 0.0255102040816,
    },
  },
} satisfies ToolExample<
  {
    readonly alpha: number;
    readonly beta: number;
    readonly sampleCount: number;
    readonly seed: string;
  },
  { readonly result: BetaDistributionSample }
>;

export const betaDistributionTool = createSimpleTool({
  id: "probability/beta-distribution-sampler",
  title: "Beta Distribution Sampler",
  description:
    "Generate reproducible beta-distributed values from two gamma variates.",
  inputs: [
    { id: "alpha", kind: "number", label: "Alpha", minimum: Number.MIN_VALUE },
    { id: "beta", kind: "number", label: "Beta", minimum: Number.MIN_VALUE },
    {
      id: "sampleCount",
      kind: "integer",
      label: "Samples",
      maximum: 5_000,
      minimum: 1,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "sample/beta",
      id: "result",
      kind: "object",
      label: "Beta samples",
    },
  ],
  calculate: (input) => {
    const result = sampleBetaDistribution(
      input.alpha as number,
      input.beta as number,
      input.sampleCount as number,
      input.seed as string,
    );
    if (!result)
      return simpleError(
        "seed",
        "Enter a nonempty seed and valid beta parameters.",
      );
    return { result };
  },
});

export const runBetaDistribution = betaDistributionTool.execute;
export default betaDistributionTool;
