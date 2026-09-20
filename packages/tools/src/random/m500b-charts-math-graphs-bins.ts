import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
import { safe } from "./m500b-charts-math-graphs-support.js";
export const validateEdges = (
  edges: readonly number[],
  epsilon: number,
): void => {
  for (let i = 0; i < edges.length; i++) {
    if (i && edges[i] <= edges[i - 1])
      return simpleError(
        "edges",
        "Edges must be strictly increasing.",
        "invalid_edges",
      );
    safe(edges[i] - epsilon, "epsilon");
    safe(edges[i] + epsilon, "epsilon");
  }
};
export const nearEdge = (
  edges: readonly number[],
  epsilon: number,
  random: GeneratorRandom,
): number => safe(random.pick(edges) + random.integer(-1, 1) * epsilon);
/** Left closed / last inclusive, or right closed / first inclusive. */
export const binOf = (
  value: number,
  edges: readonly number[],
  closed: "left" | "right",
): number => {
  if (value < edges[0] || value > edges[edges.length - 1]) return -1;
  if (value === edges[0]) return 0;
  if (value === edges[edges.length - 1]) return edges.length - 2;
  for (let i = 0; i < edges.length - 1; i++)
    if (
      closed === "left"
        ? value >= edges[i] && value < edges[i + 1]
        : value > edges[i] && value <= edges[i + 1]
    )
      return i;
  return -1;
};
