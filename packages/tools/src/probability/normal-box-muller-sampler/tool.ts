import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  createSeededRandom,
  type RandomSource,
} from "../../random/seeded-number/tool.js";

export const randomNormal = (random: RandomSource): number | null => {
  const firstSample = random();
  const second = random();
  if (
    !Number.isFinite(firstSample) ||
    firstSample < 0 ||
    firstSample >= 1 ||
    !Number.isFinite(second) ||
    second < 0 ||
    second >= 1
  )
    return null;
  const first = Math.max(Number.EPSILON, firstSample);
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
};

export const sampleNormalBoxMuller = (
  mean: number,
  standardDeviation: number,
  count: number,
  seed: string,
): number[] | null => {
  if (!seed.trim()) return null;
  const random = createSeededRandom(seed);
  const samples: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const standardNormal = randomNormal(random);
    if (standardNormal === null) return null;
    const sample = mean + standardDeviation * standardNormal;
    if (!Number.isFinite(sample)) return null;
    samples.push(Number(sample.toPrecision(10)));
  }
  return samples;
};

export const normalBoxMullerExample = {
  input: { count: 3, mean: 0, seed: "tool.io", standardDeviation: 1 },
  output: { samples: [-0.7793758407, 1.132146443, -0.7168054825] },
} satisfies ToolExample<
  {
    readonly count: number;
    readonly mean: number;
    readonly seed: string;
    readonly standardDeviation: number;
  },
  { readonly samples: readonly number[] }
>;

export const normalBoxMullerTool = createSimpleTool({
  id: "probability/normal-box-muller-sampler",
  title: "Normal Distribution Box-Muller Sampler",
  description:
    "Generate reproducible normally distributed samples with the Box-Muller transform.",
  inputs: [
    { id: "mean", kind: "number", label: "Mean" },
    {
      id: "standardDeviation",
      kind: "number",
      label: "Standard deviation",
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
      format: "sample/normal",
      id: "samples",
      kind: "numberList",
      label: "Normal samples",
    },
  ],
  calculate: (input) => {
    const samples = sampleNormalBoxMuller(
      input.mean as number,
      input.standardDeviation as number,
      input.count as number,
      input.seed as string,
    );
    if (!samples)
      return simpleError(
        "seed",
        "Enter a nonempty seed and finite parameters.",
      );
    return { samples };
  },
});

export const runNormalBoxMuller = normalBoxMullerTool.execute;
export default normalBoxMullerTool;
