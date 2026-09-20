import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { calculateBreadthFirstTraversal } from "../../graph/breadth-first-traversal/tool.js";
import { calculateDepthFirstTraversal } from "../../graph/depth-first-traversal/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  labelSchema,
  probabilitySchema,
  integerSchema,
} from "../m250-algorithms-common.js";
import {
  algorithmAdjacency,
  algorithmNodeNames,
  algorithmRandomEdges,
  algorithmEdgesSchema,
  algorithmNodesSchema,
  algorithmAdjacencySchema,
  algorithmTraversalSchema,
  type AlgorithmEdge,
} from "../m250-algorithms-graphs.js";

export type GraphTraversalQuizInput = {
  readonly nodeCount: number;
  readonly directed: boolean;
  readonly edgeProbability: number;
  readonly seed?: number;
};
export type GraphTraversalAnswer = {
  readonly visitOrder: readonly string[];
  readonly depths: Readonly<Record<string, number>>;
};
export type GraphTraversalQuizOutput = {
  readonly nodes: readonly string[];
  readonly directed: boolean;
  readonly edges: readonly AlgorithmEdge[];
  readonly graph: Readonly<Record<string, readonly string[]>>;
  readonly start: string;
  readonly convention: string;
  readonly breadthFirst: GraphTraversalAnswer;
  readonly depthFirst: GraphTraversalAnswer;
  readonly unreachable: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    nodeCount: integerSchema(2, 12),
    directed: { type: "boolean" },
    edgeProbability: probabilitySchema,
    seed: generatorSeedSchema,
  },
  ["nodeCount", "directed", "edgeProbability"],
);
export const outputSchema = objectSchema({
  nodes: algorithmNodesSchema,
  directed: { type: "boolean" },
  edges: algorithmEdgesSchema,
  graph: algorithmAdjacencySchema,
  start: labelSchema,
  convention: { type: "string" },
  breadthFirst: algorithmTraversalSchema,
  depthFirst: algorithmTraversalSchema,
  unreachable: arraySchema(labelSchema, 12),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is GraphTraversalQuizInput =>
  matchesModelInput(input, inputSchema);
export const calculateGraphTraversalQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GraphTraversalQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      nodes = algorithmNodeNames(input.nodeCount);
    const edges = algorithmRandomEdges(
        input.nodeCount,
        input.edgeProbability,
        input.directed,
        false,
        random,
      ),
      graph = algorithmAdjacency(nodes, edges, input.directed);
    const start = random.pick(nodes),
      breadthFirst = calculateBreadthFirstTraversal({ graph, start }),
      depthFirst = calculateDepthFirstTraversal({ graph, start });
    return toolSuccess({
      nodes,
      directed: input.directed,
      edges,
      graph,
      start,
      convention:
        "Ascending ASCII neighbor labels; BFS discovery order and DFS preorder. Only this convention is graded; other neighbor orders may also be valid traversals.",
      breadthFirst,
      depthFirst,
      unreachable: nodes.filter(
        (node) => !breadthFirst.visitOrder.includes(node),
      ),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const graphTraversalQuizExample = {
  input: { nodeCount: 4, directed: false, edgeProbability: 0.7, seed: 42 },
  output: {
    nodes: ["n00", "n01", "n02", "n03"],
    directed: false,
    edges: [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
      [2, 3],
    ],
    graph: {
      n00: ["n01", "n02"],
      n01: ["n00", "n02", "n03"],
      n02: ["n00", "n01", "n03"],
      n03: ["n01", "n02"],
    },
    start: "n01",
    convention:
      "Ascending ASCII neighbor labels; BFS discovery order and DFS preorder. Only this convention is graded; other neighbor orders may also be valid traversals.",
    breadthFirst: {
      visitOrder: ["n01", "n00", "n02", "n03"],
      depths: { n01: 0, n00: 1, n02: 1, n03: 1 },
    },
    depthFirst: {
      visitOrder: ["n01", "n00", "n02", "n03"],
      depths: { n01: 0, n00: 1, n02: 2, n03: 3 },
    },
    unreachable: [],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<GraphTraversalQuizInput, GraphTraversalQuizOutput>;
export const graphTraversalQuizTool = createModelDefinition<
  GraphTraversalQuizInput,
  GraphTraversalQuizOutput
>({
  id: "random/graph-traversal-quiz",
  title: "Random Graph Traversal Quiz Generator",
  description:
    "Generate a bounded Bernoulli graph and start node with delegated BFS and DFS answers under an explicit ascending-neighbor convention.",
  inputSchema,
  outputSchema,
  execute: calculateGraphTraversalQuiz,
});
export const runGraphTraversalQuiz = graphTraversalQuizTool.execute;
export default graphTraversalQuizTool;
