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
import { adjacency } from "../m500b-charts-math-graphs-graphs.js";
import { calculateTopologicalSort } from "../../graph/topological-sort/tool.js";

export type DagLongestPathExerciseInput = {
  readonly nodes: readonly string[];
  readonly extraEdgeProbability: number;
  readonly minimumWeight: number;
  readonly maximumWeight: number;
  readonly seed?: number;
};
export type DagLongestPathExerciseOutput = {
  readonly edges: readonly {
    readonly source: string;
    readonly target: string;
    readonly weight: number;
  }[];
  readonly order: readonly string[];
  readonly distances: readonly number[];
  readonly path: readonly string[];
  readonly relaxations: readonly {
    readonly source: string;
    readonly target: string;
    readonly previous: number | null;
    readonly candidate: number;
    readonly accepted: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(label, 16, 2),
    extraEdgeProbability: { type: "number", minimum: 0, maximum: 1 },
    minimumWeight: integer,
    maximumWeight: integer,
    seed: generatorSeedSchema,
  },
  ["nodes", "extraEdgeProbability", "minimumWeight", "maximumWeight"],
);
export const outputSchema = object({
  edges: array(
    object({ source: label, target: label, weight: integer }),
    120,
    1,
  ),
  order: array(label, 16, 2),
  distances: array(integer, 16, 2),
  path: array(label, 16, 2),
  relaxations: array(
    object({
      source: label,
      target: label,
      previous: { anyOf: [integer, { type: "null" }] },
      candidate: integer,
      accepted: bool,
    }),
    120,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is DagLongestPathExerciseInput =>
  matchesModelInput(value, inputSchema);
export const calculateDagLongestPathExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DagLongestPathExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.nodes, "nodes");
    if (
      input.minimumWeight > input.maximumWeight ||
      !Number.isSafeInteger(input.maximumWeight - input.minimumWeight + 1)
    )
      simpleError(
        "maximumWeight",
        "Weight range must be ordered and safe.",
        "invalid_range",
      );
    const edges: { source: string; target: string; weight: number }[] = [];
    for (let gap = 1; gap < input.nodes.length; gap++)
      for (let i = 0; i + gap < input.nodes.length; i++)
        if (gap === 1 || random.unit() < input.extraEdgeProbability)
          edges.push({
            source: input.nodes[i],
            target: input.nodes[i + gap],
            weight: random.integer(input.minimumWeight, input.maximumWeight),
          });
    const order = calculateTopologicalSort({
        graph: adjacency(
          input.nodes,
          edges.map((e) => [e.source, e.target] as const),
          true,
        ),
      }).order,
      dist = new Map<string, number>([[input.nodes[0], 0]]),
      paths = new Map<string, string[]>([[input.nodes[0], [input.nodes[0]]]]),
      relaxations: {
        source: string;
        target: string;
        previous: number | null;
        candidate: number;
        accepted: boolean;
      }[] = [];
    for (const source of order) {
      const from = dist.get(source);
      if (from === undefined)
        throw new Error("Forward chain lost reachability");
      for (const e of edges.filter((e) => e.source === source)) {
        const previous = dist.get(e.target) ?? null,
          candidate = safe(from + e.weight, "maximumWeight"),
          accepted = previous === null || candidate > previous;
        relaxations.push({
          source,
          target: e.target,
          previous,
          candidate,
          accepted,
        });
        if (accepted) {
          dist.set(e.target, candidate);
          paths.set(e.target, [...(paths.get(source) ?? []), e.target]);
        }
      }
    }
    const distances = input.nodes.map((n) => {
        const d = dist.get(n);
        if (d === undefined) throw new Error("Missing DAG distance");
        return d;
      }),
      path = paths.get(input.nodes[input.nodes.length - 1]);
    if (path === undefined) throw new Error("Missing DAG path");
    const result = { edges, order, distances, path, relaxations };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const dagLongestPathExerciseExample = {
  input: {
    nodes: ["a", "b", "c"],
    extraEdgeProbability: 0,
    minimumWeight: 1,
    maximumWeight: 3,
    seed: 42,
  },
  output: {
    edges: [
      { source: "a", target: "b", weight: 2 },
      { source: "b", target: "c", weight: 2 },
    ],
    order: ["a", "b", "c"],
    distances: [0, 2, 4],
    path: ["a", "b", "c"],
    relaxations: [
      {
        source: "a",
        target: "b",
        previous: null,
        candidate: 2,
        accepted: true,
      },
      {
        source: "b",
        target: "c",
        previous: null,
        candidate: 4,
        accepted: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DagLongestPathExerciseInput,
  DagLongestPathExerciseOutput
>;
export const dagLongestPathExerciseTool = createModelDefinition<
  DagLongestPathExerciseInput,
  DagLongestPathExerciseOutput
>({
  id: "random/dag-longest-path-exercise",
  title: "Random Dag Longest Path Exercise Generator",
  description:
    "Generate bounded weighted DAGs with a guaranteed forward chain, retained topological order and independently replayable longest-path relaxations.",
  inputSchema,
  outputSchema,
  execute: calculateDagLongestPathExercise,
});
export const runDagLongestPathExercise = dagLongestPathExerciseTool.execute;
export default dagLongestPathExerciseTool;
