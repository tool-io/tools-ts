import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Vertex = number | string;
export type VertexEdges = {
  readonly edges: readonly (readonly [Vertex, Vertex])[];
};
export type VertexCoverApproximation = {
  readonly approximationRatio: 2;
  readonly cover: readonly Vertex[];
  readonly coverSize: number;
  readonly maximalMatching: readonly (readonly [Vertex, Vertex])[];
};
const key = (vertex: Vertex): string => `${typeof vertex}:${String(vertex)}`;
const validEdges = (value: unknown): value is VertexEdges =>
  typeof value === "object" &&
  value !== null &&
  "edges" in value &&
  Array.isArray(value.edges) &&
  value.edges.length > 0 &&
  value.edges.length <= 10_000 &&
  value.edges.every(
    (edge) =>
      Array.isArray(edge) &&
      edge.length === 2 &&
      edge.every(
        (vertex) =>
          (typeof vertex === "string" && vertex.trim() !== "") ||
          (typeof vertex === "number" && Number.isFinite(vertex)),
      ) &&
      key(edge[0] as Vertex) !== key(edge[1] as Vertex),
  );
export const approximateVertexCover = (
  input: VertexEdges,
): VertexCoverApproximation => {
  const selectedKeys = new Set<string>();
  const cover: Vertex[] = [];
  const maximalMatching: [Vertex, Vertex][] = [];
  for (const [first, second] of input.edges) {
    if (selectedKeys.has(key(first)) || selectedKeys.has(key(second))) continue;
    maximalMatching.push([first, second]);
    for (const vertex of [first, second]) {
      selectedKeys.add(key(vertex));
      cover.push(vertex);
    }
  }
  return {
    approximationRatio: 2,
    cover,
    coverSize: cover.length,
    maximalMatching,
  };
};

export const vertexCoverExample = {
  input: {
    graph: {
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["C", "D"],
        ["D", "A"],
      ],
    },
  },
  output: {
    result: {
      approximationRatio: 2,
      cover: ["A", "B", "C", "D"],
      coverSize: 4,
      maximalMatching: [
        ["A", "B"],
        ["C", "D"],
      ],
    },
  },
} satisfies ToolExample<
  { readonly graph: VertexEdges },
  { readonly result: VertexCoverApproximation }
>;

export const vertexCoverTool = createSimpleTool({
  id: "approximation/vertex-cover-2-approximation",
  title: "Vertex-Cover 2-Approximation Demonstrator",
  description:
    "Build a maximal matching and select both endpoints for an unweighted factor-2 vertex cover.",
  inputs: [
    { format: "graph/edges", id: "graph", kind: "object", label: "Edges" },
  ],
  outputs: [
    {
      format: "graph/vertex-cover",
      id: "result",
      kind: "object",
      label: "Approximate vertex cover",
    },
  ],
  calculate: (input) => {
    if (!validEdges(input.graph))
      return simpleError("graph", "Enter one or more valid, non-self edges.");
    return { result: approximateVertexCover(input.graph) };
  },
});
export const runVertexCoverApproximation = vertexCoverTool.execute;
export default vertexCoverTool;
