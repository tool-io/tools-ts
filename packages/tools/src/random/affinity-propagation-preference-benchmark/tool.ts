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
  clusterByAffinityPropagation,
  type AffinityPropagationResult,
} from "../../clustering/affinity-propagation/tool.js";
import {
  clusterGroupsSchema,
  clusterPointsSchema,
  clusterLabelsSchema,
  validateSyntheticClusterGroups,
  shuffledSyntheticClusterDataset,
  normalizeClusterPoints,
  checkClusterWork,
  type SyntheticClusterGroup,
} from "../cluster-benchmark-construction.js";

export type AffinityBenchmarkSetting = {
  readonly preference: "median" | "minimum";
  readonly damping: number;
};
export type AffinityPropagationPreferenceBenchmarkInput = {
  readonly clusters: readonly SyntheticClusterGroup[];
  readonly settings: readonly AffinityBenchmarkSetting[];
  readonly maximumIterations: number;
  readonly seed?: number;
};
export type AffinityPropagationPreferenceBenchmarkOutput = {
  readonly points: readonly (readonly number[])[];
  readonly sourceLabels: readonly number[];
  readonly distanceScale: number;
  readonly runs: readonly {
    readonly preference: "median" | "minimum";
    readonly damping: number;
    readonly result: AffinityPropagationResult;
    readonly labels: readonly number[];
    readonly convergenceAssessed: false;
  }[];
  readonly randomness: GeneratorReplay;
};
const settingsProperties = {
  preference: { type: "string", enum: ["median", "minimum"] },
  damping: { type: "number", minimum: 0.5, maximum: 0.99 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: clusterGroupsSchema,
    settings: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: settingsProperties,
        required: ["preference", "damping"],
      },
    },
    maximumIterations: { type: "integer", minimum: 1, maximum: 1000 },
    seed: generatorSeedSchema,
  },
  required: ["clusters", "settings", "maximumIterations"],
} as const;
const pointIndices = {
  type: "array",
  maxItems: 128,
  items: { type: "integer", minimum: 0, maximum: 127 },
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
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...settingsProperties,
          result: {
            type: "object",
            additionalProperties: false,
            properties: {
              clusters: {
                type: "array",
                minItems: 1,
                maxItems: 128,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    exemplar: { type: "integer", minimum: 0, maximum: 127 },
                    members: pointIndices,
                  },
                  required: ["exemplar", "members"],
                },
              },
              iterations: { type: "integer", minimum: 1, maximum: 1000 },
            },
            required: ["clusters", "iterations"],
          },
          labels: { ...pointIndices, minItems: 2 },
          convergenceAssessed: { type: "boolean", const: false },
        },
        required: [
          "preference",
          "damping",
          "result",
          "labels",
          "convergenceAssessed",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["points", "sourceLabels", "distanceScale", "runs", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is AffinityPropagationPreferenceBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateAffinityPropagationPreferenceBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<AffinityPropagationPreferenceBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    validateSyntheticClusterGroups(input.clusters);
    const count = input.clusters.reduce(
      (sum, group) => sum + group.pointCount,
      0,
    );
    if (count < 2)
      simpleError(
        "clusters",
        "Affinity propagation needs at least two generated points.",
        "insufficient_points",
      );
    checkClusterWork(
      count * count * count * input.settings.length * input.maximumIterations,
    );
    const random = createGeneratorRandom(input.seed, context),
      { points, sourceLabels } = shuffledSyntheticClusterDataset(
        input.clusters,
        random,
      ),
      { distanceScale, normalized } = normalizeClusterPoints(points);
    const runs = input.settings.map(({ preference, damping }) => {
      const result = clusterByAffinityPropagation(
        normalized,
        preference,
        damping,
        input.maximumIterations,
      );
      if (!result)
        throw new Error(
          "A bounded normalized affinity experiment was rejected.",
        );
      const labels = Array<number>(count).fill(-1);
      result.clusters.forEach((cluster, label) =>
        cluster.members.forEach((index) => {
          labels[index] = label;
        }),
      );
      if (labels.some((label) => label < 0))
        throw new Error("Affinity propagation omitted a generated point.");
      return {
        preference,
        damping,
        result,
        labels,
        convergenceAssessed: false as const,
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
export const affinityPropagationPreferenceBenchmarkExample = {
  input: {
    clusters: [
      {
        center: [0],
        standardDeviation: 0,
        pointCount: 1,
      },
      {
        center: [2],
        standardDeviation: 0,
        pointCount: 1,
      },
      {
        center: [10],
        standardDeviation: 0,
        pointCount: 1,
      },
    ],
    settings: [
      {
        preference: "median",
        damping: 0.5,
      },
      {
        preference: "minimum",
        damping: 0.5,
      },
    ],
    maximumIterations: 1,
    seed: 42,
  },
  output: {
    points: [[10], [2], [0]],
    sourceLabels: [2, 1, 0],
    distanceScale: 10,
    runs: [
      {
        preference: "median",
        damping: 0.5,
        result: {
          clusters: [
            {
              exemplar: 0,
              members: [0, 1, 2],
            },
          ],
          iterations: 1,
        },
        labels: [0, 0, 0],
        convergenceAssessed: false,
      },
      {
        preference: "minimum",
        damping: 0.5,
        result: {
          clusters: [
            {
              exemplar: 1,
              members: [0, 1, 2],
            },
          ],
          iterations: 1,
        },
        labels: [0, 0, 0],
        convergenceAssessed: false,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  AffinityPropagationPreferenceBenchmarkInput,
  AffinityPropagationPreferenceBenchmarkOutput
>;
export const affinityPropagationPreferenceBenchmarkTool = createModelDefinition<
  AffinityPropagationPreferenceBenchmarkInput,
  AffinityPropagationPreferenceBenchmarkOutput
>({
  id: "random/affinity-propagation-preference-benchmark",
  title: "Random Affinity Propagation Preference Benchmark Generator",
  description:
    "Generate one labeled Gaussian mixture and compare the existing affinity-propagation demonstrator's minimum/median preferences and damping settings on uniformly normalized coordinates; return exemplars, memberships and actual iteration budgets while explicitly reporting that the core does not assess convergence.",
  inputSchema,
  outputSchema,
  execute: calculateAffinityPropagationPreferenceBenchmark,
});
export const runAffinityPropagationPreferenceBenchmark =
  affinityPropagationPreferenceBenchmarkTool.execute;
export default affinityPropagationPreferenceBenchmarkTool;
