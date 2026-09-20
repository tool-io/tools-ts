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

import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  canonicalEdges,
  extendSimpleEdges,
  edgeCountSchema,
  graphEdgesSchema,
  graphNodes,
  nodeCountSchema,
  nodeListSchema,
  type SimpleEdge,
} from "../graph-instance-construction.js";
export type HamiltonianCycleInstanceInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly seed?: number;
};
export type HamiltonianCycleInstanceOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly randomness: GeneratorReplay;
  readonly cycle: readonly number[];
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: { ...nodeCountSchema, minimum: 3 },
    edgeCount: edgeCountSchema,
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "edgeCount"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: graphEdgesSchema,
    randomness: generatorReplaySchema,
    cycle: {
      items: { minimum: 0, type: "integer" },
      maxItems: 33,
      minItems: 4,
      type: "array",
    },
  },
  required: ["nodes", "edges", "randomness", "cycle"],
  type: "object",
} as const;
const isInput = (input: unknown): input is HamiltonianCycleInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateHamiltonianCycleInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HamiltonianCycleInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const nodes = graphNodes(input.nodeCount);
    const order = random.shuffle(nodes);
    const cycle = [...order, order[0]];
    const planted = order.map((node, i): SimpleEdge => [
      node,
      order[(i + 1) % order.length],
    ]);
    const edges = extendSimpleEdges(
      input.nodeCount,
      input.edgeCount,
      planted,
      random,
    );
    return toolSuccess({
      nodes,
      edges,
      randomness: generatorReplay(input.seed, context),
      cycle,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const hamiltonianCycleInstanceExample = {
  input: {
    nodeCount: 5,
    edgeCount: 7,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 3],
      [2, 3],
      [2, 4],
    ],
    cycle: [0, 4, 2, 1, 3, 0],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  HamiltonianCycleInstanceInput,
  HamiltonianCycleInstanceOutput
>;
export const hamiltonianCycleInstanceTool = createModelDefinition<
  HamiltonianCycleInstanceInput,
  HamiltonianCycleInstanceOutput
>({
  id: "random/hamiltonian-cycle-instance",
  title: "Random Hamiltonian Cycle Instance Generator",
  description:
    "Generate a simple graph containing a shuffled all-vertex cycle and an exact number of extra edges, with a Hamiltonian witness but no uniqueness claim.",
  inputSchema,
  outputSchema,
  execute: calculateHamiltonianCycleInstance,
});
export const runHamiltonianCycleInstance = hamiltonianCycleInstanceTool.execute;
export default hamiltonianCycleInstanceTool;
