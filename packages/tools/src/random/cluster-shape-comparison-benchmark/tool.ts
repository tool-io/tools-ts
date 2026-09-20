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
import { kMeans, meanShift } from "../../clustering/iterative-core.js";
import { drawStandardNormal } from "../synthetic-normal-construction.js";
import {
  clusterPointsSchema,
  clusterLabelsSchema,
  normalizeClusterPoints,
  checkClusterWork,
} from "../cluster-benchmark-construction.js";
import { SimpleToolError } from "../../core/simple.js";

export type ClusterShapeBase = {
  readonly center: readonly [number, number];
  readonly pointCount: number;
  readonly rotationDegrees: number;
};
export type ClusterShape = ClusterShapeBase &
  (
    | { readonly kind: "compact"; readonly standardDeviation: number }
    | {
        readonly kind: "elongated";
        readonly majorDeviation: number;
        readonly minorDeviation: number;
      }
    | {
        readonly kind: "arc";
        readonly radius: number;
        readonly radialDeviation: number;
        readonly startDegrees: number;
        readonly sweepDegrees: number;
      }
  );
export type ClusterShapeComparisonBenchmarkInput = {
  readonly shapes: readonly ClusterShape[];
  readonly settings: readonly {
    readonly centerCount: number;
    readonly normalizedBandwidth: number;
  }[];
  readonly maximumIterations: number;
  readonly seed?: number;
};
export type ClusterShapeComparisonBenchmarkOutput = {
  readonly points: readonly (readonly number[])[];
  readonly sourceLabels: readonly number[];
  readonly distanceScale: number;
  readonly runs: readonly {
    readonly centerCount: number;
    readonly normalizedBandwidth: number;
    readonly kMeans: {
      readonly centroids: readonly (readonly number[])[];
      readonly labels: readonly number[];
      readonly iterations: number;
    };
    readonly meanShift: {
      readonly modes: readonly (readonly number[])[];
      readonly labels: readonly number[];
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const nonnegative = { type: "number", minimum: 0 } as const,
  positive = { type: "number", exclusiveMinimum: 0 } as const;
const commonShape = {
  center: {
    type: "array",
    minItems: 2,
    maxItems: 2,
    items: { type: "number" },
  },
  pointCount: { type: "integer", minimum: 1, maximum: 128 },
  rotationDegrees: { type: "number" },
} as const;
const commonRequired = [
  "center",
  "pointCount",
  "rotationDegrees",
  "kind",
] as const;
const shapeSchema = {
  type: "object",
  additionalProperties: true,
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        ...commonShape,
        kind: { type: "string", const: "compact" },
        standardDeviation: nonnegative,
      },
      required: [...commonRequired, "standardDeviation"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        ...commonShape,
        kind: { type: "string", const: "elongated" },
        majorDeviation: nonnegative,
        minorDeviation: nonnegative,
      },
      required: [...commonRequired, "majorDeviation", "minorDeviation"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        ...commonShape,
        kind: { type: "string", const: "arc" },
        radius: positive,
        radialDeviation: nonnegative,
        startDegrees: { type: "number" },
        sweepDegrees: { type: "number", exclusiveMinimum: 0, maximum: 360 },
      },
      required: [
        ...commonRequired,
        "radius",
        "radialDeviation",
        "startDegrees",
        "sweepDegrees",
      ],
    },
  ],
} as const;
const settingsProperties = {
  centerCount: { type: "integer", minimum: 1, maximum: 8 },
  normalizedBandwidth: positive,
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shapes: { type: "array", minItems: 1, maxItems: 8, items: shapeSchema },
    settings: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: settingsProperties,
        required: ["centerCount", "normalizedBandwidth"],
      },
    },
    maximumIterations: { type: "integer", minimum: 1, maximum: 1000 },
    seed: generatorSeedSchema,
  },
  required: ["shapes", "settings", "maximumIterations"],
} as const;
const fittedCenters = { ...clusterPointsSchema, maxItems: 128 } as const,
  fittedLabels = {
    type: "array",
    minItems: 1,
    maxItems: 128,
    items: { type: "integer", minimum: 0, maximum: 127 },
  } as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: clusterPointsSchema,
    sourceLabels: clusterLabelsSchema,
    distanceScale: positive,
    runs: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...settingsProperties,
          kMeans: {
            type: "object",
            additionalProperties: false,
            properties: {
              centroids: fittedCenters,
              labels: fittedLabels,
              iterations: { type: "integer", minimum: 1, maximum: 1000 },
            },
            required: ["centroids", "labels", "iterations"],
          },
          meanShift: {
            type: "object",
            additionalProperties: false,
            properties: { modes: fittedCenters, labels: fittedLabels },
            required: ["modes", "labels"],
          },
        },
        required: ["centerCount", "normalizedBandwidth", "kMeans", "meanShift"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["points", "sourceLabels", "distanceScale", "runs", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is ClusterShapeComparisonBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateClusterShapeComparisonBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ClusterShapeComparisonBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const count = input.shapes.reduce(
      (sum, shape) => sum + shape.pointCount,
      0,
    );
    if (count > 128)
      simpleError(
        "shapes",
        "At most 128 total generated points are supported.",
        "resource_limit",
      );
    if (input.settings.some((setting) => setting.centerCount > count))
      simpleError(
        "settings",
        "Center counts cannot exceed the generated point count.",
        "invalid_center_count",
      );
    if (
      input.shapes.some(
        (shape) =>
          shape.kind === "elongated" &&
          shape.majorDeviation < shape.minorDeviation,
      )
    )
      simpleError(
        "shapes",
        "An elongated group's major deviation must be at least its minor deviation.",
        "unordered_axes",
      );
    checkClusterWork(
      input.settings.reduce(
        (sum, setting) =>
          sum +
          2 * count * (count + setting.centerCount) * input.maximumIterations,
        0,
      ),
      "settings",
    );
    const random = createGeneratorRandom(input.seed, context),
      rows = input.shapes.flatMap((shape, label) => {
        const angle = ((shape.rotationDegrees % 360) * Math.PI) / 180,
          cosine = Math.cos(angle),
          sine = Math.sin(angle);
        return Array.from({ length: shape.pointCount }, () => {
          let x: number, y: number;
          if (shape.kind === "arc") {
            const position =
                (((shape.startDegrees % 360) +
                  random.unit() * shape.sweepDegrees) *
                  Math.PI) /
                180,
              radius =
                shape.radius +
                shape.radialDeviation * drawStandardNormal(random);
            x = radius * Math.cos(position);
            y = radius * Math.sin(position);
          } else {
            const first = drawStandardNormal(random),
              second = drawStandardNormal(random);
            x =
              first *
              (shape.kind === "compact"
                ? shape.standardDeviation
                : shape.majorDeviation);
            y =
              second *
              (shape.kind === "compact"
                ? shape.standardDeviation
                : shape.minorDeviation);
          }
          const point = [
            shape.center[0] + x * cosine - y * sine,
            shape.center[1] + x * sine + y * cosine,
          ];
          if (!point.every(Number.isFinite))
            simpleError(
              "shapes",
              "Generated coordinates exceed the finite numeric domain.",
              "numeric_overflow",
            );
          return {
            point: point.map((value) => (value === 0 ? 0 : value)),
            label,
          };
        });
      });
    const shuffled = random.shuffle(rows),
      points = shuffled.map((row) => row.point),
      sourceLabels = shuffled.map((row) => row.label),
      { distanceScale, normalized } = normalizeClusterPoints(points);
    const runs = input.settings.map(({ centerCount, normalizedBandwidth }) => {
      try {
        return {
          centerCount,
          normalizedBandwidth,
          kMeans: kMeans(normalized, centerCount, input.maximumIterations),
          meanShift: meanShift(
            normalized,
            normalizedBandwidth,
            input.maximumIterations,
          ),
        };
      } catch (error) {
        if (error instanceof SimpleToolError)
          return simpleError(
            "shapes",
            "The realized shapes could not support the selected clustering model: " +
              error.message,
            "clustering_failed",
          );
        throw error;
      }
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
export const clusterShapeComparisonBenchmarkExample = {
  input: {
    shapes: [
      {
        kind: "elongated",
        center: [4, 0],
        pointCount: 2,
        rotationDegrees: 0,
        majorDeviation: 1,
        minorDeviation: 0.2,
      },
      {
        kind: "arc",
        center: [-4, 0],
        pointCount: 2,
        rotationDegrees: 0,
        radius: 2,
        radialDeviation: 0,
        startDegrees: 0,
        sweepDegrees: 90,
      },
    ],
    settings: [
      {
        centerCount: 1,
        normalizedBandwidth: 3,
      },
    ],
    maximumIterations: 1,
    seed: 42,
  },
  output: {
    points: [
      [-3.631592769364688, 1.9657762111734947],
      [-3.580514346968061, 1.9555131773783494],
      [2.1583728152164032, -0.22817641419080484],
      [3.043837770615851, -0.05460522097652209],
    ],
    sourceLabels: [1, 1, 0, 0],
    distanceScale: 3.631592769364688,
    runs: [
      {
        centerCount: 1,
        normalizedBandwidth: 3,
        kMeans: {
          centroids: [[-0.13836191570373313, 0.2504760296968153]],
          labels: [0, 0, 0, 0],
          iterations: 1,
        },
        meanShift: {
          modes: [[-0.13836191570373313, 0.2504760296968153]],
          labels: [0, 0, 0, 0],
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ClusterShapeComparisonBenchmarkInput,
  ClusterShapeComparisonBenchmarkOutput
>;
export const clusterShapeComparisonBenchmarkTool = createModelDefinition<
  ClusterShapeComparisonBenchmarkInput,
  ClusterShapeComparisonBenchmarkOutput
>({
  id: "random/cluster-shape-comparison-benchmark",
  title: "Random Cluster Shape Comparison Benchmark Generator",
  description:
    "Generate caller-parameterized compact, elongated Gaussian and radially perturbed arc groups, then compare deterministic k-means and flat-kernel mean shift on the same uniformly normalized points; retain source labels separately from fitted labels, finite-budget failures and model parameters without claiming universal clustering quality.",
  inputSchema,
  outputSchema,
  execute: calculateClusterShapeComparisonBenchmark,
});
export const runClusterShapeComparisonBenchmark =
  clusterShapeComparisonBenchmarkTool.execute;
export default clusterShapeComparisonBenchmarkTool;
