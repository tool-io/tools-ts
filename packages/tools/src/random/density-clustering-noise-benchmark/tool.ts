import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { runOptics, type OpticsPoint } from "../../clustering/optics/tool.js";
import {
  clusterGroupsSchema,
  clusterPointsSchema,
  clusterVectorSchema,
  clusterLabelsSchema,
  validateSyntheticClusterGroups,
  sampleSyntheticClusterRows,
  checkClusterWork,
  type SyntheticClusterGroup,
  type SyntheticClusterRow,
} from "../cluster-benchmark-construction.js";

export type DensityClusteringNoiseBenchmarkInput = {
  readonly clusters: readonly SyntheticClusterGroup[];
  readonly noiseCount: number;
  readonly noiseLower: readonly number[];
  readonly noiseUpper: readonly number[];
  readonly epsilon: number;
  readonly minimumPoints: number;
  readonly seed?: number;
};
export type DensityClusteringNoiseBenchmarkOutput = {
  readonly points: readonly (readonly number[])[];
  readonly sourceLabels: readonly number[];
  readonly ordering: readonly (OpticsPoint & {
    readonly sourceLabel: number;
    readonly injectedNoise: boolean;
  })[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: clusterGroupsSchema,
    noiseCount: { type: "integer", minimum: 0, maximum: 64 },
    noiseLower: clusterVectorSchema,
    noiseUpper: clusterVectorSchema,
    epsilon: { type: "number", exclusiveMinimum: 0 },
    minimumPoints: { type: "integer", minimum: 2, maximum: 128 },
    seed: generatorSeedSchema,
  },
  required: [
    "clusters",
    "noiseCount",
    "noiseLower",
    "noiseUpper",
    "epsilon",
    "minimumPoints",
  ],
} as const;
const nullableDistance = {
  anyOf: [{ type: "number", minimum: 0 }, { type: "null" }],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: clusterPointsSchema,
    sourceLabels: clusterLabelsSchema,
    ordering: {
      type: "array",
      minItems: 2,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          coreDistance: nullableDistance,
          index: { type: "integer", minimum: 0, maximum: 127 },
          point: clusterVectorSchema,
          reachabilityDistance: nullableDistance,
          sourceLabel: { type: "integer", minimum: -1, maximum: 7 },
          injectedNoise: { type: "boolean" },
        },
        required: [
          "coreDistance",
          "index",
          "point",
          "reachabilityDistance",
          "sourceLabel",
          "injectedNoise",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["points", "sourceLabels", "ordering", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is DensityClusteringNoiseBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateDensityClusteringNoiseBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DensityClusteringNoiseBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const dimension = validateSyntheticClusterGroups(
        input.clusters,
        input.noiseCount,
      ),
      count = input.clusters.reduce(
        (sum, group) => sum + group.pointCount,
        input.noiseCount,
      );
    if (
      input.noiseLower.length !== dimension ||
      input.noiseUpper.length !== dimension ||
      input.noiseLower.some((value, i) => value > input.noiseUpper[i])
    )
      simpleError(
        "noiseUpper",
        "Noise bounds must align with the group dimensions and be ordered.",
        "invalid_noise_bounds",
      );
    if (input.minimumPoints > count)
      simpleError(
        "minimumPoints",
        "The neighborhood count exceeds all generated points.",
        "insufficient_points",
      );
    checkClusterWork(count * count * count * dimension);
    const random = createGeneratorRandom(input.seed, context),
      rows: SyntheticClusterRow[] = sampleSyntheticClusterRows(
        input.clusters,
        random,
      );
    for (let i = 0; i < input.noiseCount; i += 1)
      rows.push({
        label: -1,
        point: input.noiseLower.map((low, d) => {
          const draw = random.unit(),
            high = input.noiseUpper[d],
            value = low === high ? low : (1 - draw) * low + draw * high;
          if (!Number.isFinite(value))
            simpleError(
              "noiseUpper",
              "A noise coordinate exceeds the finite numeric domain.",
              "numeric_overflow",
            );
          return value === 0 ? 0 : value;
        }),
      });
    const shuffled = random.shuffle(rows),
      points = shuffled.map((row) => [...row.point]),
      sourceLabels = shuffled.map((row) => row.label);
    for (let i = 0; i < points.length; i += 1)
      for (let j = i + 1; j < points.length; j += 1)
        if (
          !Number.isFinite(
            Math.hypot(...points[i].map((value, d) => value - points[j][d])),
          )
        )
          simpleError(
            "clusters",
            "Pairwise distances must remain finite in the original coordinate units.",
            "distance_overflow",
          );
    const fitted = runOptics(points, input.epsilon, input.minimumPoints);
    if (fitted === null)
      throw new Error("A bounded point set failed OPTICS input requirements.");
    const ordering = fitted.map((row) => ({
      ...row,
      sourceLabel: sourceLabels[row.index],
      injectedNoise: sourceLabels[row.index] === -1,
    }));
    return toolSuccess({
      points,
      sourceLabels,
      ordering,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const densityClusteringNoiseBenchmarkExample = {
  input: {
    clusters: [
      {
        center: [0],
        standardDeviation: 0,
        pointCount: 2,
      },
      {
        center: [4],
        standardDeviation: 0,
        pointCount: 2,
      },
    ],
    noiseCount: 1,
    noiseLower: [8],
    noiseUpper: [9],
    epsilon: 0.5,
    minimumPoints: 2,
    seed: 42,
  },
  output: {
    points: [[4], [0], [8.865474648308009], [0], [4]],
    sourceLabels: [1, 0, -1, 0, 1],
    ordering: [
      {
        coreDistance: 0,
        index: 0,
        point: [4],
        reachabilityDistance: null,
        sourceLabel: 1,
        injectedNoise: false,
      },
      {
        coreDistance: 0,
        index: 4,
        point: [4],
        reachabilityDistance: 0,
        sourceLabel: 1,
        injectedNoise: false,
      },
      {
        coreDistance: 0,
        index: 1,
        point: [0],
        reachabilityDistance: null,
        sourceLabel: 0,
        injectedNoise: false,
      },
      {
        coreDistance: 0,
        index: 3,
        point: [0],
        reachabilityDistance: 0,
        sourceLabel: 0,
        injectedNoise: false,
      },
      {
        coreDistance: null,
        index: 2,
        point: [8.865474648308009],
        reachabilityDistance: null,
        sourceLabel: -1,
        injectedNoise: true,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  DensityClusteringNoiseBenchmarkInput,
  DensityClusteringNoiseBenchmarkOutput
>;
export const densityClusteringNoiseBenchmarkTool = createModelDefinition<
  DensityClusteringNoiseBenchmarkInput,
  DensityClusteringNoiseBenchmarkOutput
>({
  id: "random/density-clustering-noise-benchmark",
  title: "Random Density Clustering Noise Benchmark Generator",
  description:
    "Generate labeled Gaussian groups plus uniformly drawn injected-noise points and delegate OPTICS ordering in the original coordinate units; retain null reachability/core distances and inherited ten-significant-digit distances without inventing cluster labels or equating injected noise with algorithmic noise.",
  inputSchema,
  outputSchema,
  execute: calculateDensityClusteringNoiseBenchmark,
});
export const runDensityClusteringNoiseBenchmark =
  densityClusteringNoiseBenchmarkTool.execute;
export default densityClusteringNoiseBenchmarkTool;
