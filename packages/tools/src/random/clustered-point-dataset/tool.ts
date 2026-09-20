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
import { shuffledSyntheticClusterDataset } from "../cluster-benchmark-construction.js";
import { kMeans } from "../../clustering/iterative-core.js";
import { SimpleToolError } from "../../core/simple.js";

export type ClusteredPointDatasetInput = {
  readonly clusters: readonly {
    readonly center: readonly number[];
    readonly standardDeviation: number;
    readonly pointCount: number;
  }[];
  readonly maximumIterations: number;
  readonly seed?: number;
};
export type ClusteredPointDatasetOutput = {
  readonly points: readonly (readonly number[])[];
  readonly sourceLabels: readonly number[];
  readonly clusteringInputScale: number;
  readonly clustering: {
    readonly centroids: readonly (readonly number[])[];
    readonly labels: readonly number[];
    readonly iterations: number;
    readonly fixedPointVerified: boolean;
  };
  readonly randomness: GeneratorReplay;
};
const vector = {
  type: "array",
  minItems: 1,
  maxItems: 8,
  items: { type: "number" },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          center: vector,
          standardDeviation: { type: "number", minimum: 0 },
          pointCount: { type: "integer", minimum: 1, maximum: 128 },
        },
        required: ["center", "standardDeviation", "pointCount"],
      },
    },
    maximumIterations: { type: "integer", minimum: 1, maximum: 1000 },
    seed: generatorSeedSchema,
  },
  required: ["clusters", "maximumIterations"],
} as const;
const labelsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 128,
  items: { type: "integer", minimum: 0, maximum: 7 },
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: { type: "array", minItems: 1, maxItems: 128, items: vector },
    sourceLabels: labelsSchema,
    clusteringInputScale: { type: "number", exclusiveMinimum: 0 },
    clustering: {
      type: "object",
      additionalProperties: false,
      properties: {
        centroids: { type: "array", minItems: 1, maxItems: 8, items: vector },
        labels: labelsSchema,
        iterations: { type: "integer", minimum: 1, maximum: 1000 },
        fixedPointVerified: { type: "boolean" },
      },
      required: ["centroids", "labels", "iterations", "fixedPointVerified"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "points",
    "sourceLabels",
    "clusteringInputScale",
    "clustering",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is ClusteredPointDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateClusteredPointDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ClusteredPointDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const dimension = input.clusters[0].center.length,
      count = input.clusters.reduce(
        (sum, cluster) => sum + cluster.pointCount,
        0,
      );
    if (input.clusters.some((cluster) => cluster.center.length !== dimension))
      simpleError(
        "clusters",
        "All generating centers must have the same dimension.",
        "inconsistent_cluster_dimensions",
      );
    if (
      count > 128 ||
      count * dimension * input.clusters.length * input.maximumIterations >
        2_000_000
    )
      simpleError(
        "clusters",
        "Use at most 128 points and two million point-coordinate-cluster-iteration units.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      { points, sourceLabels } = shuffledSyntheticClusterDataset(
        input.clusters,
        random,
      );
    const clusteringInputScale = Math.max(...points.flat().map(Math.abs)) || 1,
      normalized = points.map((point) =>
        point.map((value) => value / clusteringInputScale),
      );
    const fit = (): ReturnType<typeof kMeans> => {
      try {
        return kMeans(
          normalized,
          input.clusters.length,
          input.maximumIterations,
        );
      } catch (error) {
        if (error instanceof SimpleToolError)
          return simpleError(
            "clusters",
            "The realized point set could not support the requested k-means model: " +
              error.message,
            "clustering_failed",
          );
        throw error;
      }
    };
    const fitted = fit(),
      sums = Array.from({ length: input.clusters.length }, () =>
        Array<number>(dimension).fill(0),
      ),
      counts = Array<number>(input.clusters.length).fill(0);
    normalized.forEach((point, i) => {
      counts[fitted.labels[i]] += 1;
      point.forEach((value, j) => {
        sums[fitted.labels[i]][j] += value;
      });
    });
    const fixedPointVerified = fitted.centroids.every(
      (center, i) =>
        counts[i] === 0 ||
        center.every((value, j) => value === sums[i][j] / counts[i]),
    );
    const centroids = fitted.centroids.map((row) =>
      row.map((value) => value * clusteringInputScale),
    );
    if (!centroids.flat().every(Number.isFinite))
      simpleError(
        "clusters",
        "Rescaled fitted centroids must remain finite.",
        "numeric_overflow",
      );
    return toolSuccess({
      points,
      sourceLabels,
      clusteringInputScale,
      clustering: {
        centroids,
        labels: fitted.labels,
        iterations: fitted.iterations,
        fixedPointVerified,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const clusteredPointDatasetExample = {
  input: {
    clusters: [
      {
        center: [0, 0],
        standardDeviation: 0.3,
        pointCount: 3,
      },
      {
        center: [8, 8],
        standardDeviation: 0.3,
        pointCount: 3,
      },
    ],
    maximumIterations: 50,
    seed: 42,
  },
  output: {
    points: [
      [7.919444682011827, 7.459461974693873],
      [8.169586058321237, 8.301019804622003],
      [-0.15883013811492458, 0.36857720191893123],
      [7.800200255522881, 7.016276859999375],
      [-0.2868486688152447, -0.08190783146478313],
      [-0.552488155435079, -0.3422646212862072],
    ],
    sourceLabels: [1, 1, 0, 1, 0, 0],
    clusteringInputScale: 8.301019804622003,
    clustering: {
      centroids: [
        [7.963076998618648, 7.592252879771751],
        [-0.33272232078841607, -0.01853175027735304],
      ],
      labels: [0, 0, 1, 0, 1, 1],
      iterations: 1,
      fixedPointVerified: true,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ClusteredPointDatasetInput,
  ClusteredPointDatasetOutput
>;
export const clusteredPointDatasetTool = createModelDefinition<
  ClusteredPointDatasetInput,
  ClusteredPointDatasetOutput
>({
  id: "random/clustered-point-dataset",
  title: "Random Clustered Point Dataset Generator",
  description:
    "Generate bounded-count caller-parameterized Gaussian point groups with retained source labels, shuffle them and delegate scale-normalized deterministic k-means; fitted labels are separate from generating groups and exact fixed-point verification is reported without an optimality claim.",
  inputSchema,
  outputSchema,
  execute: calculateClusteredPointDataset,
});
export const runClusteredPointDataset = clusteredPointDatasetTool.execute;
export default clusteredPointDatasetTool;
