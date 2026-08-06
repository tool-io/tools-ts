import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  createSeededRandom,
  type RandomSource,
} from "../../random/seeded-number/tool.js";

const coefficients = [
  676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406,
  12.507343278686905, -0.13857109526572012, 9.984369578019572e-6,
  1.5056327351493116e-7,
];
const logGamma = (value: number): number => {
  const shifted = value - 1;
  let series = 0.9999999999998099;
  for (let index = 0; index < coefficients.length; index += 1)
    series += (coefficients[index] ?? 0) / (shifted + index + 1);
  const scale = shifted + coefficients.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) +
    (shifted + 0.5) * Math.log(scale) -
    scale +
    Math.log(series)
  );
};

export const randomPoisson = (
  rate: number,
  random: RandomSource,
): number | null => {
  if (!Number.isFinite(rate) || rate < 0) return null;
  if (rate === 0) return 0;
  if (rate <= 30) {
    const limit = Math.exp(-rate);
    let product = 1;
    let count = 0;
    do {
      count += 1;
      const sample = random();
      if (!Number.isFinite(sample) || sample < 0 || sample >= 1) return null;
      product *= sample;
    } while (product > limit);
    return count - 1;
  }
  const squareRoot = Math.sqrt(rate);
  const b = 0.931 + 2.53 * squareRoot;
  const a = -0.059 + 0.02483 * b;
  const inverseAlpha = 1.1239 + 1.1328 / (b - 3.4);
  const immediateAcceptance = 0.9277 - 3.6224 / (b - 2);
  for (let attempt = 0; attempt < 1_000_000; attempt += 1) {
    const first = random();
    const second = random();
    if (
      ![first, second].every(
        (value) => Number.isFinite(value) && value >= 0 && value < 1,
      )
    )
      return null;
    const centered = first - 0.5;
    const distance = 0.5 - Math.abs(centered);
    if (distance <= 0) continue;
    const sample = Math.floor(
      ((2 * a) / distance + b) * centered + rate + 0.43,
    );
    if (distance >= 0.07 && second <= immediateAcceptance && sample >= 0)
      return sample;
    if (sample < 0 || (distance < 0.013 && second > distance)) continue;
    const left = Math.log((second * inverseAlpha) / (a / distance ** 2 + b));
    const right = -rate + sample * Math.log(rate) - logGamma(sample + 1);
    if (left <= right) return sample;
  }
  return null;
};

export const samplePoisson = (
  rate: number,
  count: number,
  seed: string,
): number[] | null => {
  if (!seed.trim()) return null;
  const random = createSeededRandom(seed);
  const samples: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const sample = randomPoisson(rate, random);
    if (sample === null) return null;
    samples.push(sample);
  }
  return samples;
};

export const poissonSamplerExample = {
  input: { count: 5, rate: 4, seed: "tool.io" },
  output: { samples: [3, 7, 6, 1, 3] },
} satisfies ToolExample<
  { readonly count: number; readonly rate: number; readonly seed: string },
  { readonly samples: readonly number[] }
>;

export const poissonSamplerTool = createSimpleTool({
  id: "probability/poisson-sampler",
  title: "Poisson Distribution Sampler",
  description: "Generate reproducible Poisson-distributed event-count samples.",
  inputs: [
    {
      id: "rate",
      kind: "number",
      label: "Rate",
      maximum: 1_000_000,
      minimum: 0,
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
      format: "sample/poisson",
      id: "samples",
      kind: "numberList",
      label: "Poisson samples",
    },
  ],
  calculate: (input) => {
    const samples = samplePoisson(
      input.rate as number,
      input.count as number,
      input.seed as string,
    );
    if (!samples)
      return simpleError(
        "seed",
        "Enter a nonempty seed and valid Poisson parameters.",
      );
    return { samples };
  },
});

export const runPoissonSampler = poissonSamplerTool.execute;
export default poissonSamplerTool;
