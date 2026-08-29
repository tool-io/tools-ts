import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { eulerianPath } from "../milestone-core.js";

export const example = {
  input: {
    vertexCount: 3,
    edges: [
      [0, 1],
      [1, 2],
    ],
  },
  output: { exists: true, path: [0, 1, 2] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "graph/eulerian-path",
  title: "Eulerian Path Finder",
  description:
    "Find an undirected multigraph trail that traverses every edge exactly once, or report that none exists. Parallel edges and self-loops are retained.",
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
    { id: "exists", kind: "boolean", label: "exists" },
    { id: "path", kind: "numberList", label: "path" },
  ],
  calculate: (input) =>
    eulerianPath(input.vertexCount as number, input.edges as number[][]),
});
export type EulerianPathInput = Readonly<typeof example.input>;
export type EulerianPathOutput = Readonly<typeof example.output>;
export const eulerianPathTool = tool;
export const runEulerianPath = tool.execute;
export default tool;
