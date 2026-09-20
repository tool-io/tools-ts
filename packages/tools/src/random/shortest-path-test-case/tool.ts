import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  matchesModelInput,
  createModelDefinition,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateDijkstraShortestPath } from "../../graph/dijkstra-shortest-path/tool.js";
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
  edgeCountSchema,
  graphNodes,
  nodeCountSchema,
  nodeListSchema,
  verifiedComponentCount,
  weightedEdgesSchema,
  weightSchema,
  type WeightedEdge,
} from "../graph-instance-construction.js";

export type ShortestPathTestCaseInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly minimumWeight: number;
  readonly maximumWeight: number;
  readonly seed?: number;
};
export type ShortestPathTestCaseOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly WeightedEdge[];
  readonly componentCount: number;
  readonly randomness: GeneratorReplay;
  readonly start: number;
  readonly end: number;
  readonly path: readonly number[];
  readonly totalCost: number;
  readonly distances: readonly number[];
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: nodeCountSchema,
    edgeCount: edgeCountSchema,
    minimumWeight: { ...weightSchema, minimum: 0 },
    maximumWeight: { ...weightSchema, minimum: 0 },
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "edgeCount", "minimumWeight", "maximumWeight"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: weightedEdgesSchema,
    componentCount: { const: 1, type: "integer" },
    randomness: generatorReplaySchema,
    start: { minimum: 0, maximum: 31, type: "integer" },
    end: { minimum: 0, maximum: 31, type: "integer" },
    path: nodeListSchema,
    totalCost: { minimum: 0, type: "integer" },
    distances: {
      items: { minimum: 0, type: "integer" },
      maxItems: 32,
      type: "array",
    },
  },
  required: [
    "nodes",
    "edges",
    "componentCount",
    "randomness",
    "start",
    "end",
    "path",
    "totalCost",
    "distances",
  ],
  type: "object",
} as const;
const isInput = (input: unknown): input is ShortestPathTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateShortestPathTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ShortestPathTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      input.maximumWeight < input.minimumWeight ||
      !Number.isSafeInteger(input.maximumWeight - input.minimumWeight + 1)
    )
      simpleError(
        "maximumWeight",
        "Weights must be ordered and their inclusive sampling range must have a safe-integer width.",
        "invalid_weight_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const pairs = connectedSimpleEdges(
      input.nodeCount,
      input.edgeCount,
      random,
    );
    const nodes = graphNodes(input.nodeCount);
    const edges = pairs.map(([a, b]): WeightedEdge => [
      a,
      b,
      random.integer(input.minimumWeight, input.maximumWeight),
    ]);
    const componentCount = verifiedComponentCount(input.nodeCount, pairs);
    if (componentCount !== 1) throw new Error("Connected construction failed.");
    const start = random.integer(0, input.nodeCount - 1);
    const rawEnd = random.integer(0, input.nodeCount - 2);
    const end = rawEnd >= start ? rawEnd + 1 : rawEnd;
    const answer = calculateDijkstraShortestPath({
      nodeCount: input.nodeCount,
      edges: edges.flatMap(([a, b, w]) => [
        [a, b, w],
        [b, a, w],
      ]),
      start,
      end,
    });
    if (
      !answer.distances.every(Number.isSafeInteger) ||
      !Number.isSafeInteger(answer.totalCost)
    )
      simpleError(
        "maximumWeight",
        "A generated shortest-path distance exceeds the exact safe-integer result range.",
        "unsafe_distance_total",
      );
    return toolSuccess({
      nodes,
      edges,
      componentCount,
      randomness: generatorReplay(input.seed, context),
      start,
      end,
      path: answer.path,
      distances: answer.distances,
      totalCost: answer.totalCost,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const shortestPathTestCaseExample = {
  input: {
    nodeCount: 5,
    edgeCount: 6,
    minimumWeight: 2,
    maximumWeight: 30,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 1, 10],
      [0, 3, 7],
      [0, 4, 16],
      [1, 3, 21],
      [2, 3, 19],
      [2, 4, 2],
    ],
    componentCount: 1,
    randomness: {
      seed: 42,
      source: "seed",
    },
    start: 2,
    end: 4,
    path: [2, 4],
    totalCost: 2,
    distances: [18, 28, 0, 19, 2],
  },
} satisfies ToolExample<ShortestPathTestCaseInput, ShortestPathTestCaseOutput>;
export const shortestPathTestCaseTool = createModelDefinition<
  ShortestPathTestCaseInput,
  ShortestPathTestCaseOutput
>({
  id: "random/shortest-path-test-case",
  title: "Random Shortest Path Test Case Generator",
  description:
    "Generate a connected undirected nonnegative-integer-weight graph and distinct random endpoints, delegate both directions to Dijkstra, and require exact safe-integer distance outputs.",
  inputSchema,
  outputSchema,
  execute: calculateShortestPathTestCase,
});
export const runShortestPathTestCase = shortestPathTestCaseTool.execute;
export default shortestPathTestCaseTool;
