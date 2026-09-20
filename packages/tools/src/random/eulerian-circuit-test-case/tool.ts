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
import { runEulerianPath } from "../../graph/eulerian-path/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  edgeCountSchema,
  graphEdgesSchema,
  graphNodes,
  nodeCountSchema,
  nodeListSchema,
  type SimpleEdge,
} from "../graph-instance-construction.js";
export type EulerianCircuitTestCaseInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly seed?: number;
};
export type EulerianCircuitTestCaseOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly randomness: GeneratorReplay;
  readonly circuit: readonly number[];
  readonly degrees: readonly number[];
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: { ...nodeCountSchema, minimum: 1 },
    edgeCount: { ...edgeCountSchema, minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "edgeCount"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: { ...graphEdgesSchema, maxItems: 128 },
    randomness: generatorReplaySchema,
    circuit: {
      items: { minimum: 0, type: "integer" },
      maxItems: 129,
      minItems: 2,
      type: "array",
    },
    degrees: {
      items: { minimum: 0, type: "integer" },
      maxItems: 32,
      minItems: 1,
      type: "array",
    },
  },
  required: ["nodes", "edges", "randomness", "circuit", "degrees"],
  type: "object",
} as const;
const isInput = (input: unknown): input is EulerianCircuitTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateEulerianCircuitTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<EulerianCircuitTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const nodes = graphNodes(input.nodeCount);
    if (input.edgeCount < input.nodeCount)
      simpleError(
        "edgeCount",
        "The closed all-vertex walk needs at least nodeCount edges.",
        "infeasible_edge_count",
      );
    const walk = random.shuffle(nodes);
    for (let i = input.nodeCount; i < input.edgeCount; i += 1)
      walk.push(random.integer(0, input.nodeCount - 1));
    walk.push(walk[0]);
    const edges = walk.slice(1).map((node, i): SimpleEdge => [walk[i], node]);
    const degrees = nodes.map((node) =>
      edges.reduce(
        (sum, [a, b]) => sum + Number(a === node) + Number(b === node),
        0,
      ),
    );
    const answer = runEulerianPath({
      vertexCount: input.nodeCount,
      edges: edges.map((edge) => [...edge]),
    });
    if (!answer.ok || !answer.output.exists)
      throw new Error(
        "The closed-walk construction did not yield an Eulerian circuit.",
      );
    const circuit = answer.output.path;
    return toolSuccess({
      nodes,
      edges,
      randomness: generatorReplay(input.seed, context),
      circuit,
      degrees,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const eulerianCircuitTestCaseExample = {
  input: {
    nodeCount: 5,
    edgeCount: 7,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 4],
      [4, 2],
      [2, 1],
      [1, 3],
      [3, 0],
      [0, 2],
      [2, 0],
    ],
    degrees: [4, 2, 4, 2, 2],
    circuit: [0, 2, 0, 3, 1, 2, 4, 0],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  EulerianCircuitTestCaseInput,
  EulerianCircuitTestCaseOutput
>;
export const eulerianCircuitTestCaseTool = createModelDefinition<
  EulerianCircuitTestCaseInput,
  EulerianCircuitTestCaseOutput
>({
  id: "random/eulerian-circuit-test-case",
  title: "Random Eulerian Circuit Test Case Generator",
  description:
    "Generate a connected undirected multigraph from a closed all-vertex walk, retaining loops and parallel edges, and delegate a verified Eulerian circuit to the existing finder.",
  inputSchema,
  outputSchema,
  execute: calculateEulerianCircuitTestCase,
});
export const runEulerianCircuitTestCase = eulerianCircuitTestCaseTool.execute;
export default eulerianCircuitTestCaseTool;
