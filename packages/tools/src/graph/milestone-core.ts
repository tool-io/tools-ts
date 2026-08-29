import { simpleError } from "../core/simple.js";

const adjacency = (vertexCount: number, edges: number[][]): number[][] => {
  if (
    edges.some(
      (edge) =>
        edge.length !== 2 ||
        edge.some((v) => !Number.isSafeInteger(v) || v < 0 || v >= vertexCount),
    )
  )
    simpleError("edges", "Each edge must contain two vertex indices in range.");
  const lists = Array.from({ length: vertexCount }, () => [] as number[]);
  edges.forEach(([a, b]) => {
    lists[a!]!.push(b!);
    lists[b!]!.push(a!);
  });
  return lists;
};

export const bipartite = (vertexCount: number, edges: number[][]) => {
  const lists = adjacency(vertexCount, edges);
  const colors = Array<number>(vertexCount).fill(-1);
  for (let start = 0; start < vertexCount; start++) {
    if (colors[start] !== -1) continue;
    colors[start] = 0;
    const queue = [start];
    for (let head = 0; head < queue.length; head++) {
      const node = queue[head]!;
      for (const next of lists[node]!) {
        if (colors[next] === colors[node]) return { bipartite: false, colors };
        if (colors[next] === -1) {
          colors[next] = 1 - colors[node]!;
          queue.push(next);
        }
      }
    }
  }
  return { bipartite: true, colors };
};

export const eulerianPath = (vertexCount: number, edges: number[][]) => {
  const lists = adjacency(vertexCount, edges);
  const odd = lists.flatMap((neighbors, i) =>
    neighbors.length % 2 ? [i] : [],
  );
  if (odd.length !== 0 && odd.length !== 2)
    return { exists: false, path: [] as number[] };
  if (edges.length === 0) return { exists: true, path: vertexCount ? [0] : [] };
  const start = odd[0] ?? lists.findIndex((row) => row.length > 0);
  const edgeLists = Array.from(
    { length: vertexCount },
    () => [] as { to: number; id: number }[],
  );
  edges.forEach(([a, b], id) => {
    edgeLists[a!]!.push({ to: b!, id });
    edgeLists[b!]!.push({ to: a!, id });
  });
  const used = new Set<number>(),
    stack = [start],
    path: number[] = [];
  while (stack.length) {
    const node = stack.at(-1)!;
    while (edgeLists[node]!.length && used.has(edgeLists[node]!.at(-1)!.id))
      edgeLists[node]!.pop();
    const edge = edgeLists[node]!.pop();
    if (!edge) path.push(stack.pop()!);
    else if (!used.has(edge.id)) {
      used.add(edge.id);
      stack.push(edge.to);
    }
  }
  if (used.size !== edges.length) return { exists: false, path: [] };
  return { exists: true, path: path.reverse() };
};
