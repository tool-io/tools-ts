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
  edgeKey,
  degrees,
  type Edge,
} from "../m500b-charts-math-graphs-graphs.js";

export type DegreePreservingGraphRewireInput = {
  readonly nodes: readonly string[];
  readonly edges: readonly Edge[];
  readonly attemptCount: number;
  readonly seed?: number;
};
export type DegreePreservingGraphRewireOutput = {
  readonly edges: readonly Edge[];
  readonly initialDegrees: readonly number[];
  readonly finalDegrees: readonly number[];
  readonly acceptedCount: number;
  readonly attempts: readonly {
    readonly selected: readonly Edge[];
    readonly proposed: readonly Edge[];
    readonly accepted: boolean;
    readonly reason: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(label, 32, 4),
    edges: array(array(label, 2, 2), 128, 2),
    attemptCount: { type: "integer", minimum: 1, maximum: 32 },
    seed: generatorSeedSchema,
  },
  ["nodes", "edges", "attemptCount"],
);
export const outputSchema = object({
  edges: array(array(label, 2, 2), 128, 2),
  initialDegrees: array(integer, 32, 4),
  finalDegrees: array(integer, 32, 4),
  acceptedCount: integer,
  attempts: array(
    object({
      selected: array(array(label, 2, 2), 2, 2),
      proposed: array(array(label, 2, 2), 2),
      accepted: bool,
      reason: { type: "string" },
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is DegreePreservingGraphRewireInput =>
  matchesModelInput(value, inputSchema);
export const calculateDegreePreservingGraphRewire = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DegreePreservingGraphRewireOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    validateGraph(input.nodes, input.edges);
    const canonical = (a: string, b: string): Edge => (a < b ? [a, b] : [b, a]);
    let edges: Edge[] = input.edges.map((e) => canonical(e[0], e[1]));
    const initialDegrees = degrees(input.nodes, edges);
    let acceptedCount = 0;
    const attempts = Array.from({ length: input.attemptCount }, () => {
      const i = random.integer(0, edges.length - 1),
        raw = random.integer(0, edges.length - 2),
        j = raw >= i ? raw + 1 : raw,
        first = edges[i],
        second =
          random.unit() < 0.5
            ? ([edges[j][1], edges[j][0]] as const)
            : edges[j],
        selected = [first, second];
      if (new Set([...first, ...second]).size !== 4)
        return {
          selected,
          proposed: [],
          accepted: false,
          reason: "shared_endpoint",
        };
      const proposed = [
          canonical(first[0], second[1]),
          canonical(first[1], second[0]),
        ],
        remaining = edges.filter((_, k) => k !== i && k !== j),
        collision = proposed.some((e) =>
          remaining.some((x) => edgeKey(x[0], x[1]) === edgeKey(e[0], e[1])),
        );
      if (collision)
        return { selected, proposed, accepted: false, reason: "parallel_edge" };
      edges = edges.map((e, k) =>
        k === i ? proposed[0] : k === j ? proposed[1] : e,
      );
      acceptedCount++;
      return { selected, proposed, accepted: true, reason: "accepted" };
    });
    const finalDegrees = degrees(input.nodes, edges);
    if (finalDegrees.some((d, i) => d !== initialDegrees[i]))
      throw new Error("Degree preservation failed");
    const result = {
      edges,
      initialDegrees,
      finalDegrees,
      acceptedCount,
      attempts,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const degreePreservingGraphRewireExample = {
  input: {
    nodes: ["a", "b", "c", "d"],
    edges: [
      ["a", "b"],
      ["c", "d"],
    ],
    attemptCount: 1,
    seed: 42,
  },
  output: {
    edges: [
      ["a", "d"],
      ["b", "c"],
    ],
    initialDegrees: [1, 1, 1, 1],
    finalDegrees: [1, 1, 1, 1],
    acceptedCount: 1,
    attempts: [
      {
        selected: [
          ["c", "d"],
          ["a", "b"],
        ],
        proposed: [
          ["b", "c"],
          ["a", "d"],
        ],
        accepted: true,
        reason: "accepted",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DegreePreservingGraphRewireInput,
  DegreePreservingGraphRewireOutput
>;
export const degreePreservingGraphRewireTool = createModelDefinition<
  DegreePreservingGraphRewireInput,
  DegreePreservingGraphRewireOutput
>({
  id: "random/degree-preserving-graph-rewire",
  title: "Random Degree Preserving Graph Rewire Generator",
  description:
    "Apply bounded double-edge-swap attempts to a supplied simple undirected graph, retaining rejection reasons and verifying exact degree preservation; no uniform graph distribution is claimed.",
  inputSchema,
  outputSchema,
  execute: calculateDegreePreservingGraphRewire,
});
export const runDegreePreservingGraphRewire =
  degreePreservingGraphRewireTool.execute;
export default degreePreservingGraphRewireTool;
