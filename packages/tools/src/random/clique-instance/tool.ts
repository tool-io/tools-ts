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

export type CliqueInstanceInput = {
  readonly nodeCount: number;
  readonly cliqueSize: number;
  readonly edgeProbability: number;
  readonly seed?: number;
};
export type CliqueInstanceOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly clique: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: nodeCountSchema,
    cliqueSize: { minimum: 2, maximum: 32, type: "integer" },
    edgeProbability: { minimum: 0, maximum: 1, type: "number" },
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "cliqueSize", "edgeProbability"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: graphEdgesSchema,
    clique: nodeListSchema,
    randomness: generatorReplaySchema,
  },
  required: ["nodes", "edges", "clique", "randomness"],
  type: "object",
} as const;
const isInput = (input: unknown): input is CliqueInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateCliqueInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CliqueInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.cliqueSize > input.nodeCount)
      simpleError(
        "cliqueSize",
        "The planted set must fit within the graph.",
        "infeasible_set_size",
      );
    const random = createGeneratorRandom(input.seed, context);
    const nodes = graphNodes(input.nodeCount);
    const clique = random
      .shuffle(nodes)
      .slice(0, input.cliqueSize)
      .sort((a, b) => a - b);
    const inSet = new Set(clique);
    const edges = possibleSimpleEdges(input.nodeCount).filter(
      ([a, b]) =>
        (inSet.has(a) && inSet.has(b)) || random.unit() < input.edgeProbability,
    );
    return toolSuccess({
      nodes,
      edges,
      clique,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cliqueInstanceExample = {
  input: {
    nodeCount: 5,
    cliqueSize: 3,
    edgeProbability: 0.4,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 1],
      [0, 2],
      [0, 4],
      [1, 2],
      [2, 4],
      [3, 4],
    ],
    clique: [0, 2, 4],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CliqueInstanceInput, CliqueInstanceOutput>;
export const cliqueInstanceTool = createModelDefinition<
  CliqueInstanceInput,
  CliqueInstanceOutput
>({
  id: "random/clique-instance",
  title: "Random Clique Instance Generator",
  description:
    "Generate a simple graph with a planted clique and independent Bernoulli background edges; the witness is not claimed to be maximum.",
  inputSchema,
  outputSchema,
  execute: calculateCliqueInstance,
});
export const runCliqueInstance = cliqueInstanceTool.execute;
export default cliqueInstanceTool;
