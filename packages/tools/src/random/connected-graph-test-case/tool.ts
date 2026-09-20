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
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  connectedSimpleEdges,
  graphNodes,
  graphAdjacency,
  verifiedComponentCount,
  nodeCountSchema,
  edgeCountSchema,
  graphEdgesSchema,
  nodeListSchema,
  type SimpleEdge,
} from "../graph-instance-construction.js";
import { normalizeGraph } from "../../graph/normalize-edge-list/tool.js";
import { calculateDensity } from "../../graph/density/tool.js";

export type ConnectedGraphTestCaseInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly seed?: number;
};
export type ConnectedGraphTestCaseOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly componentCount: number;
  readonly density: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodeCount: nodeCountSchema,
    edgeCount: edgeCountSchema,
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "edgeCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: graphEdgesSchema,
    componentCount: { type: "integer", const: 1 },
    density: { type: "number", minimum: 0, maximum: 1 },
    randomness: generatorReplaySchema,
  },
  required: ["nodes", "edges", "componentCount", "density", "randomness"],
} as const;

const isInput = (input: unknown): input is ConnectedGraphTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateConnectedGraphTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ConnectedGraphTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      nodes = graphNodes(input.nodeCount),
      edges = connectedSimpleEdges(input.nodeCount, input.edgeCount, random);
    const graph = graphAdjacency(input.nodeCount, edges),
      normalized = normalizeGraph(graph, "graph", false),
      componentCount = verifiedComponentCount(input.nodeCount, edges);
    if (
      componentCount !== 1 ||
      normalized.nodes.length !== input.nodeCount ||
      normalized.edges.length !== input.edgeCount
    )
      throw new Error(
        "Connected graph construction failed its imported structural verification.",
      );
    const density = calculateDensity({ graph, directed: false }).density;
    return toolSuccess({
      nodes,
      edges,
      componentCount,
      density,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const connectedGraphTestCaseExample = {
  input: {
    nodeCount: 5,
    edgeCount: 6,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 1],
      [0, 3],
      [0, 4],
      [1, 3],
      [2, 3],
      [2, 4],
    ],
    componentCount: 1,
    density: 0.6,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ConnectedGraphTestCaseInput,
  ConnectedGraphTestCaseOutput
>;
export const connectedGraphTestCaseTool = createModelDefinition<
  ConnectedGraphTestCaseInput,
  ConnectedGraphTestCaseOutput
>({
  id: "random/connected-graph-test-case",
  title: "Random Connected Graph Test Case Generator",
  description:
    "Generate a connected simple graph by a shuffled recursive tree plus distinct extra edges, and delegate normalization, component count and density evidence; not uniform over all connected graphs and density retains the core's 12-significant-digit convention.",
  inputSchema,
  outputSchema,
  execute: calculateConnectedGraphTestCase,
});
export const runConnectedGraphTestCase = connectedGraphTestCaseTool.execute;
export default connectedGraphTestCaseTool;
