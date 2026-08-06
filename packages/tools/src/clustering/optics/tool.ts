import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OpticsPoint = {
  readonly coreDistance: number | null;
  readonly index: number;
  readonly point: readonly number[];
  readonly reachabilityDistance: number | null;
};
const distance = (
  first: readonly number[],
  second: readonly number[],
): number =>
  Math.hypot(...first.map((value, index) => value - (second[index] ?? 0)));
export const runOptics = (
  points: readonly (readonly number[])[],
  epsilon: number,
  minimumPoints: number,
): OpticsPoint[] | null => {
  if (
    points.length < minimumPoints ||
    points.length > 5_000 ||
    points.length * (points[0]?.length ?? 0) > 1_000_000
  )
    return null;
  const processed = new Set<number>();
  const reachability = Array<number>(points.length).fill(Infinity);
  const ordering: OpticsPoint[] = [];
  const neighbors = (index: number) =>
    points
      .map((point, other) => ({
        distance: distance(points[index] ?? [], point),
        index: other,
      }))
      .filter((candidate) => candidate.distance <= epsilon)
      .sort((a, b) => a.distance - b.distance || a.index - b.index);
  const coreDistance = (nearby: readonly { readonly distance: number }[]) =>
    nearby.length >= minimumPoints
      ? (nearby[minimumPoints - 1]?.distance ?? Infinity)
      : Infinity;
  const expand = (start: number) => {
    const seeds = [start];
    while (seeds.length) {
      seeds.sort(
        (a, b) =>
          (reachability[a] ?? Infinity) - (reachability[b] ?? Infinity) ||
          a - b,
      );
      const current = seeds.shift()!;
      if (processed.has(current)) continue;
      processed.add(current);
      const nearby = neighbors(current);
      const core = coreDistance(nearby);
      ordering.push({
        coreDistance: Number.isFinite(core)
          ? Number(core.toPrecision(10))
          : null,
        index: current,
        point: points[current] ?? [],
        reachabilityDistance: Number.isFinite(reachability[current])
          ? Number((reachability[current] ?? 0).toPrecision(10))
          : null,
      });
      if (!Number.isFinite(core)) continue;
      for (const candidate of nearby)
        if (!processed.has(candidate.index)) {
          const updated = Math.max(core, candidate.distance);
          if (updated < (reachability[candidate.index] ?? Infinity)) {
            reachability[candidate.index] = updated;
            if (!seeds.includes(candidate.index)) seeds.push(candidate.index);
          }
        }
    }
  };
  for (let index = 0; index < points.length; index += 1)
    if (!processed.has(index)) expand(index);
  return ordering;
};

export const opticsExample = {
  input: {
    epsilon: 0.5,
    minimumPoints: 3,
    points: [
      [0, 0],
      [0.1, 0],
      [0, 0.1],
      [5, 5],
      [5.1, 5],
      [5, 5.1],
    ],
  },
  output: {
    ordering: {
      values: [
        {
          coreDistance: 0.1,
          index: 0,
          point: [0, 0],
          reachabilityDistance: null,
        },
        {
          coreDistance: 0.1414213562,
          index: 1,
          point: [0.1, 0],
          reachabilityDistance: 0.1,
        },
        {
          coreDistance: 0.1414213562,
          index: 2,
          point: [0, 0.1],
          reachabilityDistance: 0.1,
        },
        {
          coreDistance: 0.1,
          index: 3,
          point: [5, 5],
          reachabilityDistance: null,
        },
        {
          coreDistance: 0.1414213562,
          index: 4,
          point: [5.1, 5],
          reachabilityDistance: 0.1,
        },
        {
          coreDistance: 0.1414213562,
          index: 5,
          point: [5, 5.1],
          reachabilityDistance: 0.1,
        },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly epsilon: number;
    readonly minimumPoints: number;
    readonly points: readonly (readonly number[])[];
  },
  { readonly ordering: { readonly values: readonly OpticsPoint[] } }
>;

export const opticsTool = createSimpleTool({
  id: "clustering/optics",
  title: "OPTICS Clustering Tool",
  description:
    "Order multidimensional points by density reachability with the OPTICS clustering algorithm.",
  inputs: [
    { format: "matrix/points", id: "points", kind: "matrix", label: "Points" },
    {
      id: "epsilon",
      kind: "number",
      label: "Maximum radius",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "minimumPoints",
      kind: "integer",
      label: "Minimum points",
      minimum: 2,
    },
  ],
  outputs: [
    {
      format: "clustering/optics-ordering",
      id: "ordering",
      kind: "object",
      label: "OPTICS ordering",
    },
  ],
  calculate: (input) => {
    const ordering = runOptics(
      input.points as number[][],
      input.epsilon as number,
      input.minimumPoints as number,
    );
    if (!ordering)
      return simpleError(
        "points",
        "Enter enough points for the selected neighborhood size.",
      );
    return { ordering: { values: ordering } };
  },
});
export const runOpticsTool = opticsTool.execute;
export default opticsTool;
