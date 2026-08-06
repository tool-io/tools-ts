import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export const sampleBinomial = (
  trials: number,
  probability: number,
  count: number,
  seed: string,
): number[] | null => {
  if (!seed.trim() || trials * count > 10_000_000) return null;
  const random = createSeededRandom(seed);
  return Array.from({ length: count }, () => {
    if (probability === 0) return 0;
    if (probability === 1) return trials;
    let successes = 0;
    for (let trial = 0; trial < trials; trial += 1)
      if (random() < probability) successes += 1;
    return successes;
  });
};

export const binomialSamplerExample = {
  input: { count: 5, probability: 0.5, seed: "tool.io", trials: 10 },
  output: { samples: [3, 3, 5, 5, 6] },
} satisfies ToolExample<
  {
    readonly count: number;
    readonly probability: number;
    readonly seed: string;
    readonly trials: number;
  },
  { readonly samples: readonly number[] }
>;

export const binomialSamplerTool = createSimpleTool({
  id: "probability/binomial-sampler",
  title: "Binomial Distribution Sampler",
  description: "Generate reproducible binomial random samples.",
  inputs: [
    {
      id: "trials",
      kind: "integer",
      label: "Trials",
      maximum: 1_000_000,
      minimum: 0,
    },
    {
      format: "probability",
      id: "probability",
      kind: "number",
      label: "Success probability",
      maximum: 1,
      minimum: 0,
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
      format: "sample/binomial",
      id: "samples",
      kind: "numberList",
      label: "Samples",
    },
  ],
  calculate: (input) => {
    const samples = sampleBinomial(
      input.trials as number,
      input.probability as number,
      input.count as number,
      input.seed as string,
    );
    if (!samples)
      return simpleError(
        "count",
        "The requested sample exceeds the work limit or has a blank seed.",
      );
    return { samples };
  },
});

export const runBinomialSampler = binomialSamplerTool.execute;
export default binomialSamplerTool;
