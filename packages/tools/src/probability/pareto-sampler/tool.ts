import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export const samplePareto = (
  scale: number,
  shape: number,
  count: number,
  seed: string,
): number[] | null => {
  if (!seed.trim()) return null;
  const random = createSeededRandom(seed);
  const samples: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const sample =
      scale / Math.max(Number.EPSILON, 1 - random()) ** (1 / shape);
    if (!Number.isFinite(sample)) return null;
    samples.push(Number(sample.toPrecision(10)));
  }
  return samples;
};

export const paretoSamplerExample = {
  input: { count: 3, scale: 1, seed: "tool.io", shape: 2 },
  output: { samples: [1.087384071, 1.778823086, 1.158717486] },
} satisfies ToolExample<
  {
    readonly count: number;
    readonly scale: number;
    readonly seed: string;
    readonly shape: number;
  },
  { readonly samples: readonly number[] }
>;

export const paretoSamplerTool = createSimpleTool({
  id: "probability/pareto-sampler",
  title: "Pareto Distribution Sampler",
  description:
    "Generate reproducible Pareto Type I samples using inverse-transform sampling.",
  inputs: [
    {
      id: "scale",
      kind: "number",
      label: "Minimum scale",
      minimum: Number.MIN_VALUE,
    },
    { id: "shape", kind: "number", label: "Shape", minimum: Number.MIN_VALUE },
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
      format: "sample/pareto",
      id: "samples",
      kind: "numberList",
      label: "Pareto samples",
    },
  ],
  calculate: (input) => {
    const samples = samplePareto(
      input.scale as number,
      input.shape as number,
      input.count as number,
      input.seed as string,
    );
    if (!samples)
      return simpleError(
        "seed",
        "Enter a nonempty seed and valid Pareto parameters.",
      );
    return { samples };
  },
});

export const runParetoSampler = paretoSamplerTool.execute;
export default paretoSamplerTool;
