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

export type VertexCoverInstanceInput = {
  readonly nodeCount: number;
  readonly coverSize: number;
  readonly edgeProbability: number;
  readonly seed?: number;
};
export type VertexCoverInstanceOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly cover: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: nodeCountSchema,
    coverSize: { minimum: 0, maximum: 32, type: "integer" },
    edgeProbability: { minimum: 0, maximum: 1, type: "number" },
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "coverSize", "edgeProbability"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: graphEdgesSchema,
    cover: nodeListSchema,
    randomness: generatorReplaySchema,
  },
  required: ["nodes", "edges", "cover", "randomness"],
  type: "object",
} as const;
const isInput = (input: unknown): input is VertexCoverInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateVertexCoverInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<VertexCoverInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.coverSize > input.nodeCount)
      simpleError(
        "coverSize",
        "The planted set must fit within the graph.",
        "infeasible_set_size",
      );
    const random = createGeneratorRandom(input.seed, context);
    const nodes = graphNodes(input.nodeCount);
    const cover = random
      .shuffle(nodes)
      .slice(0, input.coverSize)
      .sort((a, b) => a - b);
    const inSet = new Set(cover);
    const edges = possibleSimpleEdges(input.nodeCount).filter(
      ([a, b]) =>
        (inSet.has(a) || inSet.has(b)) && random.unit() < input.edgeProbability,
    );
    return toolSuccess({
      nodes,
      edges,
      cover,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const vertexCoverInstanceExample = {
  input: {
    nodeCount: 5,
    coverSize: 2,
    edgeProbability: 0.4,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 1],
      [0, 3],
      [3, 4],
    ],
    cover: [0, 4],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<VertexCoverInstanceInput, VertexCoverInstanceOutput>;
export const vertexCoverInstanceTool = createModelDefinition<
  VertexCoverInstanceInput,
  VertexCoverInstanceOutput
>({
  id: "random/vertex-cover-instance",
  title: "Random Vertex Cover Instance Generator",
  description:
    "Generate a simple graph whose Bernoulli-sampled edges are all incident to a planted vertex cover, without claiming that cover is minimum.",
  inputSchema,
  outputSchema,
  execute: calculateVertexCoverInstance,
});
export const runVertexCoverInstance = vertexCoverInstanceTool.execute;
export default vertexCoverInstanceTool;
