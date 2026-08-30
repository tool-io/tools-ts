import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nodeIds: readonly string[];
  readonly adjacency: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly betweenness: readonly number[];
  readonly topNodeId: string;
}>;
export const calculate = (input: Input): Output => {
  const n = input.nodeIds.length,
    m = input.adjacency;
  if (
    n < 3 ||
    m.length !== n ||
    m.some((r) => r.length !== n || r.some((v) => v !== 0 && v !== 1))
  )
    simpleError(
      "adjacency",
      "Square binary adjacency and at least three nodes required.",
    );
  if (
    m.some((row, i) =>
      row.some((edge, j) => (i === j && edge !== 0) || edge !== m[j][i]),
    )
  )
    simpleError(
      "adjacency",
      "Undirected adjacency must be symmetric without self-loops.",
    );
  const betweenness = Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const paths = Array(n).fill(0),
      dist = Array(n).fill(-1),
      pred = Array.from({ length: n }, () => [] as number[]),
      queue = [s],
      order: number[] = [];
    paths[s] = 1;
    dist[s] = 0;
    for (let head = 0; head < queue.length; head++) {
      const v = queue[head];
      order.push(v);
      for (let w = 0; w < n; w++)
        if (m[v][w] === 1) {
          if (dist[w] < 0) {
            dist[w] = dist[v] + 1;
            queue.push(w);
          }
          if (dist[w] === dist[v] + 1) {
            paths[w] += paths[v];
            pred[w].push(v);
          }
        }
    }
    const delta = Array(n).fill(0);
    for (const w of order.reverse())
      for (const v of pred[w])
        delta[v] += (paths[v] / paths[w]) * (1 + delta[w]);
    for (let v = 0; v < n; v++) if (v !== s) betweenness[v] += delta[v];
  }
  for (let v = 0; v < n; v++) betweenness[v] /= 2;
  return {
    betweenness,
    topNodeId: input.nodeIds[betweenness.indexOf(Math.max(...betweenness))],
  };
};
export const exampleInput = {
  nodeIds: ["a", "b", "c"],
  adjacency: [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  betweenness: [0, 1, 0],
  topNodeId: "b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/pathway-betweenness",
  title: "Pathway Betweenness",
  description:
    "Calculate undirected pathway graph betweenness by shortest-path dependency.",
  inputs: [
    { id: "nodeIds", kind: "stringList", label: "Node ids" },
    { id: "adjacency", kind: "matrix", label: "Adjacency" },
  ],
  outputs: [
    { id: "betweenness", kind: "numberList", label: "Betweenness" },
    { id: "topNodeId", kind: "string", label: "Top node id" },
  ],
  calculate: (value) =>
    calculate({
      nodeIds: value.nodeIds as readonly string[],
      adjacency: value.adjacency as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
