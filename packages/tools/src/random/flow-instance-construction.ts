import { simpleError } from "../core/simple.js";
import { graphNodes } from "./graph-instance-construction.js";
import type { GeneratorRandom } from "./generator-random.js";
export const flowNodeCountSchema = {
  type: "integer",
  minimum: 2,
  maximum: 32,
} as const;
export const flowArcCountSchema = {
  type: "integer",
  minimum: 1,
  maximum: 992,
} as const;
export const flowNodeSchema = {
  type: "integer",
  minimum: 0,
  maximum: 31,
} as const;
export const flowNodesSchema = {
  type: "array",
  minItems: 2,
  maxItems: 32,
  items: flowNodeSchema,
} as const;
/** A random Hamiltonian source-to-sink path plus distinct directed extras; not uniform over networks. */
export const constructFlowArcs = (
  nodeCount: number,
  arcCount: number,
  random: GeneratorRandom,
): { nodes: number[]; path: number[]; pairs: [number, number][] } => {
  if (arcCount < nodeCount - 1 || arcCount > nodeCount * (nodeCount - 1))
    return simpleError(
      "arcCount",
      "Arc count must fit a spanning source-to-sink path and distinct nonloop directed arcs.",
      "infeasible_arc_count",
    );
  const nodes = graphNodes(nodeCount),
    path = [0, ...random.shuffle(nodes.slice(1, -1)), nodeCount - 1];
  const mandatory: [number, number][] = path
    .slice(1)
    .map((to, i) => [path[i], to]);
  const keys = new Set(mandatory.map(([a, b]) => a + "," + b)),
    extras: [number, number][] = [];
  for (const from of nodes)
    for (const to of nodes)
      if (from !== to && !keys.has(from + "," + to)) extras.push([from, to]);
  return {
    nodes,
    path,
    pairs: [
      ...mandatory,
      ...random.shuffle(extras).slice(0, arcCount - mandatory.length),
    ],
  };
};
