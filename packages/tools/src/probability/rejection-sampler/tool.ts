import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type RejectionSample = {
  readonly acceptanceRate: number;
  readonly attempts: number;
  readonly samples: readonly number[];
};

export const sampleStandardNormalByRejection = (
  count: number,
  minimum: number,
  maximum: number,
  seed: string,
): RejectionSample | null => {
  if (
    !seed.trim() ||
    minimum >= maximum ||
    maximum - minimum > 100 ||
    Math.abs(minimum) > 40 ||
    Math.abs(maximum) > 40
  )
    return null;
  const random = createSeededRandom(seed);
  const closestToZero = minimum > 0 ? minimum : maximum < 0 ? maximum : 0;
  const samples: number[] = [];
  let attempts = 0;
  const maximumAttempts = Math.min(10_000_000, count * 10_000);
  while (samples.length < count && attempts < maximumAttempts) {
    attempts += 1;
    const candidate = minimum + random() * (maximum - minimum);
    const densityDifference =
      -0.5 * (candidate - closestToZero) * (candidate + closestToZero);
    if (Math.log(random()) <= densityDifference)
      samples.push(Number(candidate.toPrecision(10)));
  }
  return samples.length === count
    ? {
        acceptanceRate: Number((count / attempts).toPrecision(8)),
        attempts,
        samples,
      }
    : null;
};

export const rejectionSamplerExample = {
  input: { count: 3, maximum: 4, minimum: -4, seed: "tool.io" },
  output: {
    result: {
      acceptanceRate: 0.6,
      attempts: 5,
      samples: [-1.958471488, 0.9531751107, 0.3924683109],
    },
  },
} satisfies ToolExample<
  {
    readonly count: number;
    readonly maximum: number;
    readonly minimum: number;
    readonly seed: string;
  },
  { readonly result: RejectionSample }
>;

export const rejectionSamplerTool = createSimpleTool({
  id: "probability/rejection-sampler",
  title: "Rejection Sampler",
  description:
    "Draw reproducible standard-normal samples truncated to an interval using uniform rejection sampling.",
  inputs: [
    {
      id: "count",
      kind: "integer",
      label: "Sample count",
      maximum: 10_000,
      minimum: 1,
    },
    {
      id: "minimum",
      kind: "number",
      label: "Minimum",
      maximum: 40,
      minimum: -40,
    },
    {
      id: "maximum",
      kind: "number",
      label: "Maximum",
      maximum: 40,
      minimum: -40,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "sample/rejection",
      id: "result",
      kind: "object",
      label: "Samples",
    },
  ],
  calculate: (input) => {
    const result = sampleStandardNormalByRejection(
      input.count as number,
      input.minimum as number,
      input.maximum as number,
      input.seed as string,
    );
    if (!result)
      return simpleError(
        "minimum",
        "Enter an ordered interval, a nonempty seed, and a feasible sample count.",
      );
    return { result };
  },
});

export const runRejectionSampler = rejectionSamplerTool.execute;
export default rejectionSamplerTool;
