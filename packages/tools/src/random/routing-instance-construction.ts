import { calculateEuclideanDistance } from "../geometry/euclidean-distance/tool.js";
import { simpleError } from "../core/simple.js";
import { orderedInstanceRange } from "./optimization-instance-integers.js";
import type { GeneratorRandom } from "./generator-random.js";
export type InstancePoint = readonly [number, number];
export const routingPointSchema = {
  type: "array",
  minItems: 2,
  maxItems: 2,
  items: { type: "integer" },
} as const;
export const routingPointsSchema = {
  type: "array",
  minItems: 2,
  maxItems: 64,
  items: routingPointSchema,
} as const;
export const routingNodesSchema = {
  type: "array",
  minItems: 2,
  maxItems: 65,
  items: { type: "integer", minimum: 0, maximum: 63 },
} as const;
export const routingMatrixSchema = {
  type: "array",
  minItems: 2,
  maxItems: 64,
  items: {
    type: "array",
    minItems: 2,
    maxItems: 64,
    items: { type: "number", minimum: 0 },
  },
} as const;
export const constructRoutingGeometry = (
  nodeCount: number,
  minimum: number,
  maximum: number,
  random: GeneratorRandom,
): { points: InstancePoint[]; distances: number[][] } => {
  orderedInstanceRange(minimum, maximum, "maximumCoordinate");
  const points: InstancePoint[] = Array.from({ length: nodeCount }, () => [
    random.integer(minimum, maximum),
    random.integer(minimum, maximum),
  ]);
  const distances = points.map((a) =>
    points.map((b) => {
      const distance = calculateEuclideanDistance(a, b);
      if (distance === null)
        return simpleError(
          "maximumCoordinate",
          "A generated distance is not finite.",
          "numeric_overflow",
        );
      return distance;
    }),
  );
  return { points, distances };
};
export const routingTourLength = (
  tour: readonly number[],
  distances: readonly (readonly number[])[],
): number => {
  let total = 0;
  for (let i = 1; i < tour.length; i += 1)
    total += distances[tour[i - 1]][tour[i]];
  if (!Number.isFinite(total))
    return simpleError(
      "maximumCoordinate",
      "The route length is not finite.",
      "numeric_overflow",
    );
  return total;
};
