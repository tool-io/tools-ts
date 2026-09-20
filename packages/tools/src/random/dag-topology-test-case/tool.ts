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
  graphNodes,
  nodeCountSchema,
  edgeCountSchema,
  graphEdgesSchema,
  nodeListSchema,
  type SimpleEdge,
} from "../graph-instance-construction.js";
import { calculateTopologicalSort } from "../../graph/topological-sort/tool.js";
import { calculateCycleChecker } from "../../graph/cycle-checker/tool.js";

export type DagTopologyTestCaseInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly seed?: number;
};
export type DagTopologyTestCaseOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly plantedOrder: readonly number[];
  readonly topologicalOrder: readonly number[];
  readonly hasCycle: boolean;
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
    plantedOrder: nodeListSchema,
    topologicalOrder: nodeListSchema,
    hasCycle: { type: "boolean", const: false },
    randomness: generatorReplaySchema,
  },
  required: [
    "nodes",
    "edges",
    "plantedOrder",
    "topologicalOrder",
    "hasCycle",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is DagTopologyTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateDagTopologyTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DagTopologyTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.edgeCount > (input.nodeCount * (input.nodeCount - 1)) / 2)
      simpleError(
        "edgeCount",
        "A DAG cannot exceed one forward edge per unordered node pair.",
        "infeasible_edge_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      nodes = graphNodes(input.nodeCount),
      plantedOrder = random.shuffle(nodes),
      possible: SimpleEdge[] = [];
    for (let i = 0; i < plantedOrder.length; i += 1)
      for (let j = i + 1; j < plantedOrder.length; j += 1)
        possible.push([plantedOrder[i], plantedOrder[j]]);
    const edges = random
      .shuffle(possible)
      .slice(0, input.edgeCount)
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const graph: Record<string, string[]> = Object.fromEntries(
      nodes.map((node) => [String(node), []]),
    );
    for (const [from, to] of edges) graph[String(from)].push(String(to));
    const topologicalOrder = calculateTopologicalSort({ graph }).order.map(
        Number,
      ),
      cycle = calculateCycleChecker({ graph });
    if (
      cycle.hasCycle ||
      cycle.resolvedCount !== input.nodeCount ||
      topologicalOrder.length !== input.nodeCount
    )
      throw new Error(
        "Constructed forward-edge graph failed its imported DAG verification.",
      );
    return toolSuccess({
      nodes,
      edges,
      plantedOrder,
      topologicalOrder,
      hasCycle: cycle.hasCycle,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const dagTopologyTestCaseExample = {
  input: {
    nodeCount: 5,
    edgeCount: 5,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 3],
      [0, 4],
      [1, 3],
      [2, 1],
      [4, 3],
    ],
    plantedOrder: [0, 4, 2, 1, 3],
    topologicalOrder: [0, 2, 1, 4, 3],
    hasCycle: false,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<DagTopologyTestCaseInput, DagTopologyTestCaseOutput>;
export const dagTopologyTestCaseTool = createModelDefinition<
  DagTopologyTestCaseInput,
  DagTopologyTestCaseOutput
>({
  id: "random/dag-topology-test-case",
  title: "Random DAG Topology Test Case Generator",
  description:
    "Generate distinct forward edges of a random planted node order, then delegate the actual topological order and cycle check; exact edge count and isolated nodes are retained, and delegated tie-breaking sorts string labels lexicographically.",
  inputSchema,
  outputSchema,
  execute: calculateDagTopologyTestCase,
});
export const runDagTopologyTestCase = dagTopologyTestCaseTool.execute;
export default dagTopologyTestCaseTool;
