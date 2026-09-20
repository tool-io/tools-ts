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
import { initializeKMeansPlusPlus } from "../../clustering/k-means-plus-plus/tool.js";
import {
  clusterGroupsSchema,
  clusterPointsSchema,
  clusterLabelsSchema,
  validateSyntheticClusterGroups,
  shuffledSyntheticClusterDataset,
  normalizeClusterPoints,
  normalizedClusterSquaredDistance,
  checkClusterWork,
  type SyntheticClusterGroup,
} from "../cluster-benchmark-construction.js";

export type ClusterInitializationSensitivityBenchmarkInput = {
  readonly clusters: readonly SyntheticClusterGroup[];
  readonly centerCount: number;
  readonly initializationSeeds: readonly number[];
  readonly seed?: number;
};
export type ClusterInitializationSensitivityBenchmarkOutput = {
  readonly points: readonly (readonly number[])[];
  readonly sourceLabels: readonly number[];
  readonly distanceScale: number;
  readonly runs: readonly {
    readonly seed: number;
    readonly effectiveSeed: number;
    readonly centroidIndices: readonly number[];
    readonly centroids: readonly (readonly number[])[];
    readonly nearestCenterIndices: readonly number[];
    readonly squaredDistances: readonly number[];
    readonly normalizedSse: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: clusterGroupsSchema,
    centerCount: { type: "integer", minimum: 1, maximum: 8 },
    initializationSeeds: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: generatorSeedSchema,
    },
    seed: generatorSeedSchema,
  },
  required: ["clusters", "centerCount", "initializationSeeds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: clusterPointsSchema,
    sourceLabels: clusterLabelsSchema,
    distanceScale: { type: "number", exclusiveMinimum: 0 },
    runs: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          seed: generatorSeedSchema,
          effectiveSeed: { type: "integer", minimum: 0, maximum: 4294967295 },
          centroidIndices: {
            type: "array",
            minItems: 1,
            maxItems: 8,
            items: { type: "integer", minimum: 0, maximum: 127 },
          },
          centroids: { ...clusterPointsSchema, maxItems: 8 },
          nearestCenterIndices: {
            type: "array",
            minItems: 1,
            maxItems: 128,
            items: { type: "integer", minimum: 0, maximum: 7 },
          },
          squaredDistances: {
            type: "array",
            minItems: 1,
            maxItems: 128,
            items: { type: "number", minimum: 0 },
          },
          normalizedSse: { type: "number", minimum: 0 },
        },
        required: [
          "seed",
          "effectiveSeed",
          "centroidIndices",
          "centroids",
          "nearestCenterIndices",
          "squaredDistances",
          "normalizedSse",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["points", "sourceLabels", "distanceScale", "runs", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is ClusterInitializationSensitivityBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateClusterInitializationSensitivityBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ClusterInitializationSensitivityBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const dimension = validateSyntheticClusterGroups(input.clusters),
      count = input.clusters.reduce((sum, group) => sum + group.pointCount, 0);
    if (input.centerCount > count)
      simpleError(
        "centerCount",
        "The requested number of starting centers exceeds the point count.",
        "invalid_center_count",
      );
    if (!input.initializationSeeds.every(Number.isSafeInteger))
      simpleError(
        "initializationSeeds",
        "Every initialization seed must be a safe integer.",
        "invalid_seed",
      );
    checkClusterWork(
      count *
        dimension *
        input.centerCount *
        input.centerCount *
        input.initializationSeeds.length,
    );
    const random = createGeneratorRandom(input.seed, context),
      { points, sourceLabels } = shuffledSyntheticClusterDataset(
        input.clusters,
        random,
      ),
      { distanceScale, normalized } = normalizeClusterPoints(points);
    const runs = input.initializationSeeds.map((seed) => {
      const initializationRandom = createGeneratorRandom(seed),
        initialized = initializeKMeansPlusPlus(
          { points: normalized, clusters: input.centerCount },
          { random: initializationRandom.unit },
        );
      if (!initialized.ok)
        throw new Error(
          "A bounded normalized point set failed k-means++ initialization.",
        );
      const nearestCenterIndices: number[] = [],
        squaredDistances = normalized.map((point) => {
          const distances = initialized.output.centroids.map((center) =>
            normalizedClusterSquaredDistance(point, center),
          );
          let nearest = 0;
          for (let i = 1; i < distances.length; i += 1)
            if (distances[i] < distances[nearest]) nearest = i;
          nearestCenterIndices.push(nearest);
          return distances[nearest];
        });
      return {
        seed,
        effectiveSeed: seed >>> 0,
        centroidIndices: initialized.output.centroidIndices,
        centroids: initialized.output.centroidIndices.map((i) => points[i]),
        nearestCenterIndices,
        squaredDistances,
        normalizedSse: squaredDistances.reduce((sum, value) => sum + value, 0),
      };
    });
    return toolSuccess({
      points,
      sourceLabels,
      distanceScale,
      runs,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const clusterInitializationSensitivityBenchmarkExample = {
  input: {
    clusters: [
      {
        center: [0],
        standardDeviation: 0,
        pointCount: 2,
      },
      {
        center: [2],
        standardDeviation: 0,
        pointCount: 2,
      },
      {
        center: [10],
        standardDeviation: 0,
        pointCount: 2,
      },
    ],
    centerCount: 2,
    initializationSeeds: [1, 7, 42],
    seed: 42,
  },
  output: {
    points: [[2], [2], [10], [0], [0], [10]],
    sourceLabels: [1, 1, 2, 0, 0, 2],
    distanceScale: 10,
    runs: [
      {
        seed: 1,
        effectiveSeed: 1,
        centroidIndices: [3, 0],
        centroids: [[0], [2]],
        nearestCenterIndices: [1, 1, 1, 0, 0, 1],
        squaredDistances: [0, 0, 0.6400000000000001, 0, 0, 0.6400000000000001],
        normalizedSse: 1.2800000000000002,
      },
      {
        seed: 7,
        effectiveSeed: 7,
        centroidIndices: [0, 2],
        centroids: [[2], [10]],
        nearestCenterIndices: [0, 0, 1, 0, 0, 1],
        squaredDistances: [
          0, 0, 0, 0.04000000000000001, 0.04000000000000001, 0,
        ],
        normalizedSse: 0.08000000000000002,
      },
      {
        seed: 42,
        effectiveSeed: 42,
        centroidIndices: [3, 2],
        centroids: [[0], [10]],
        nearestCenterIndices: [0, 0, 1, 0, 0, 1],
        squaredDistances: [
          0.04000000000000001, 0.04000000000000001, 0, 0, 0, 0,
        ],
        normalizedSse: 0.08000000000000002,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ClusterInitializationSensitivityBenchmarkInput,
  ClusterInitializationSensitivityBenchmarkOutput
>;
export const clusterInitializationSensitivityBenchmarkTool =
  createModelDefinition<
    ClusterInitializationSensitivityBenchmarkInput,
    ClusterInitializationSensitivityBenchmarkOutput
  >({
    id: "random/cluster-initialization-sensitivity-benchmark",
    title: "Random Cluster Initialization Sensitivity Benchmark Generator",
    description:
      "Generate one labeled Gaussian mixture and compare k-means++ starting-center coverage across explicit seeds using uniformly scaled squared distances; report initial centers and nearest-center costs, not iterative fits or an optimality guarantee.",
    inputSchema,
    outputSchema,
    execute: calculateClusterInitializationSensitivityBenchmark,
  });
export const runClusterInitializationSensitivityBenchmark =
  clusterInitializationSensitivityBenchmarkTool.execute;
export default clusterInitializationSensitivityBenchmarkTool;
