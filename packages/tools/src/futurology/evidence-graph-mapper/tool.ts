import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nodes: readonly string[];
  readonly edges: readonly string[];
}>;
export type Output = Readonly<{
  readonly validEdges: readonly string[];
  readonly invalidEdges: readonly string[];
  readonly orphanNodes: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const nodes = new Set(input.nodes);
  if (nodes.size !== input.nodes.length || nodes.has(""))
    simpleError(
      "nodes",
      "Node IDs must be unique and nonempty.",
      "invalid_nodes",
    );
  const validEdges: string[] = [];
  const invalidEdges: string[] = [];
  const connected = new Set<string>();
  for (const edge of input.edges) {
    const parts = edge.split("->").map((value) => value.trim());
    if (parts.length === 2 && nodes.has(parts[0]) && nodes.has(parts[1])) {
      validEdges.push(edge);
      connected.add(parts[0]);
      connected.add(parts[1]);
    } else invalidEdges.push(edge);
  }
  return {
    validEdges,
    invalidEdges,
    orphanNodes: input.nodes.filter((node) => !connected.has(node)),
  };
};

export const exampleInput = {
  nodes: ["claim", "witness", "document"],
  edges: ["witness->claim", "document->claim"],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  nodes: ["a", "b"],
  edges: ["a->missing"],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nodes: input.nodes as readonly string[],
      edges: input.edges as readonly string[],
    }),
  description:
    "Validate a compact directed evidence graph encoded as node IDs and A->B edges.",
  id: "futurology/evidence-graph-mapper",
  inputs: [
    { id: "nodes", label: "Evidence node IDs", kind: "stringList" },
    { id: "edges", label: "Directed edges", kind: "stringList" },
  ],
  outputs: [
    { id: "validEdges", label: "Valid edges", kind: "stringList" },
    { id: "invalidEdges", label: "Invalid edges", kind: "stringList" },
    { id: "orphanNodes", label: "Orphan nodes", kind: "stringList" },
  ],
  title: "Evidence Graph Mapper",
});

export const run = tool.execute;
export default tool;
