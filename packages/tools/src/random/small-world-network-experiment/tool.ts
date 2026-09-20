import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import {
  adjacency,
  degrees,
  edgeKey,
  type Edge,
} from "../m500b-charts-math-graphs-graphs.js";
import { calculateDensity } from "../../graph/density/tool.js";
import { calculateBreadthFirstTraversal } from "../../graph/breadth-first-traversal/tool.js";

export type SmallWorldNetworkExperimentInput = {
  readonly nodes: readonly string[];
  readonly ringDegree: number;
  readonly rewireProbability: number;
  readonly seed?: number;
};
export type SmallWorldNetworkExperimentOutput = {
  readonly initialEdges: readonly Edge[];
  readonly edges: readonly Edge[];
  readonly degrees: readonly number[];
  readonly density: number;
  readonly clustering: readonly number[];
  readonly meanClustering: number;
  readonly meanReachableDistance: number | null;
  readonly reachableOrderedPairs: number;
  readonly rewires: readonly {
    readonly source: string;
    readonly oldTarget: string;
    readonly newTarget: string;
    readonly changed: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(label, 16, 3),
    ringDegree: { type: "integer", minimum: 2, maximum: 14 },
    rewireProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  ["nodes", "ringDegree", "rewireProbability"],
);
export const outputSchema = object({
  initialEdges: array(array(label, 2, 2), 120, 3),
  edges: array(array(label, 2, 2), 120, 3),
  degrees: array(integer, 16, 3),
  density: number,
  clustering: array(number, 16, 3),
  meanClustering: number,
  meanReachableDistance: { anyOf: [number, { type: "null" }] },
  reachableOrderedPairs: integer,
  rewires: array(
    object({
      source: label,
      oldTarget: label,
      newTarget: label,
      changed: bool,
    }),
    120,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SmallWorldNetworkExperimentInput =>
  matchesModelInput(value, inputSchema);
export const calculateSmallWorldNetworkExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SmallWorldNetworkExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.nodes, "nodes");
    if (input.ringDegree % 2 !== 0 || input.ringDegree >= input.nodes.length)
      simpleError(
        "ringDegree",
        "Ring degree must be even and smaller than node count.",
        "invalid_ring_degree",
      );
    const initialEdges: Edge[] = [];
    for (let i = 0; i < input.nodes.length; i++)
      for (let offset = 1; offset <= input.ringDegree / 2; offset++)
        initialEdges.push([
          input.nodes[i],
          input.nodes[(i + offset) % input.nodes.length],
        ]);
    let edges = [...initialEdges];
    const rewires: {
      source: string;
      oldTarget: string;
      newTarget: string;
      changed: boolean;
    }[] = [];
    for (const [source, oldTarget] of initialEdges) {
      if (random.unit() >= input.rewireProbability) continue;
      const candidates = input.nodes.filter(
        (n) =>
          n !== source &&
          !edges.some(([a, b]) => edgeKey(a, b) === edgeKey(source, n)),
      );
      if (!candidates.length) {
        rewires.push({
          source,
          oldTarget,
          newTarget: oldTarget,
          changed: false,
        });
        continue;
      }
      const newTarget = random.pick(candidates);
      edges = edges.map((e) =>
        edgeKey(e[0], e[1]) === edgeKey(source, oldTarget)
          ? ([source, newTarget] as const)
          : e,
      );
      rewires.push({ source, oldTarget, newTarget, changed: true });
    }
    const graph = adjacency(input.nodes, edges),
      clustering = input.nodes.map((n) => {
        const neighbors = graph[n];
        if (neighbors.length < 2) return 0;
        let links = 0;
        for (let i = 0; i < neighbors.length; i++)
          for (let j = i + 1; j < neighbors.length; j++)
            if (
              edges.some(
                ([a, b]) =>
                  edgeKey(a, b) === edgeKey(neighbors[i], neighbors[j]),
              )
            )
              links++;
        return (2 * links) / (neighbors.length * (neighbors.length - 1));
      });
    let distanceTotal = 0,
      reachableOrderedPairs = 0;
    for (const start of input.nodes) {
      const bfs = calculateBreadthFirstTraversal({ graph, start });
      for (const [n, d] of Object.entries(bfs.depths))
        if (n !== start) {
          distanceTotal += d;
          reachableOrderedPairs++;
        }
    }
    const result = {
      initialEdges,
      edges,
      degrees: degrees(input.nodes, edges),
      density: calculateDensity({ graph }).density,
      clustering,
      meanClustering: sum(clustering) / input.nodes.length,
      meanReachableDistance: reachableOrderedPairs
        ? distanceTotal / reachableOrderedPairs
        : null,
      reachableOrderedPairs,
      rewires,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const smallWorldNetworkExperimentExample = {
  input: {
    nodes: ["a", "b", "c", "d"],
    ringDegree: 2,
    rewireProbability: 0,
    seed: 42,
  },
  output: {
    initialEdges: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "a"],
    ],
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "a"],
    ],
    degrees: [2, 2, 2, 2],
    density: 0.666666666667,
    clustering: [0, 0, 0, 0],
    meanClustering: 0,
    meanReachableDistance: 1.3333333333333333,
    reachableOrderedPairs: 12,
    rewires: [],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SmallWorldNetworkExperimentInput,
  SmallWorldNetworkExperimentOutput
>;
export const smallWorldNetworkExperimentTool = createModelDefinition<
  SmallWorldNetworkExperimentInput,
  SmallWorldNetworkExperimentOutput
>({
  id: "random/small-world-network-experiment",
  title: "Random Small World Network Experiment Generator",
  description:
    "Generate bounded Watts–Strogatz-style ring rewiring experiments with retained changes and topology metrics; density inherits 12-significant-digit core rounding and connectivity is not guaranteed.",
  inputSchema,
  outputSchema,
  execute: calculateSmallWorldNetworkExperiment,
});
export const runSmallWorldNetworkExperiment =
  smallWorldNetworkExperimentTool.execute;
export default smallWorldNetworkExperimentTool;
