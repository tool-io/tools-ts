import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, graph } from "../shared.js";
export type Input = Readonly<{
  readonly adjacency: readonly (readonly number[])[];
  readonly communityLabels: readonly number[];
  readonly resolution: number;
}>;
export type Output = Readonly<{
  readonly modularity: number;
  readonly undirectedEdgeCount: number;
  readonly communityCount: number;
}>;
const inputFields = [
  { id: "adjacency", label: "Adjacency", kind: "matrix" },
  { id: "communityLabels", label: "Community labels", kind: "numberList" },
  { id: "resolution", label: "Resolution", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = graph(input.adjacency);
  if (input.communityLabels.length !== n)
    simpleError("communityLabels", "One community label per node required.");
  input.communityLabels.forEach((v) => count(v, "communityLabels"));
  positive(input.resolution, "resolution");
  const degrees = input.adjacency.map((row) => row.reduce((a, b) => a + b, 0)),
    twiceEdges = positive(
      degrees.reduce((a, b) => a + b, 0),
      "adjacency",
    );
  let q = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (input.communityLabels[i] === input.communityLabels[j])
        q +=
          input.adjacency[i][j] -
          (input.resolution * degrees[i] * degrees[j]) / twiceEdges;
  return {
    modularity: q / twiceEdges,
    undirectedEdgeCount: twiceEdges / 2,
    communityCount: new Set(input.communityLabels).size,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  adjacency: [
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
  ],
  communityLabels: [0, 0, 1, 1],
  resolution: 1,
} satisfies Input;
export const exampleOutput = {
  modularity: 0.5,
  undirectedEdgeCount: 2,
  communityCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/partition-network-modularity",
  title: "Network Modularity",
  description:
    "Evaluate resolution-parameter Newman–Girvan modularity for a supplied binary graph partition; this scores a partition, it does not discover or optimize communities.",
  inputs: inputFields,
  outputs: [
    { id: "modularity", label: "Modularity", kind: "number" },
    {
      id: "undirectedEdgeCount",
      label: "Undirected edge count",
      kind: "number",
    },
    { id: "communityCount", label: "Community count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      adjacency: value.adjacency as readonly (readonly number[])[],
      communityLabels: value.communityLabels as readonly number[],
      resolution: value.resolution as number,
    }),
});
export const run = tool.execute;
export default tool;
