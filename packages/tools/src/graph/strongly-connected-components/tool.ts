import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type StronglyConnectedComponentsInput = {
  readonly edges?: readonly (readonly [number, number])[];
  readonly nodeCount: number;
};
export type StronglyConnectedComponentsOutput = {
  readonly componentCount: number;
  readonly components: readonly (readonly number[])[];
  readonly condensationEdges: readonly (readonly [number, number])[];
  readonly membership: readonly number[];
};
const vertexSchema = { minimum: 0, maximum: 511, type: "integer" } as const;
const edgesSchema = {
  items: { items: vertexSchema, maxItems: 2, minItems: 2, type: "array" },
  maxItems: 4096,
  type: "array",
} as const;
export const inputSchema = {
  additionalProperties: false,
  properties: {
    edges: { ...edgesSchema, default: [] },
    nodeCount: {
      description:
        "Vertices are integer indices 0 through nodeCount - 1; isolated vertices remain in the result.",
      minimum: 0,
      maximum: 512,
      type: "integer",
    },
  },
  required: ["nodeCount"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    componentCount: { minimum: 0, maximum: 512, type: "integer" },
    components: {
      items: { items: vertexSchema, minItems: 1, maxItems: 512, type: "array" },
      maxItems: 512,
      type: "array",
    },
    condensationEdges: edgesSchema,
    membership: { items: vertexSchema, maxItems: 512, type: "array" },
  },
  required: ["componentCount", "components", "condensationEdges", "membership"],
  type: "object",
} as const;
const isInput = (input: unknown): input is StronglyConnectedComponentsInput =>
  matchesModelInput(input, inputSchema);

/** Iterative Kosaraju–Sharir: reverse-graph finish order, then original-graph DFS. */
export const calculateStronglyConnectedComponents = (
  input: unknown,
): ToolResult<StronglyConnectedComponentsOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  const { nodeCount } = input,
    edges = input.edges ?? [];
  const forward: number[][] = Array.from({ length: nodeCount }, () => []);
  const reverse: number[][] = Array.from({ length: nodeCount }, () => []);
  for (let i = 0; i < edges.length; i += 1) {
    const [from, to] = edges[i];
    if (from >= nodeCount || to >= nodeCount)
      return invalidInput([
        {
          code: "invalid_vertex",
          field: `edges.${i}`,
          message: "Every endpoint must be an existing vertex.",
        },
      ]);
    forward[from].push(to);
    reverse[to].push(from);
  }
  const marked = Array<boolean>(nodeCount).fill(false),
    finish: number[] = [];
  for (let root = 0; root < nodeCount; root += 1) {
    if (marked[root]) continue;
    marked[root] = true;
    const stack = [{ node: root, next: 0 }];
    while (stack.length > 0) {
      const frame = stack.at(-1);
      if (!frame) break;
      if (frame.next >= reverse[frame.node].length) {
        finish.push(frame.node);
        stack.pop();
        continue;
      }
      const target = reverse[frame.node][frame.next];
      frame.next += 1;
      if (!marked[target]) {
        marked[target] = true;
        stack.push({ node: target, next: 0 });
      }
    }
  }
  marked.fill(false);
  const components: number[][] = [];
  for (const root of finish.reverse()) {
    if (marked[root]) continue;
    const stack = [root],
      component: number[] = [];
    marked[root] = true;
    while (stack.length > 0) {
      const node = stack.pop();
      if (node === undefined) break;
      component.push(node);
      for (const target of forward[node])
        if (!marked[target]) {
          marked[target] = true;
          stack.push(target);
        }
    }
    components.push(component.sort((a, b) => a - b));
  }
  // Canonical IDs follow the smallest member, not an implied topological order.
  components.sort((a, b) => a[0] - b[0]);
  const membership = Array<number>(nodeCount).fill(0);
  components.forEach((component, id) =>
    component.forEach((node) => {
      membership[node] = id;
    }),
  );
  const seen = new Set<string>();
  const condensationEdges: [number, number][] = [];
  for (const [from, to] of edges) {
    const a = membership[from],
      b = membership[to],
      key = `${a},${b}`;
    if (a !== b && !seen.has(key)) {
      seen.add(key);
      condensationEdges.push([a, b]);
    }
  }
  condensationEdges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return toolSuccess({
    componentCount: components.length,
    components,
    condensationEdges,
    membership,
  });
};
export const stronglyConnectedComponentsExample = {
  input: {
    nodeCount: 7,
    edges: [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 3],
      [3, 4],
      [4, 3],
      [4, 5],
      [5, 6],
    ],
  },
  output: {
    componentCount: 4,
    components: [[0, 1, 2], [3, 4], [5], [6]],
    condensationEdges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    membership: [0, 0, 0, 1, 1, 2, 3],
  },
} satisfies ToolExample<
  StronglyConnectedComponentsInput,
  StronglyConnectedComponentsOutput
>;
export const stronglyConnectedComponentsTool = createModelDefinition<
  StronglyConnectedComponentsInput,
  StronglyConnectedComponentsOutput
>({
  discovery: {
    aliases: ["Strongly Connected Components Finder"],
    collections: ["data", "learn"],
    fields: ["graph"],
    keywords: [],
  },
  id: "graph/strongly-connected-components",
  title: "Strongly Connected Components Finder",
  description:
    "Partition a bounded directed graph into canonical strongly connected components and return vertex memberships plus its deduplicated condensation edges using iterative Kosaraju–Sharir searches.",
  inputSchema,
  outputSchema,
  execute: calculateStronglyConnectedComponents,
});
export const runStronglyConnectedComponents =
  stronglyConnectedComponentsTool.execute;
export default stronglyConnectedComponentsTool;
