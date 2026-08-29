import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { bipartite } from "../milestone-core.js";

export const example = {
  input: {
    vertexCount: 3,
    edges: [
      [0, 1],
      [1, 2],
    ],
  },
  output: { bipartite: true, colors: [0, 1, 0] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "graph/bipartite-checker",
  title: "Bipartite Graph Checker",
  description:
    "Two-color an undirected graph and detect odd cycles or self-loops. Vertices are zero-based indices, and disconnected components are handled.",
  inputs: [
    {
      id: "vertexCount",
      kind: "integer",
      label: "vertex Count",
      minimum: 0,
      maximum: 10000,
    },
    { id: "edges", kind: "matrix", label: "edges" },
  ],
  outputs: [
    { id: "bipartite", kind: "boolean", label: "bipartite" },
    { id: "colors", kind: "numberList", label: "colors" },
  ],
  calculate: (input) =>
    bipartite(input.vertexCount as number, input.edges as number[][]),
});
export type BipartiteCheckerInput = Readonly<typeof example.input>;
export type BipartiteCheckerOutput = Readonly<typeof example.output>;
export const bipartiteCheckerTool = tool;
export const runBipartiteChecker = tool.execute;
export default tool;
