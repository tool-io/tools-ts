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
  possibleSimpleEdges,
  edgeCountSchema,
  graphEdgesSchema,
  graphNodes,
  nodeCountSchema,
  nodeListSchema,
  type SimpleEdge,
} from "../graph-instance-construction.js";
export type GraphColoringInstanceInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly seed?: number;
  readonly colorCount: number;
};
export type GraphColoringInstanceOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly SimpleEdge[];
  readonly randomness: GeneratorReplay;
  readonly colors: readonly number[];
  readonly colorCount: number;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    nodeCount: nodeCountSchema,
    edgeCount: edgeCountSchema,
    colorCount: { minimum: 1, maximum: 32, type: "integer" },
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "edgeCount", "colorCount"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    nodes: nodeListSchema,
    edges: graphEdgesSchema,
    randomness: generatorReplaySchema,
    colors: nodeListSchema,
    colorCount: { minimum: 1, maximum: 32, type: "integer" },
  },
  required: ["nodes", "edges", "randomness", "colors", "colorCount"],
  type: "object",
} as const;
const isInput = (input: unknown): input is GraphColoringInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateGraphColoringInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GraphColoringInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const nodes = graphNodes(input.nodeCount);
    if (input.colorCount > input.nodeCount)
      simpleError(
        "colorCount",
        "Every requested color must have at least one vertex.",
        "infeasible_color_count",
      );
    const colors = nodes.map(() => 0);
    random.shuffle(nodes).forEach((node, i) => {
      colors[node] = i % input.colorCount;
    });
    const eligible = possibleSimpleEdges(input.nodeCount).filter(
      ([a, b]) => colors[a] !== colors[b],
    );
    if (input.edgeCount > eligible.length)
      simpleError(
        "edgeCount",
        "The requested number of edges exceeds this coloring's eligible pairs.",
        "infeasible_edge_count",
      );
    const edges = canonicalEdges(
      random.shuffle(eligible).slice(0, input.edgeCount),
    );
    return toolSuccess({
      nodes,
      edges,
      randomness: generatorReplay(input.seed, context),
      colors,
      colorCount: input.colorCount,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const graphColoringInstanceExample = {
  input: {
    nodeCount: 5,
    colorCount: 3,
    edgeCount: 6,
    seed: 42,
  },
  output: {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      [0, 2],
      [0, 4],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
    ],
    colors: [0, 0, 2, 1, 1],
    colorCount: 3,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  GraphColoringInstanceInput,
  GraphColoringInstanceOutput
>;
export const graphColoringInstanceTool = createModelDefinition<
  GraphColoringInstanceInput,
  GraphColoringInstanceOutput
>({
  id: "random/graph-coloring-instance",
  title: "Random Graph Coloring Instance Generator",
  description:
    "Generate an exact-size simple graph under a shuffled balanced planted coloring, returning a valid coloring rather than a minimum-chromatic-number claim.",
  inputSchema,
  outputSchema,
  execute: calculateGraphColoringInstance,
});
export const runGraphColoringInstance = graphColoringInstanceTool.execute;
export default graphColoringInstanceTool;
