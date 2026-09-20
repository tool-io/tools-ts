import { calculateConnectedComponents } from "../graph/connected-components/tool.js";
import { calculateDegrees } from "../graph/degrees/tool.js";
import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
import { fcBudget, fcChoices } from "./m250-fiction-craft-common.js";

export type FcEdge = { readonly a: number; readonly b: number };
export const fcGraph = (
  ids: readonly string[],
  edges: readonly FcEdge[],
): Record<string, string[]> =>
  Object.fromEntries(
    ids.map((id, i) => [
      id,
      edges.flatMap(({ a, b }) =>
        a === i ? [ids[b]] : b === i ? [ids[a]] : [],
      ),
    ]),
  );
export const fcGraphEvidence = (
  ids: readonly string[],
  edges: readonly FcEdge[],
): {
  readonly components: number;
  readonly degrees: readonly { readonly id: string; readonly degree: number }[];
} => {
  const graph = fcGraph(ids, edges),
    table = calculateDegrees({ graph, directed: false }).table;
  return {
    components: calculateConnectedComponents({ graph }).table.componentCount,
    degrees: table.nodes.map((id, i) => ({ id, degree: table.degree[i] })),
  };
};
/** Exact edge-count simple-graph search; random pair priority, bounded DFS. */
export const fcTopology = (
  ids: readonly string[],
  count: number,
  minimumDegree: number,
  maximumDegree: number,
  connected: boolean,
  random: GeneratorRandom,
  searchLimit = 50_000,
): FcEdge[] => {
  const n = ids.length;
  if (
    minimumDegree > maximumDegree ||
    minimumDegree >= n ||
    count > (n * (n - 1)) / 2 ||
    count * 2 < minimumDegree * n ||
    count * 2 > maximumDegree * n ||
    (connected && n > 1 && count < n - 1)
  )
    return simpleError(
      "constraints",
      "The requested edge count and degree/connectivity bounds are infeasible.",
      "infeasible_constraints",
    );
  const pairs: FcEdge[] = [];
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++) pairs.push({ a, b });
  const candidates = fcChoices(random.shuffle(pairs), random),
    degree = Array<number>(n).fill(0),
    selected: FcEdge[] = [],
    tick = fcBudget(searchLimit);
  const search = (index: number): boolean => {
    tick();
    if (selected.length === count)
      return (
        degree.every((d) => d >= minimumDegree) &&
        (!connected || fcGraphEvidence(ids, selected).components === 1)
      );
    if (
      index >= candidates.length ||
      selected.length + candidates.length - index < count
    )
      return false;
    const pair = candidates[index];
    if (degree[pair.a] < maximumDegree && degree[pair.b] < maximumDegree) {
      selected.push(pair);
      degree[pair.a]++;
      degree[pair.b]++;
      if (search(index + 1)) return true;
      selected.pop();
      degree[pair.a]--;
      degree[pair.b]--;
    }
    return search(index + 1);
  };
  if (!search(0))
    return simpleError(
      "constraints",
      "No graph satisfies the supplied constraints.",
      "infeasible_constraints",
    );
  return selected.sort((x, y) => x.a - y.a || x.b - y.b);
};
