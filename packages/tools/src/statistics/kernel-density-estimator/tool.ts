import {
  matchesModelInput,
  createModelDefinition,
  modelInputIssues,
} from "../../core/model-definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type KernelDensityEstimatorInput = {
  readonly bandwidth: number;
  readonly points: readonly number[];
  readonly sample: readonly number[];
};
export type KernelDensityEstimatorOutput = {
  readonly densities: readonly number[];
  readonly points: readonly number[];
  readonly sampleCount: number;
};
const boundedNumbers = {
  items: { type: "number" },
  maxItems: 512,
  minItems: 1,
  type: "array",
} as const;
export const inputSchema = {
  additionalProperties: false,
  properties: {
    bandwidth: {
      description:
        "Positive Gaussian kernel standard deviation in the sample's units, not a multiplier of sample standard deviation.",
      exclusiveMinimum: 0,
      type: "number",
    },
    points: boundedNumbers,
    sample: boundedNumbers,
  },
  required: ["bandwidth", "points", "sample"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    densities: {
      items: { minimum: 0, type: "number" },
      maxItems: 512,
      minItems: 1,
      type: "array",
    },
    points: boundedNumbers,
    sampleCount: { minimum: 1, maximum: 512, type: "integer" },
  },
  required: ["densities", "points", "sampleCount"],
  type: "object",
} as const;
const isInput = (input: unknown): input is KernelDensityEstimatorInput =>
  matchesModelInput(input, inputSchema);

/** Univariate equally weighted Gaussian KDE with an explicit absolute bandwidth. */
export const calculateKernelDensityEstimator = (
  input: unknown,
): ToolResult<KernelDensityEstimatorOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  const densities = input.points.map((point) => {
    let sum = 0;
    for (const observation of input.sample) {
      const difference = point - observation;
      const z = Number.isFinite(difference)
        ? difference / input.bandwidth
        : point / input.bandwidth - observation / input.bandwidth;
      sum += Math.exp(-0.5 * z * z);
    }
    return sum / input.sample.length / Math.sqrt(2 * Math.PI) / input.bandwidth;
  });
  if (densities.some((density) => !Number.isFinite(density)))
    return invalidInput([
      {
        code: "numeric_overflow",
        field: "bandwidth",
        message:
          "The selected bandwidth produces a density beyond the finite numeric range.",
      },
    ]);
  return toolSuccess({
    densities,
    points: [...input.points],
    sampleCount: input.sample.length,
  });
};
export const kernelDensityEstimatorExample = {
  input: { bandwidth: 1, points: [0, 1, 2], sample: [0, 2] },
  output: {
    densities: [0.22646662345731042, 0.24197072451914337, 0.22646662345731042],
    points: [0, 1, 2],
    sampleCount: 2,
  },
} satisfies ToolExample<
  KernelDensityEstimatorInput,
  KernelDensityEstimatorOutput
>;
export const kernelDensityEstimatorTool = createModelDefinition<
  KernelDensityEstimatorInput,
  KernelDensityEstimatorOutput
>({
  id: "statistics/kernel-density-estimator",
  title: "Gaussian Kernel Density Estimator",
  description:
    "Evaluate a univariate equally weighted Gaussian kernel density estimate at supplied points using an explicit absolute bandwidth, without automatic bandwidth selection or boundary correction.",
  inputSchema,
  outputSchema,
  execute: calculateKernelDensityEstimator,
});
export const runKernelDensityEstimator = kernelDensityEstimatorTool.execute;
export default kernelDensityEstimatorTool;
