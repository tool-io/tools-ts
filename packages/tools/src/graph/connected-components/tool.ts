import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { normalizeGraph } from "../normalize-edge-list/tool.js";

export type ConnectedComponentsInput = {
  readonly graph: Record<string, unknown>;
};

export type ConnectedComponentsOutput = {
  readonly table: {
    readonly componentCount: number;
    readonly components: number[];
    readonly nodes: string[];
    readonly sizes: number[];
  };
};

export const connectedComponentsExample = {
  input: { graph: { a: ["b"], c: [] } },
  output: {
    table: {
      componentCount: 2,
      components: [0, 0, 1],
      nodes: ["a", "b", "c"],
      sizes: [2, 1],
    },
  },
} satisfies ToolExample<ConnectedComponentsInput, ConnectedComponentsOutput>;

export const calculateConnectedComponents = (
  input: ConnectedComponentsInput,
): ConnectedComponentsOutput => {
  // Connectivity is computed weakly: edge direction is ignored.
  const graph = normalizeGraph(input.graph, "graph", false);
  if (graph.nodes.length === 0)
    simpleError(
      "graph",
      "Provide at least one node.",
      "insufficient_nodes",
    );
  const indexOf = new Map(
    graph.nodes.map((node, position) => [node, position]),
  );
  const parent = graph.nodes.map((_, position) => position);
  const find = (start: number): number => {
    let root = start;
    while (parent[root]! !== root) root = parent[root]!;
    while (parent[start]! !== root) {
      const next = parent[start]!;
      parent[start] = root;
      start = next;
    }
    return root;
  };
  for (const [source, target] of graph.edges) {
    const sourceRoot = find(indexOf.get(source)!);
    const targetRoot = find(indexOf.get(target)!);
    if (sourceRoot === targetRoot) continue;
    const [low, high] =
      sourceRoot < targetRoot
        ? [sourceRoot, targetRoot]
        : [targetRoot, sourceRoot];
    parent[high] = low;
  }
  const componentOfRoot = new Map<number, number>();
  const components: number[] = [];
  const sizes: number[] = [];
  for (let position = 0; position < graph.nodes.length; position += 1) {
    const root = find(position);
    if (!componentOfRoot.has(root)) {
      componentOfRoot.set(root, sizes.length);
      sizes.push(0);
    }
    const component = componentOfRoot.get(root)!;
    components.push(component);
    sizes[component] += 1;
  }
  return {
    table: {
      componentCount: sizes.length,
      components,
      nodes: [...graph.nodes],
      sizes,
    },
  };
};

export const connectedComponentsTool = createSimpleTool({
  calculate: (input) =>
    calculateConnectedComponents(input as unknown as ConnectedComponentsInput),
  description:
    "Label the weakly connected components of a graph over an adjacency map.",
  id: "graph/connected-components",
  inputs: [
    {
      description:
        "Adjacency map from node name to an array of neighbor names; direction is ignored.",
      id: "graph",
      kind: "object",
      label: "Adjacency map",
    },
  ],
  outputs: [
    {
      description:
        "Sorted node names with aligned component labels and per-component sizes.",
      id: "table",
      kind: "object",
      label: "Components",
    },
  ],
  title: "Connected Components Finder",
});
export const runConnectedComponents = connectedComponentsTool.execute;
export default connectedComponentsTool;
