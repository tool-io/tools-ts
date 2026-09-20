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
  graphEdgesSchema,
  graphNodes,
  nodeCountSchema,
  nodeListSchema,
  possibleSimpleEdges,
  type SimpleEdge,
} from "../graph-instance-construction.js";

export type IndependentSetInstanceInput = {
  readonly nodeCount: number;
  readonly independentSetSize: number;
  readonly edgeProbability: number;
  readonly seed?: number;
};
export type IndependentSetInstanceOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly independentSet: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: nodeCountSchema,
    independentSetSize: { minimum: 0, maximum: 32, type: "integer" },
    edgeProbability: { minimum: 0, maximum: 1, type: "number" },
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "independentSetSize", "edgeProbability"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: graphEdgesSchema,
    independentSet: nodeListSchema,
    randomness: generatorReplaySchema,
  },
  required: ["nodes", "edges", "independentSet", "randomness"],
  type: "object",
} as const;
const isInput = (input: unknown): input is IndependentSetInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateIndependentSetInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<IndependentSetInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.independentSetSize > input.nodeCount)
      simpleError(
        "independentSetSize",
        "The planted set must fit within the graph.",
        "infeasible_set_size",
      );
    const random = createGeneratorRandom(input.seed, context);
    const nodes = graphNodes(input.nodeCount);
    const independentSet = random
      .shuffle(nodes)
      .slice(0, input.independentSetSize)
      .sort((a, b) => a - b);
    const inSet = new Set(independentSet);
    const edges = possibleSimpleEdges(input.nodeCount).filter(
      ([a, b]) =>
        !(inSet.has(a) && inSet.has(b)) &&
        random.unit() < input.edgeProbability,
    );
    return toolSuccess({
      nodes,
      edges,
      independentSet,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const independentSetInstanceExample = {
  input: {
    nodeCount: 5,
    independentSetSize: 3,
    edgeProbability: 0.4,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 1],
      [1, 2],
      [3, 4],
    ],
    independentSet: [0, 2, 4],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  IndependentSetInstanceInput,
  IndependentSetInstanceOutput
>;
export const independentSetInstanceTool = createModelDefinition<
  IndependentSetInstanceInput,
  IndependentSetInstanceOutput
>({
  id: "random/independent-set-instance",
  title: "Random Independent Set Instance Generator",
  description:
    "Generate a simple graph with a planted independent set and Bernoulli edges outside that set; no maximum-cardinality claim is made.",
  inputSchema,
  outputSchema,
  execute: calculateIndependentSetInstance,
});
export const runIndependentSetInstance = independentSetInstanceTool.execute;
export default independentSetInstanceTool;
