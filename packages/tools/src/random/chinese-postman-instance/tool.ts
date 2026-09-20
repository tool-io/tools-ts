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

export type ChinesePostmanInstanceInput = {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly minimumWeight: number;
  readonly maximumWeight: number;
  readonly seed?: number;
};
export type ChinesePostmanInstanceOutput = {
  readonly nodes: readonly number[];
  readonly edges: readonly WeightedEdge[];
  readonly componentCount: number;
  readonly randomness: GeneratorReplay;
  readonly depot: number;
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
    depot: { minimum: 0, maximum: 31, type: "integer" },
  },
  required: ["nodes", "edges", "componentCount", "randomness", "depot"],
  type: "object",
} as const;
const isInput = (input: unknown): input is ChinesePostmanInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateChinesePostmanInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ChinesePostmanInstanceOutput> => {
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
    const depot = random.integer(0, input.nodeCount - 1);
    return toolSuccess({
      nodes,
      edges,
      componentCount,
      randomness: generatorReplay(input.seed, context),
      depot,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const chinesePostmanInstanceExample = {
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
    depot: 2,
  },
} satisfies ToolExample<
  ChinesePostmanInstanceInput,
  ChinesePostmanInstanceOutput
>;
export const chinesePostmanInstanceTool = createModelDefinition<
  ChinesePostmanInstanceInput,
  ChinesePostmanInstanceOutput
>({
  id: "random/chinese-postman-instance",
  title: "Random Chinese Postman Instance Generator",
  description:
    "Generate a connected undirected nonnegative-integer-weight graph and depot for a Chinese postman optimization problem, without claiming an optimal route.",
  inputSchema,
  outputSchema,
  execute: calculateChinesePostmanInstance,
});
export const runChinesePostmanInstance = chinesePostmanInstanceTool.execute;
export default chinesePostmanInstanceTool;
