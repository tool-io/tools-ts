import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AffinityCluster = {
  readonly exemplar: number;
  readonly members: readonly number[];
};
export type AffinityPropagationResult = {
  readonly clusters: readonly AffinityCluster[];
  readonly iterations: number;
};
const median = (values: readonly number[]) => {
  const sorted = [...values].sort((a, b) => a - b),
    middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]!
    : (sorted[middle - 1]! + sorted[middle]!) / 2;
};
export const clusterByAffinityPropagation = (
  points: readonly (readonly number[])[],
  preferenceMode: "median" | "minimum",
  damping: number,
  maximumIterations: number,
): AffinityPropagationResult | null => {
  const size = points.length,
    dimensions = points[0]?.length ?? 0;
  if (
    size < 2 ||
    !dimensions ||
    points.some((point) => point.length !== dimensions)
  )
    return null;
  const similarities = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, k) =>
      i === k
        ? 0
        : -points[i]!.reduce(
            (sum, value, d) => sum + (value - points[k]![d]!) ** 2,
            0,
          ),
    ),
  );
  const offDiagonal = similarities.flatMap((row, i) =>
      row.filter((_, k) => i !== k),
    ),
    preference =
      preferenceMode === "minimum"
        ? Math.min(...offDiagonal)
        : median(offDiagonal);
  for (let index = 0; index < size; index += 1)
    similarities[index]![index] = preference;
  let availability = Array.from({ length: size }, () =>
      Array<number>(size).fill(0),
    ),
    responsibility = Array.from({ length: size }, () =>
      Array<number>(size).fill(0),
    );
  for (let iteration = 0; iteration < maximumIterations; iteration += 1) {
    const nextR = responsibility.map((row) => [...row]);
    for (let i = 0; i < size; i += 1)
      for (let k = 0; k < size; k += 1) {
        let competing = -Infinity;
        for (let other = 0; other < size; other += 1)
          if (other !== k)
            competing = Math.max(
              competing,
              availability[i]![other]! + similarities[i]![other]!,
            );
        nextR[i]![k] =
          damping * responsibility[i]![k]! +
          (1 - damping) * (similarities[i]![k]! - competing);
      }
    const nextA = availability.map((row) => [...row]);
    for (let k = 0; k < size; k += 1) {
      const positive = Array.from({ length: size }, (_, i) =>
        i === k ? 0 : Math.max(0, nextR[i]![k]!),
      );
      const total = positive.reduce((sum, value) => sum + value, 0);
      for (let i = 0; i < size; i += 1) {
        const raw =
          i === k ? total : Math.min(0, nextR[k]![k]! + total - positive[i]!);
        nextA[i]![k] = damping * availability[i]![k]! + (1 - damping) * raw;
      }
    }
    responsibility = nextR;
    availability = nextA;
  }
  let exemplars = Array.from({ length: size }, (_, index) => index).filter(
    (index) =>
      availability[index]![index]! + responsibility[index]![index]! > 0,
  );
  if (!exemplars.length)
    exemplars = [
      Array.from({ length: size }, (_, index) => index).sort(
        (a, b) =>
          availability[b]![b]! +
          responsibility[b]![b]! -
          availability[a]![a]! -
          responsibility[a]![a]!,
      )[0]!,
    ];
  const clusters = exemplars.map((exemplar) => ({
    exemplar,
    members: [] as number[],
  }));
  for (let index = 0; index < size; index += 1) {
    const exemplar = exemplars.reduce((best, candidate) => {
      const distanceTo = (target: number) =>
        points[index]!.reduce(
          (sum, value, dimension) =>
            sum + (value - points[target]![dimension]!) ** 2,
          0,
        );
      return distanceTo(candidate) < distanceTo(best) ? candidate : best;
    }, exemplars[0]!);
    clusters
      .find((cluster) => cluster.exemplar === exemplar)!
      .members.push(index);
  }
  return { clusters, iterations: maximumIterations };
};
export const affinityPropagationExample = {
  input: {
    damping: 0.7,
    maximumIterations: 40,
    points: [
      [0, 0],
      [0.1, 0],
      [5, 5],
      [5.1, 5],
    ],
    preference: "median",
  },
  output: {
    result: {
      clusters: [
        { exemplar: 1, members: [0, 1] },
        { exemplar: 2, members: [2, 3] },
      ],
      iterations: 40,
    },
  },
} satisfies ToolExample<
  {
    readonly damping: number;
    readonly maximumIterations: number;
    readonly points: readonly (readonly number[])[];
    readonly preference: "median" | "minimum";
  },
  { readonly result: AffinityPropagationResult }
>;
export const affinityPropagationTool = createSimpleTool({
  id: "clustering/affinity-propagation",
  title: "Affinity Propagation Clustering Tool",
  description:
    "Identify exemplar points through iterative responsibility and availability message passing.",
  inputs: [
    { format: "matrix/points", id: "points", kind: "matrix", label: "Points" },
    {
      enum: ["median", "minimum"],
      id: "preference",
      kind: "string",
      label: "Preference",
    },
    {
      id: "damping",
      kind: "number",
      label: "Damping",
      maximum: 0.99,
      minimum: 0.5,
    },
    {
      id: "maximumIterations",
      kind: "integer",
      label: "Iterations",
      maximum: 1_000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "clustering/affinity-propagation",
      id: "result",
      kind: "object",
      label: "Clusters",
    },
  ],
  calculate: (input) => {
    const result = clusterByAffinityPropagation(
      input.points as number[][],
      input.preference as "median" | "minimum",
      input.damping as number,
      input.maximumIterations as number,
    );
    if (!result)
      return simpleError(
        "points",
        "Enter at least two points with matching dimensions.",
      );
    return { result };
  },
});
export const runAffinityPropagation = affinityPropagationTool.execute;
export default affinityPropagationTool;
