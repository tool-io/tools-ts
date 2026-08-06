import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BirchMicrocluster = {
  readonly centroid: readonly number[];
  readonly count: number;
};
type WorkingCluster = { count: number; centroid: number[]; points: number[][] };
const distance = (
  first: readonly number[],
  second: readonly number[],
): number =>
  Math.hypot(...first.map((value, index) => value - (second[index] ?? 0)));
const centroid = (points: readonly (readonly number[])[]): number[] =>
  (points[0] ?? []).map(
    (_, dimension) =>
      points.reduce((sum, point) => sum + (point[dimension] ?? 0), 0) /
      points.length,
  );
const radius = (
  points: readonly (readonly number[])[],
  center: readonly number[],
): number => Math.max(...points.map((point) => distance(point, center)));

export const createBirchMicroclusters = (
  points: readonly (readonly number[])[],
  threshold: number,
): BirchMicrocluster[] => {
  const clusters: WorkingCluster[] = [];
  for (const readonlyPoint of points) {
    const point = [...readonlyPoint];
    const nearest = clusters
      .map((cluster, index) => ({
        distance: distance(point, cluster.centroid),
        index,
      }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (nearest) {
      const candidatePoints = [...clusters[nearest.index]!.points, point];
      const candidateCentroid = centroid(candidatePoints);
      if (radius(candidatePoints, candidateCentroid) <= threshold) {
        clusters[nearest.index] = {
          centroid: candidateCentroid,
          count: candidatePoints.length,
          points: candidatePoints,
        };
        continue;
      }
    }
    clusters.push({ centroid: point, count: 1, points: [point] });
  }
  return clusters.map(({ centroid: center, count }) => ({
    centroid: center.map((value) => Number(value.toPrecision(10))),
    count,
  }));
};

export const birchMicroclustersExample = {
  input: {
    points: [
      [1, 1],
      [1.2, 1.1],
      [8, 8],
      [8.1, 8.2],
    ],
    threshold: 0.5,
  },
  output: {
    clusters: {
      clusterCount: 2,
      values: [
        { centroid: [1.1, 1.05], count: 2 },
        { centroid: [8.05, 8.1], count: 2 },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly points: readonly (readonly number[])[];
    readonly threshold: number;
  },
  {
    readonly clusters: {
      readonly clusterCount: number;
      readonly values: readonly BirchMicrocluster[];
    };
  }
>;

export const birchMicroclustersTool = createSimpleTool({
  id: "clustering/birch-microclusters",
  title: "BIRCH Microclustering Demonstrator",
  description:
    "Build order-dependent BIRCH-style microclusters using a maximum-radius threshold.",
  inputs: [
    { format: "matrix/points", id: "points", kind: "matrix", label: "Points" },
    { id: "threshold", kind: "number", label: "Radius threshold", minimum: 0 },
  ],
  outputs: [
    {
      format: "clustering/microclusters",
      id: "clusters",
      kind: "object",
      label: "Microclusters",
    },
  ],
  calculate: (input) => {
    const values = createBirchMicroclusters(
      input.points as number[][],
      input.threshold as number,
    );
    return { clusters: { clusterCount: values.length, values } };
  },
});
export const runBirchMicroclusters = birchMicroclustersTool.execute;
export default birchMicroclustersTool;
