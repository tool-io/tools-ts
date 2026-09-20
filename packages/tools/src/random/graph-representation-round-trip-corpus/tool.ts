import type { ToolExecutionContext } from "../../core/definition.js";
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
import { calculateNormalizeEdgeList } from "../../graph/normalize-edge-list/tool.js";
import { calculateAdjacencyListToMatrix } from "../../graph/adjacency-list-to-matrix/tool.js";
import { calculateAdjacencyMatrixToList } from "../../graph/adjacency-matrix-to-list/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  labelSchema,
  probabilitySchema,
  integerSchema,
} from "../m250-algorithms-common.js";
import {
  algorithmNodeNames,
  algorithmNodesSchema,
  algorithmAdjacencySchema,
} from "../m250-algorithms-graphs.js";

export type GraphRepresentationRoundTripCorpusInput = {
  readonly count: number;
  readonly nodeCount: number;
  readonly directed: boolean;
  readonly allowSelfLoops: boolean;
  readonly edgeProbability: number;
  readonly duplicateProbability: number;
  readonly seed?: number;
};
export type GraphRepresentationRoundTripCorpusOutput = {
  readonly cases: readonly {
    readonly directed: boolean;
    readonly nodes: readonly string[];
    readonly rawAdjacency: Readonly<Record<string, readonly string[]>>;
    readonly normalizedEdges: readonly (readonly [string, string])[];
    readonly matrix: readonly (readonly number[])[];
    readonly reconstructedAdjacency: Readonly<
      Record<string, readonly string[]>
    >;
    readonly reconstructedEdges: readonly (readonly [string, string])[];
    readonly semanticallyEquivalent: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const edgesSchema = arraySchema(arraySchema(labelSchema, 2, 2), 144),
  matrixSchema = arraySchema(arraySchema(integerSchema(0, 1), 12, 1), 12, 1);
export const inputSchema = objectSchema(
  {
    count: integerSchema(1, 16),
    nodeCount: integerSchema(1, 12),
    directed: { type: "boolean" },
    allowSelfLoops: { type: "boolean" },
    edgeProbability: probabilitySchema,
    duplicateProbability: probabilitySchema,
    seed: generatorSeedSchema,
  },
  [
    "count",
    "nodeCount",
    "directed",
    "allowSelfLoops",
    "edgeProbability",
    "duplicateProbability",
  ],
);
export const outputSchema = objectSchema({
  cases: arraySchema(
    objectSchema({
      directed: { type: "boolean" },
      nodes: algorithmNodesSchema,
      rawAdjacency: algorithmAdjacencySchema,
      normalizedEdges: edgesSchema,
      matrix: matrixSchema,
      reconstructedAdjacency: algorithmAdjacencySchema,
      reconstructedEdges: edgesSchema,
      semanticallyEquivalent: { type: "boolean" },
    }),
    16,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is GraphRepresentationRoundTripCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateGraphRepresentationRoundTripCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GraphRepresentationRoundTripCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      nodes = algorithmNodeNames(input.nodeCount);
    const cases = Array.from({ length: input.count }, () => {
      const rawAdjacency: Record<string, string[]> = Object.fromEntries(
        nodes.map((node) => [node, []]),
      );
      for (let a = 0; a < nodes.length; a += 1)
        for (let b = input.directed ? 0 : a; b < nodes.length; b += 1) {
          if (!input.allowSelfLoops && a === b) continue;
          if (random.unit() < input.edgeProbability) {
            rawAdjacency[nodes[a]].push(nodes[b]);
            if (random.unit() < input.duplicateProbability)
              rawAdjacency[nodes[a]].push(nodes[b]);
          }
        }
      const normalized = calculateNormalizeEdgeList({
        graph: rawAdjacency,
        directed: input.directed,
      }).table;
      const converted = calculateAdjacencyListToMatrix({
        graph: rawAdjacency,
        directed: input.directed,
      }).table;
      const reconstructedAdjacency = calculateAdjacencyMatrixToList({
        matrix: converted.matrix,
        nodes: converted.nodes,
      }).table;
      const reconstructed = calculateNormalizeEdgeList({
        graph: reconstructedAdjacency,
        directed: input.directed,
      }).table;
      const semanticallyEquivalent =
        JSON.stringify(normalized.nodes) ===
          JSON.stringify(reconstructed.nodes) &&
        JSON.stringify(normalized.edges) ===
          JSON.stringify(reconstructed.edges);
      if (!semanticallyEquivalent)
        throw new Error("Delegated graph round trip changed semantic edges.");
      return {
        directed: input.directed,
        nodes: converted.nodes,
        rawAdjacency,
        normalizedEdges: normalized.edges,
        matrix: converted.matrix,
        reconstructedAdjacency,
        reconstructedEdges: reconstructed.edges,
        semanticallyEquivalent,
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const graphRepresentationRoundTripCorpusExample = {
  input: {
    count: 1,
    nodeCount: 3,
    directed: false,
    allowSelfLoops: false,
    edgeProbability: 0.7,
    duplicateProbability: 0.5,
    seed: 42,
  },
  output: {
    cases: [
      {
        directed: false,
        nodes: ["n00", "n01", "n02"],
        rawAdjacency: { n00: ["n01", "n01"], n01: ["n02", "n02"], n02: [] },
        normalizedEdges: [
          ["n00", "n01"],
          ["n01", "n02"],
        ],
        matrix: [
          [0, 1, 0],
          [1, 0, 1],
          [0, 1, 0],
        ],
        reconstructedAdjacency: {
          n00: ["n01"],
          n01: ["n00", "n02"],
          n02: ["n01"],
        },
        reconstructedEdges: [
          ["n00", "n01"],
          ["n01", "n02"],
        ],
        semanticallyEquivalent: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GraphRepresentationRoundTripCorpusInput,
  GraphRepresentationRoundTripCorpusOutput
>;
export const graphRepresentationRoundTripCorpusTool = createModelDefinition<
  GraphRepresentationRoundTripCorpusInput,
  GraphRepresentationRoundTripCorpusOutput
>({
  id: "random/graph-representation-round-trip-corpus",
  title: "Random Graph Representation Round-Trip Corpus Generator",
  description:
    "Generate graphs with optional duplicate listings and delegate edge normalization and matrix round trips, comparing semantic edges independently of listing order.",
  inputSchema,
  outputSchema,
  execute: calculateGraphRepresentationRoundTripCorpus,
});
export const runGraphRepresentationRoundTripCorpus =
  graphRepresentationRoundTripCorpusTool.execute;
export default graphRepresentationRoundTripCorpusTool;
