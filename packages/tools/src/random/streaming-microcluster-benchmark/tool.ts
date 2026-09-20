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
import {
  createBirchMicroclusters,
  type BirchMicrocluster,
} from "../../clustering/birch-microclusters/tool.js";
import {
  clusterGroupsSchema,
  clusterPointsSchema,
  clusterLabelsSchema,
  clusterVectorSchema,
  validateSyntheticClusterGroups,
  sampleSyntheticClusterRows,
  normalizeClusterPoints,
  checkClusterWork,
  type SyntheticClusterGroup,
} from "../cluster-benchmark-construction.js";

export type StreamingMicroclusterBenchmarkInput = {
  readonly clusters: readonly SyntheticClusterGroup[];
  readonly batchSizes: readonly number[];
  readonly shuffle: boolean;
  readonly normalizedRadiusThreshold: number;
  readonly seed?: number;
};
export type StreamingMicroclusterBenchmarkOutput = {
  readonly points: readonly (readonly number[])[];
  readonly sourceLabels: readonly number[];
  readonly distanceScale: number;
  readonly snapshots: readonly {
    readonly throughIndex: number;
    readonly pointCount: number;
    readonly clusters: readonly BirchMicrocluster[];
    readonly clusterCount: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: clusterGroupsSchema,
    batchSizes: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "integer", minimum: 1, maximum: 128 },
    },
    shuffle: { type: "boolean" },
    normalizedRadiusThreshold: { type: "number", minimum: 0 },
    seed: generatorSeedSchema,
  },
  required: ["clusters", "batchSizes", "shuffle", "normalizedRadiusThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: clusterPointsSchema,
    sourceLabels: clusterLabelsSchema,
    distanceScale: { type: "number", exclusiveMinimum: 0 },
    snapshots: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          throughIndex: { type: "integer", minimum: 1, maximum: 128 },
          pointCount: { type: "integer", minimum: 1, maximum: 128 },
          clusters: {
            type: "array",
            minItems: 1,
            maxItems: 128,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                centroid: clusterVectorSchema,
                count: { type: "integer", minimum: 1, maximum: 128 },
              },
              required: ["centroid", "count"],
            },
          },
          clusterCount: { type: "integer", minimum: 1, maximum: 128 },
        },
        required: ["throughIndex", "pointCount", "clusters", "clusterCount"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "points",
    "sourceLabels",
    "distanceScale",
    "snapshots",
    "randomness",
  ],
} as const;

const isInput = (
  input: unknown,
): input is StreamingMicroclusterBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateStreamingMicroclusterBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StreamingMicroclusterBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const dimension = validateSyntheticClusterGroups(input.clusters),
      count = input.clusters.reduce((sum, group) => sum + group.pointCount, 0);
    if (input.batchSizes.reduce((sum, size) => sum + size, 0) !== count)
      simpleError(
        "batchSizes",
        "Positive batch sizes must exactly partition the generated point sequence.",
        "unaligned_batches",
      );
    let prefix = 0,
      work = 0;
    for (const size of input.batchSizes) {
      prefix += size;
      work += prefix * prefix * prefix * dimension;
    }
    checkClusterWork(work, "batchSizes");
    const random = createGeneratorRandom(input.seed, context),
      generated = sampleSyntheticClusterRows(input.clusters, random),
      rows = input.shuffle ? random.shuffle(generated) : generated,
      points = rows.map((row) => [...row.point]),
      sourceLabels = rows.map((row) => row.label),
      { distanceScale, normalized } = normalizeClusterPoints(points);
    let throughIndex = 0;
    const snapshots = input.batchSizes.map((size) => {
      throughIndex += size;
      const clusters = createBirchMicroclusters(
        normalized.slice(0, throughIndex),
        input.normalizedRadiusThreshold,
      );
      return {
        throughIndex,
        pointCount: throughIndex,
        clusters,
        clusterCount: clusters.length,
      };
    });
    return toolSuccess({
      points,
      sourceLabels,
      distanceScale,
      snapshots,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const streamingMicroclusterBenchmarkExample = {
  input: {
    clusters: [
      {
        center: [0],
        standardDeviation: 0,
        pointCount: 2,
      },
      {
        center: [10],
        standardDeviation: 0,
        pointCount: 2,
      },
    ],
    batchSizes: [2, 2],
    shuffle: true,
    normalizedRadiusThreshold: 0,
    seed: 42,
  },
  output: {
    points: [[10], [0], [0], [10]],
    sourceLabels: [1, 0, 0, 1],
    distanceScale: 10,
    snapshots: [
      {
        throughIndex: 2,
        pointCount: 2,
        clusters: [
          {
            centroid: [1],
            count: 1,
          },
          {
            centroid: [0],
            count: 1,
          },
        ],
        clusterCount: 2,
      },
      {
        throughIndex: 4,
        pointCount: 4,
        clusters: [
          {
            centroid: [1],
            count: 2,
          },
          {
            centroid: [0],
            count: 2,
          },
        ],
        clusterCount: 2,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  StreamingMicroclusterBenchmarkInput,
  StreamingMicroclusterBenchmarkOutput
>;
export const streamingMicroclusterBenchmarkTool = createModelDefinition<
  StreamingMicroclusterBenchmarkInput,
  StreamingMicroclusterBenchmarkOutput
>({
  id: "random/streaming-microcluster-benchmark",
  title: "Random Streaming Microcluster Benchmark Generator",
  description:
    "Generate one labeled Gaussian point sequence and recompute the existing order-dependent maximum-radius BIRCH-style microclusters at supplied batch-prefix boundaries; thresholds and reported centroids use one explicit uniform coordinate scale, preserve inherited ten-significant-digit centroids, and do not imply an incremental-state API or full BIRCH tree.",
  inputSchema,
  outputSchema,
  execute: calculateStreamingMicroclusterBenchmark,
});
export const runStreamingMicroclusterBenchmark =
  streamingMicroclusterBenchmarkTool.execute;
export default streamingMicroclusterBenchmarkTool;
