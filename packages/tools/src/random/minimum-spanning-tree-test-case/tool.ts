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
import { calculateMinimumSpanningTree } from "../../graph/minimum-spanning-tree/tool.js";
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

export type MinimumSpanningTreeTestCaseInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly minimumWeight: number;
  readonly maximumWeight: number;
  readonly seed?: number;
};
export type MinimumSpanningTreeTestCaseOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly WeightedEdge[];
  readonly componentCount: number;
  readonly randomness: GeneratorReplay;
  readonly treeEdges: readonly string[];
  readonly totalWeight: number;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: nodeCountSchema,
    edgeCount: edgeCountSchema,
    minimumWeight: weightSchema,
    maximumWeight: weightSchema,
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
    treeEdges: { items: { type: "string" }, maxItems: 31, type: "array" },
    totalWeight: { type: "integer" },
  },
  required: [
    "nodes",
    "edges",
    "componentCount",
    "randomness",
    "treeEdges",
    "totalWeight",
  ],
  type: "object",
} as const;
const isInput = (input: unknown): input is MinimumSpanningTreeTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateMinimumSpanningTreeTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MinimumSpanningTreeTestCaseOutput> => {
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
    const answer = calculateMinimumSpanningTree({
      graph: {
        nodes: nodes.map(String),
        edges: edges.map(([a, b, w]) => [String(a), String(b), w]),
      },
    });
    const weights = new Map(
      edges.map(
        ([a, b, weight]) =>
          [[String(a), String(b)].sort().join("|"), weight] as const,
      ),
    );
    let exactTotal = 0n;
    for (const key of answer.treeEdges) {
      const weight = weights.get(key);
      if (weight === undefined)
        throw new Error("The delegated tree contains an unknown edge.");
      exactTotal += BigInt(weight);
    }
    if (
      exactTotal > BigInt(Number.MAX_SAFE_INTEGER) ||
      exactTotal < -BigInt(Number.MAX_SAFE_INTEGER)
    )
      simpleError(
        "maximumWeight",
        "The generated tree's total exceeds the exact safe-integer result range.",
        "unsafe_weight_total",
      );
    return toolSuccess({
      nodes,
      edges,
      componentCount,
      randomness: generatorReplay(input.seed, context),
      treeEdges: answer.treeEdges,
      totalWeight: Number(exactTotal),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const minimumSpanningTreeTestCaseExample = {
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
    treeEdges: ["2|4", "0|3", "0|1", "0|4"],
    totalWeight: 35,
  },
} satisfies ToolExample<
  MinimumSpanningTreeTestCaseInput,
  MinimumSpanningTreeTestCaseOutput
>;
export const minimumSpanningTreeTestCaseTool = createModelDefinition<
  MinimumSpanningTreeTestCaseInput,
  MinimumSpanningTreeTestCaseOutput
>({
  id: "random/minimum-spanning-tree-test-case",
  title: "Random Minimum Spanning Tree Test Case Generator",
  description:
    "Generate a connected signed-integer-weight graph, delegate tree selection to the existing Kruskal calculation, and sum the selected weights exactly instead of inheriting its display rounding.",
  inputSchema,
  outputSchema,
  execute: calculateMinimumSpanningTreeTestCase,
});
export const runMinimumSpanningTreeTestCase =
  minimumSpanningTreeTestCaseTool.execute;
export default minimumSpanningTreeTestCaseTool;
