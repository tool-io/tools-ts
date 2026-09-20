import { simpleError } from "../core/simple.js";
import { runSubtract } from "../vector/subtract/tool.js";
import { runDotProduct } from "../vector/dot-product/tool.js";
import { drawSyntheticNormal } from "./synthetic-normal-construction.js";
import type { GeneratorRandom } from "./generator-random.js";

export type SyntheticClusterGroup = {
  readonly center: readonly number[];
  readonly standardDeviation: number;
  readonly pointCount: number;
};
export type SyntheticClusterRow = {
  readonly point: readonly number[];
  readonly label: number;
};
export const clusterVectorSchema = {
  type: "array",
  minItems: 1,
  maxItems: 8,
  items: { type: "number" },
} as const;
export const clusterPointsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 128,
  items: clusterVectorSchema,
} as const;
export const clusterGroupsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 8,
  items: {
    type: "object",
    additionalProperties: false,
    properties: {
      center: clusterVectorSchema,
      standardDeviation: { type: "number", minimum: 0 },
      pointCount: { type: "integer", minimum: 1, maximum: 128 },
    },
    required: ["center", "standardDeviation", "pointCount"],
  },
} as const;
export const clusterLabelsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 128,
  items: { type: "integer", minimum: -1, maximum: 7 },
} as const;

export const validateSyntheticClusterGroups = (
  groups: readonly SyntheticClusterGroup[],
  extraCount = 0,
): number => {
  const dimensions = groups[0]?.center.length ?? 0;
  if (
    !groups.length ||
    groups.length > 8 ||
    dimensions < 1 ||
    dimensions > 8 ||
    groups.some(
      (group) =>
        group.center.length !== dimensions ||
        !group.center.every(Number.isFinite) ||
        !Number.isFinite(group.standardDeviation) ||
        group.standardDeviation < 0 ||
        !Number.isSafeInteger(group.pointCount) ||
        group.pointCount < 1,
    )
  )
    simpleError(
      "clusters",
      "Use aligned finite centers, nonnegative deviations and positive whole-number group sizes.",
      "invalid_cluster_groups",
    );
  const count = groups.reduce((sum, group) => sum + group.pointCount, 0);
  if (
    !Number.isSafeInteger(extraCount) ||
    extraCount < 0 ||
    count + extraCount > 128
  )
    simpleError(
      "clusters",
      "At most 128 generated points including injected noise are supported.",
      "resource_limit",
    );
  return dimensions;
};
/** Retain generating labels. Even a zero deviation consumes the normal draw. */
export const sampleSyntheticClusterRows = (
  groups: readonly SyntheticClusterGroup[],
  random: GeneratorRandom,
): SyntheticClusterRow[] => {
  validateSyntheticClusterGroups(groups);
  return groups.flatMap((group, label) =>
    Array.from({ length: group.pointCount }, () => ({
      point: group.center.map((mean) =>
        drawSyntheticNormal(mean, group.standardDeviation, random, "clusters"),
      ),
      label,
    })),
  );
};
export const shuffledSyntheticClusterDataset = (
  groups: readonly SyntheticClusterGroup[],
  random: GeneratorRandom,
): { points: number[][]; sourceLabels: number[] } => {
  const rows = random.shuffle(sampleSyntheticClusterRows(groups, random));
  return {
    points: rows.map((row) => [...row.point]),
    sourceLabels: rows.map((row) => row.label),
  };
};
/** Uniform coordinate scale, not independent axis standardization. */
export const normalizeClusterPoints = (
  points: readonly (readonly number[])[],
): { distanceScale: number; normalized: number[][] } => {
  const distanceScale = Math.max(...points.flat().map(Math.abs)) || 1;
  return {
    distanceScale,
    normalized: points.map((point) =>
      point.map((value) => value / distanceScale),
    ),
  };
};
/** For normalized finite points: reuse vector cores without squared overflow. */
export const normalizedClusterSquaredDistance = (
  first: readonly number[],
  second: readonly number[],
): number => {
  const subtracted = runSubtract({ first, second });
  if (!subtracted.ok)
    throw new Error("Aligned normalized vectors failed subtraction.");
  const squared = runDotProduct({
    first: subtracted.output.vector,
    second: subtracted.output.vector,
  });
  if (!squared.ok || !Number.isFinite(squared.output.dotProduct))
    throw new Error(
      "Bounded normalized differences failed their squared norm.",
    );
  return squared.output.dotProduct;
};
export const checkClusterWork = (work: number, field = "clusters"): void => {
  if (!Number.isFinite(work) || work > 2_000_000)
    simpleError(
      field,
      "The requested experiment exceeds two million modeled work units.",
      "resource_limit",
    );
};
