import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  createSeededRandom,
  type RandomSource,
} from "../../random/seeded-number/tool.js";
import { randomNormal } from "../normal-box-muller-sampler/tool.js";

export const randomGamma = (
  shape: number,
  random: RandomSource,
): number | null => {
  if (!Number.isFinite(shape) || shape <= 0) return null;
  if (shape < 1) {
    const boosted = randomGamma(shape + 1, random);
    const uniform = random();
    return boosted === null || uniform < 0 || uniform >= 1
      ? null
      : boosted * uniform ** (1 / shape);
  }
  const offset = shape - 1 / 3;
  const scale = 1 / Math.sqrt(9 * offset);
  for (let attempt = 0; attempt < 1_000_000; attempt += 1) {
    const normal = randomNormal(random);
    if (normal === null) return null;
    const base = 1 + scale * normal;
    if (base <= 0) continue;
    const value = base ** 3;
    const uniform = random();
    if (!Number.isFinite(uniform) || uniform < 0 || uniform >= 1) return null;
    if (
      uniform < 1 - 0.0331 * normal ** 4 ||
      Math.log(uniform) <
        0.5 * normal ** 2 + offset * (1 - value + Math.log(value))
    )
      return offset * value;
  }
  return null;
};

export const sampleGamma = (
  shape: number,
  scale: number,
  count: number,
  seed: string,
): number[] | null => {
  if (!seed.trim()) return null;
  const random = createSeededRandom(seed);
  const samples: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const sample = randomGamma(shape, random);
    if (sample === null) return null;
    samples.push(Number((sample * scale).toPrecision(10)));
  }
  return samples;
};

export const gammaSamplerExample = {
  input: { count: 3, scale: 1, seed: "tool.io", shape: 2 },
  output: { samples: [0.8493906954, 0.3930250656, 1.502815904] },
} satisfies ToolExample<
  {
    readonly count: number;
    readonly scale: number;
    readonly seed: string;
    readonly shape: number;
  },
  { readonly samples: readonly number[] }
>;

export const gammaSamplerTool = createSimpleTool({
  id: "probability/gamma-sampler",
  title: "Gamma Distribution Sampler",
  description:
    "Generate reproducible gamma-distributed samples from a positive shape and scale.",
  inputs: [
    { id: "shape", kind: "number", label: "Shape", minimum: Number.MIN_VALUE },
    { id: "scale", kind: "number", label: "Scale", minimum: Number.MIN_VALUE },
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
      format: "sample/gamma",
      id: "samples",
      kind: "numberList",
      label: "Gamma samples",
    },
  ],
  calculate: (input) => {
    const samples = sampleGamma(
      input.shape as number,
      input.scale as number,
      input.count as number,
      input.seed as string,
    );
    if (!samples)
      return simpleError(
        "seed",
        "Enter a nonempty seed and valid gamma parameters.",
      );
    return { samples };
  },
});

export const runGammaSampler = gammaSamplerTool.execute;
export default gammaSamplerTool;
