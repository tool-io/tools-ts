import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";
import { randomGamma } from "../gamma-sampler/tool.js";
import { randomPoisson } from "../poisson-sampler/tool.js";

export const samplePoissonGammaMixture = (
  shape: number,
  scale: number,
  count: number,
  seed: string,
): number[] | null => {
  if (!seed.trim() || shape * scale > 1_000_000) return null;
  const random = createSeededRandom(seed);
  const samples: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const gamma = randomGamma(shape, random);
    if (gamma === null) return null;
    const rate = gamma * scale;
    if (!Number.isFinite(rate) || rate > 1_000_000) return null;
    const poisson = randomPoisson(rate, random);
    if (poisson === null) return null;
    samples.push(poisson);
  }
  return samples;
};

export const poissonGammaMixtureExample = {
  input: { count: 5, scale: 2, seed: "tool.io", shape: 3 },
  output: { samples: [4, 8, 3, 8, 12] },
} satisfies ToolExample<
  {
    readonly count: number;
    readonly scale: number;
    readonly seed: string;
    readonly shape: number;
  },
  { readonly samples: readonly number[] }
>;

export const poissonGammaMixtureTool = createSimpleTool({
  id: "probability/poisson-gamma-mixture-sampler",
  title: "Poisson-Gamma Mixture Sampler",
  description:
    "Generate reproducible overdispersed counts by mixing a Poisson rate with a gamma distribution.",
  inputs: [
    {
      id: "shape",
      kind: "number",
      label: "Gamma shape",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "scale",
      kind: "number",
      label: "Gamma scale",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "count",
      kind: "integer",
      label: "Sample count",
      maximum: 100_000,
      minimum: 1,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "sample/poisson-gamma",
      id: "samples",
      kind: "numberList",
      label: "Mixture samples",
    },
  ],
  calculate: (input) => {
    const samples = samplePoissonGammaMixture(
      input.shape as number,
      input.scale as number,
      input.count as number,
      input.seed as string,
    );
    if (!samples)
      return simpleError(
        "shape",
        "Enter valid mixture parameters and a nonempty seed.",
      );
    return { samples };
  },
});

export const runPoissonGammaMixture = poissonGammaMixtureTool.execute;
export default poissonGammaMixtureTool;
