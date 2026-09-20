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
  validateGraph,
  adjacency,
  edgeKey,
  type Edge,
} from "../m500b-charts-math-graphs-graphs.js";
import { calculateBreadthFirstTraversal } from "../../graph/breadth-first-traversal/tool.js";

export type GraphReachabilityMutationCorpusInput = {
  readonly nodes: readonly string[];
  readonly edges: readonly Edge[];
  readonly start: string;
  readonly operation: "insert" | "delete";
  readonly count: number;
  readonly seed?: number;
};
export type GraphReachabilityMutationCorpusOutput = {
  readonly initialEdges: readonly Edge[];
  readonly finalEdges: readonly Edge[];
  readonly steps: readonly {
    readonly edge: Edge;
    readonly before: readonly string[];
    readonly after: readonly string[];
    readonly gained: readonly string[];
    readonly lost: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(label, 16, 2),
    edges: array(array(label, 2, 2), 64),
    start: label,
    operation: { type: "string", enum: ["insert", "delete"] },
    count: { type: "integer", minimum: 1, maximum: 8 },
    seed: generatorSeedSchema,
  },
  ["nodes", "edges", "start", "operation", "count"],
);
export const outputSchema = object({
  initialEdges: array(array(label, 2, 2), 64),
  finalEdges: array(array(label, 2, 2), 72),
  steps: array(
    object({
      edge: array(label, 2, 2),
      before: array(label, 16, 1),
      after: array(label, 16, 1),
      gained: array(label, 16),
      lost: array(label, 16),
    }),
    8,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is GraphReachabilityMutationCorpusInput =>
  matchesModelInput(value, inputSchema);
export const calculateGraphReachabilityMutationCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GraphReachabilityMutationCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    validateGraph(input.nodes, input.edges, true);
    if (!input.nodes.includes(input.start))
      simpleError("start", "Start must be a supplied node.", "unknown_start");
    const available =
      input.operation === "delete"
        ? input.edges.length
        : input.nodes.length * (input.nodes.length - 1) - input.edges.length;
    if (input.count > available)
      simpleError(
        "count",
        "The requested distinct edge changes are unavailable.",
        "infeasible_mutations",
      );
    let edges: Edge[] = input.edges.map((e) => [e[0], e[1]]);
    const reachable = () =>
      calculateBreadthFirstTraversal({
        graph: adjacency(input.nodes, edges, true),
        start: input.start,
      }).visitOrder;
    const steps = Array.from({ length: input.count }, () => {
      const before = reachable(),
        candidates: Edge[] =
          input.operation === "delete"
            ? [...edges]
            : input.nodes.flatMap((a) =>
                input.nodes
                  .filter(
                    (b) =>
                      b !== a &&
                      !edges.some(
                        ([s, t]) => edgeKey(s, t, true) === edgeKey(a, b, true),
                      ),
                  )
                  .map((b) => [a, b] as const),
              ),
        edge = random.pick(candidates);
      edges =
        input.operation === "delete"
          ? edges.filter(
              (e) =>
                edgeKey(e[0], e[1], true) !== edgeKey(edge[0], edge[1], true),
            )
          : [...edges, edge];
      const after = reachable();
      return {
        edge,
        before,
        after,
        gained: after.filter((n) => !before.includes(n)),
        lost: before.filter((n) => !after.includes(n)),
      };
    });
    const result = {
      initialEdges: input.edges.map((e) => [e[0], e[1]] as const),
      finalEdges: edges,
      steps,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const graphReachabilityMutationCorpusExample = {
  input: {
    nodes: ["a", "b", "c"],
    edges: [
      ["a", "b"],
      ["b", "c"],
    ],
    start: "a",
    operation: "delete",
    count: 1,
    seed: 42,
  },
  output: {
    initialEdges: [
      ["a", "b"],
      ["b", "c"],
    ],
    finalEdges: [["a", "b"]],
    steps: [
      {
        edge: ["b", "c"],
        before: ["a", "b", "c"],
        after: ["a", "b"],
        gained: [],
        lost: ["c"],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GraphReachabilityMutationCorpusInput,
  GraphReachabilityMutationCorpusOutput
>;
export const graphReachabilityMutationCorpusTool = createModelDefinition<
  GraphReachabilityMutationCorpusInput,
  GraphReachabilityMutationCorpusOutput
>({
  id: "random/graph-reachability-mutation-corpus",
  title: "Random Graph Reachability Mutation Corpus Generator",
  description:
    "Apply controlled insertions or deletions to a supplied simple directed graph and retain exact reachable sets before and after every mutation.",
  inputSchema,
  outputSchema,
  execute: calculateGraphReachabilityMutationCorpus,
});
export const runGraphReachabilityMutationCorpus =
  graphReachabilityMutationCorpusTool.execute;
export default graphReachabilityMutationCorpusTool;
