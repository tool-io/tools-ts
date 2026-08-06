import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";
import { randomGamma } from "../gamma-sampler/tool.js";

export const sampleBetaBinomial = (
  trials: number,
  alpha: number,
  beta: number,
  count: number,
  seed: string,
): number[] | null => {
  if (!seed.trim() || trials * count > 10_000_000) return null;
  const random = createSeededRandom(seed);
  const samples: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const first = randomGamma(alpha, random);
    const second = randomGamma(beta, random);
    if (first === null || second === null || first + second === 0) return null;
    const probability =
      first > second
        ? 1 / (1 + second / first)
        : first / second / (1 + first / second);
    let successes = 0;
    for (let trial = 0; trial < trials; trial += 1)
      if (random() < probability) successes += 1;
    samples.push(successes);
  }
  return samples;
};

export const betaBinomialExample = {
  input: { alpha: 2, beta: 5, count: 5, seed: "tool.io", trials: 10 },
  output: { samples: [2, 1, 6, 4, 3] },
} satisfies ToolExample<
  {
    readonly alpha: number;
    readonly beta: number;
    readonly count: number;
    readonly seed: string;
    readonly trials: number;
  },
  { readonly samples: readonly number[] }
>;

export const betaBinomialTool = createSimpleTool({
  id: "probability/beta-binomial-sampler",
  title: "Beta-Binomial Distribution Sampler",
  description:
    "Generate reproducible beta-binomial samples by drawing a probability from a beta distribution for every experiment.",
  inputs: [
    {
      id: "trials",
      kind: "integer",
      label: "Trials",
      maximum: 1_000_000,
      minimum: 0,
    },
    {
      id: "alpha",
      kind: "number",
      label: "Alpha",
      maximum: 1_000_000,
      minimum: Number.MIN_VALUE,
    },
    {
      id: "beta",
      kind: "number",
      label: "Beta",
      maximum: 1_000_000,
      minimum: Number.MIN_VALUE,
    },
    {
      id: "count",
      kind: "integer",
      label: "Sample count",
      maximum: 10_000,
      minimum: 1,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "sample/beta-binomial",
      id: "samples",
      kind: "numberList",
      label: "Samples",
    },
  ],
  calculate: (input) => {
    const samples = sampleBetaBinomial(
      input.trials as number,
      input.alpha as number,
      input.beta as number,
      input.count as number,
      input.seed as string,
    );
    if (!samples)
      return simpleError(
        "count",
        "The requested sample exceeds the work limit or has invalid parameters.",
      );
    return { samples };
  },
});

export const runBetaBinomial = betaBinomialTool.execute;
export default betaBinomialTool;
