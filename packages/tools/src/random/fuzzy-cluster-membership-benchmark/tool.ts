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
  fuzzyCMeans,
  possibilisticCMeans,
} from "../../clustering/iterative-core.js";
import {
  clusterGroupsSchema,
  clusterPointsSchema,
  clusterLabelsSchema,
  clusterVectorSchema,
  validateSyntheticClusterGroups,
  shuffledSyntheticClusterDataset,
  normalizeClusterPoints,
  checkClusterWork,
  type SyntheticClusterGroup,
} from "../cluster-benchmark-construction.js";

export type FuzzyBenchmarkSettings = {
  readonly fuzzifier: number;
  readonly typicalityScale: number;
};
export type FuzzyClusterMembershipBenchmarkInput = {
  readonly clusters: readonly SyntheticClusterGroup[];
  readonly centerCount: number;
  readonly settings: readonly FuzzyBenchmarkSettings[];
  readonly maximumIterations: number;
  readonly seed?: number;
};
export type FuzzyClusterMembershipBenchmarkOutput = {
  readonly points: readonly (readonly number[])[];
  readonly sourceLabels: readonly number[];
  readonly distanceScale: number;
  readonly runs: readonly {
    readonly fuzzifier: number;
    readonly typicalityScale: number;
    readonly fuzzy: {
      readonly centroids: readonly (readonly number[])[];
      readonly memberships: readonly (readonly number[])[];
      readonly iterations: number;
    };
    readonly possibilistic: {
      readonly centroids: readonly (readonly number[])[];
      readonly typicalities: readonly (readonly number[])[];
      readonly iterations: number;
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const settingsProperties = {
  fuzzifier: { type: "number", exclusiveMinimum: 1 },
  typicalityScale: { type: "number", exclusiveMinimum: 0 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: clusterGroupsSchema,
    centerCount: { type: "integer", minimum: 1, maximum: 8 },
    settings: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: settingsProperties,
        required: ["fuzzifier", "typicalityScale"],
      },
    },
    maximumIterations: { type: "integer", minimum: 1, maximum: 1000 },
    seed: generatorSeedSchema,
  },
  required: ["clusters", "centerCount", "settings", "maximumIterations"],
} as const;
const centroidsSchema = {
    type: "array",
    minItems: 1,
    maxItems: 8,
    items: clusterVectorSchema,
  } as const,
  weightsSchema = {
    type: "array",
    minItems: 1,
    maxItems: 128,
    items: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: { type: "number", minimum: 0, maximum: 1 },
    },
  } as const,
  iterationsSchema = { type: "integer", minimum: 1, maximum: 1000 } as const;
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
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...settingsProperties,
          fuzzy: {
            type: "object",
            additionalProperties: false,
            properties: {
              centroids: centroidsSchema,
              memberships: weightsSchema,
              iterations: iterationsSchema,
            },
            required: ["centroids", "memberships", "iterations"],
          },
          possibilistic: {
            type: "object",
            additionalProperties: false,
            properties: {
              centroids: centroidsSchema,
              typicalities: weightsSchema,
              iterations: iterationsSchema,
            },
            required: ["centroids", "typicalities", "iterations"],
          },
        },
        required: ["fuzzifier", "typicalityScale", "fuzzy", "possibilistic"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["points", "sourceLabels", "distanceScale", "runs", "randomness"],
} as const;
const finiteFuzzyMatrix = (
  matrix: readonly (readonly number[])[],
  weights: boolean,
): void => {
  if (
    matrix.some((row) =>
      row.some(
        (value) =>
          !Number.isFinite(value) || (weights && (value < 0 || value > 1)),
      ),
    )
  )
    simpleError(
      "settings",
      "The selected parameters produced unrepresentable model weights or centroids.",
      "numerical_failure",
    );
};
const isInput = (
  input: unknown,
): input is FuzzyClusterMembershipBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateFuzzyClusterMembershipBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FuzzyClusterMembershipBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const dimension = validateSyntheticClusterGroups(input.clusters),
      count = input.clusters.reduce((sum, group) => sum + group.pointCount, 0);
    if (input.centerCount > count)
      simpleError(
        "centerCount",
        "There must be at least one generated point per requested center.",
        "invalid_center_count",
      );
    checkClusterWork(
      2 *
        count *
        dimension *
        input.centerCount *
        input.centerCount *
        input.settings.length *
        input.maximumIterations,
    );
    const random = createGeneratorRandom(input.seed, context),
      { points, sourceLabels } = shuffledSyntheticClusterDataset(
        input.clusters,
        random,
      ),
      { distanceScale, normalized } = normalizeClusterPoints(points);
    const runs = input.settings.map(({ fuzzifier, typicalityScale }) => {
      const fuzzy = fuzzyCMeans(
          normalized,
          input.centerCount,
          fuzzifier,
          input.maximumIterations,
        ),
        possibilistic = possibilisticCMeans(
          normalized,
          input.centerCount,
          fuzzifier,
          typicalityScale,
          input.maximumIterations,
        );
      finiteFuzzyMatrix(fuzzy.centroids, false);
      finiteFuzzyMatrix(fuzzy.memberships, true);
      finiteFuzzyMatrix(possibilistic.centroids, false);
      finiteFuzzyMatrix(possibilistic.typicalities, true);
      return { fuzzifier, typicalityScale, fuzzy, possibilistic };
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
export const fuzzyClusterMembershipBenchmarkExample = {
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
    settings: [
      {
        fuzzifier: 2,
        typicalityScale: 1,
      },
    ],
    maximumIterations: 1,
    seed: 42,
  },
  output: {
    points: [[2], [2], [10], [0], [0], [10]],
    sourceLabels: [1, 1, 2, 0, 0, 2],
    distanceScale: 10,
    runs: [
      {
        fuzzifier: 2,
        typicalityScale: 1,
        fuzzy: {
          centroids: [[0.10392006149116066], [0.9985228951255538]],
          memberships: [
            [1, 0],
            [1, 0],
            [0, 1],
            [0.9615384615384615, 0.038461538461538464],
            [0.9615384615384615, 0.038461538461538464],
            [0, 1],
          ],
          iterations: 1,
        },
        possibilistic: {
          centroids: [[0.24900399734659887], [0.6624484181568089]],
          typicalities: [
            [1, 0.6097560975609756],
            [1, 0.6097560975609756],
            [0.6097560975609756, 1],
            [0.9615384615384615, 0.5],
            [0.9615384615384615, 0.5],
            [0.6097560975609756, 1],
          ],
          iterations: 1,
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FuzzyClusterMembershipBenchmarkInput,
  FuzzyClusterMembershipBenchmarkOutput
>;
export const fuzzyClusterMembershipBenchmarkTool = createModelDefinition<
  FuzzyClusterMembershipBenchmarkInput,
  FuzzyClusterMembershipBenchmarkOutput
>({
  id: "random/fuzzy-cluster-membership-benchmark",
  title: "Random Fuzzy Cluster Membership Benchmark Generator",
  description:
    "Generate one labeled Gaussian mixture and compare existing fuzzy memberships with possibilistic typicalities under supplied parameters in uniformly normalized coordinates; retain the cores' last-update weights and centroids without treating typicalities as probabilities or claiming convergence from an iteration count.",
  inputSchema,
  outputSchema,
  execute: calculateFuzzyClusterMembershipBenchmark,
});
export const runFuzzyClusterMembershipBenchmark =
  fuzzyClusterMembershipBenchmarkTool.execute;
export default fuzzyClusterMembershipBenchmarkTool;
