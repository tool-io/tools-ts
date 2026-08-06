import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type AntColonyResult = {
  readonly distance: number;
  readonly tour: readonly number[];
};
const tourLength = (
  tour: readonly number[],
  distances: readonly (readonly number[])[],
) =>
  tour.reduce(
    (sum, city, index) =>
      sum + distances[city]![tour[(index + 1) % tour.length]!]!,
    0,
  );
export const solveTspWithAntColony = (
  distances: readonly (readonly number[])[],
  antCount: number,
  iterations: number,
  evaporation: number,
  seed: string,
): AntColonyResult | null => {
  const size = distances.length;
  if (
    size < 2 ||
    !seed.trim() ||
    distances.some(
      (row) =>
        row.length !== size ||
        row.some((value) => !Number.isFinite(value) || value < 0),
    ) ||
    size * antCount * iterations > 20_000_000
  )
    return null;
  const random = createSeededRandom(seed),
    pheromone = Array.from({ length: size }, () => Array<number>(size).fill(1));
  let best: AntColonyResult | null = null;
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const tours: AntColonyResult[] = [];
    for (let ant = 0; ant < antCount; ant += 1) {
      const tour = [ant % size],
        unvisited = new Set(
          Array.from({ length: size }, (_, index) => index).filter(
            (city) => city !== tour[0],
          ),
        );
      while (unvisited.size) {
        const current = tour[tour.length - 1]!,
          candidates = [...unvisited];
        const weights = candidates.map(
          (city) =>
            pheromone[current]![city]! /
            Math.max(distances[current]![city]!, Number.EPSILON),
        );
        let threshold =
            random() * weights.reduce((sum, value) => sum + value, 0),
          selected = candidates[candidates.length - 1]!;
        for (let index = 0; index < candidates.length; index += 1)
          if ((threshold -= weights[index]!) <= 0) {
            selected = candidates[index]!;
            break;
          }
        tour.push(selected);
        unvisited.delete(selected);
      }
      const result = { distance: tourLength(tour, distances), tour };
      tours.push(result);
      if (!best || result.distance < best.distance) best = result;
    }
    for (const row of pheromone)
      for (let index = 0; index < row.length; index += 1)
        row[index] = Math.max(Number.EPSILON, row[index]! * (1 - evaporation));
    for (const result of tours)
      for (let index = 0; index < size; index += 1) {
        const from = result.tour[index]!,
          to = result.tour[(index + 1) % size]!;
        pheromone[from]![to]! += 1 / Math.max(result.distance, Number.EPSILON);
        pheromone[to]![from] = pheromone[from]![to]!;
      }
  }
  return (
    best && { distance: Number(best.distance.toPrecision(12)), tour: best.tour }
  );
};
export const antColonyTspExample = {
  input: {
    antCount: 4,
    distances: [
      [0, 2, 9, 10],
      [2, 0, 6, 4],
      [9, 6, 0, 3],
      [10, 4, 3, 0],
    ],
    evaporation: 0.3,
    iterations: 4,
    seed: "tool.io",
  },
  output: { result: { distance: 18, tour: [0, 1, 3, 2] } },
} satisfies ToolExample<
  {
    readonly antCount: number;
    readonly distances: readonly (readonly number[])[];
    readonly evaporation: number;
    readonly iterations: number;
    readonly seed: string;
  },
  { readonly result: AntColonyResult }
>;
export const antColonyTspTool = createSimpleTool({
  id: "optimization/ant-colony-tsp",
  title: "Ant Colony TSP Solver",
  description:
    "Search for a short traveling-salesperson tour with a reproducible ant-colony heuristic.",
  inputs: [
    {
      format: "matrix/distance",
      id: "distances",
      kind: "matrix",
      label: "Distance matrix",
    },
    {
      id: "antCount",
      kind: "integer",
      label: "Ant count",
      maximum: 10_000,
      minimum: 1,
    },
    {
      id: "iterations",
      kind: "integer",
      label: "Iterations",
      maximum: 100_000,
      minimum: 1,
    },
    {
      id: "evaporation",
      kind: "number",
      label: "Evaporation",
      maximum: 1,
      minimum: Number.MIN_VALUE,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "optimization/tsp-tour",
      id: "result",
      kind: "object",
      label: "Best tour",
    },
  ],
  calculate: (input) => {
    const result = solveTspWithAntColony(
      input.distances as number[][],
      input.antCount as number,
      input.iterations as number,
      input.evaporation as number,
      input.seed as string,
    );
    if (!result)
      return simpleError(
        "distances",
        "Enter a square, finite, nonnegative distance matrix within the supported work limit.",
      );
    return { result };
  },
});
export const runAntColonyTsp = antColonyTspTool.execute;
export default antColonyTspTool;
