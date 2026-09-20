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
  type Edge,
} from "../m500b-charts-math-graphs-graphs.js";
import { calculateBreadthFirstTraversal } from "../../graph/breadth-first-traversal/tool.js";

export type RootedTreeDepthProfileInput = {
  readonly nodes: readonly string[];
  readonly maximumDepth: number;
  readonly maximumChildren: number;
  readonly seed?: number;
};
export type RootedTreeDepthProfileOutput = {
  readonly nodes: readonly string[];
  readonly edges: readonly Edge[];
  readonly parents: readonly (string | null)[];
  readonly depths: readonly number[];
  readonly degrees: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(label, 32, 1),
    maximumDepth: { type: "integer", minimum: 0, maximum: 31 },
    maximumChildren: { type: "integer", minimum: 0, maximum: 31 },
    seed: generatorSeedSchema,
  },
  ["nodes", "maximumDepth", "maximumChildren"],
);
export const outputSchema = object({
  nodes: array(label, 32, 1),
  edges: array(array(label, 2, 2), 31),
  parents: array({ anyOf: [label, { type: "null" }] }, 32, 1),
  depths: array(integer, 32, 1),
  degrees: array(integer, 32, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is RootedTreeDepthProfileInput =>
  matchesModelInput(value, inputSchema);
export const calculateRootedTreeDepthProfile = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RootedTreeDepthProfileOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.nodes, "nodes");
    let capacity = 1,
      level = 1;
    for (let d = 1; d <= input.maximumDepth; d++) {
      level = Math.min(input.nodes.length, level * input.maximumChildren);
      capacity = Math.min(input.nodes.length, capacity + level);
    }
    if (capacity < input.nodes.length)
      simpleError(
        "nodes",
        "Node count exceeds the exact depth/branching capacity.",
        "infeasible_tree",
      );
    const edges: Edge[] = [],
      parents: (string | null)[] = [null],
      depths = [0],
      children = [0];
    for (let i = 1; i < input.nodes.length; i++) {
      const available = depths
        .map((d, j) => j)
        .filter(
          (j) =>
            depths[j] < input.maximumDepth &&
            children[j] < input.maximumChildren,
        );
      if (!available.length)
        throw new Error("Feasible capacity lost its remaining slot");
      const p = random.pick(available);
      edges.push([input.nodes[p], input.nodes[i]]);
      parents.push(input.nodes[p]);
      depths.push(depths[p] + 1);
      children[p]++;
      children.push(0);
    }
    if (input.nodes.length === 1) random.unit();
    const traversal = calculateBreadthFirstTraversal({
      graph: adjacency(input.nodes, edges),
      start: input.nodes[0],
    });
    if (input.nodes.some((n, i) => traversal.depths[n] !== depths[i]))
      throw new Error("Rooted depths failed BFS verification");
    const result = {
      nodes: [...input.nodes],
      edges,
      parents,
      depths,
      degrees: degrees(input.nodes, edges),
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const rootedTreeDepthProfileExample = {
  input: {
    nodes: ["a", "b", "c", "d"],
    maximumDepth: 2,
    maximumChildren: 2,
    seed: 42,
  },
  output: {
    nodes: ["a", "b", "c", "d"],
    edges: [
      ["a", "b"],
      ["a", "c"],
      ["c", "d"],
    ],
    parents: [null, "a", "a", "c"],
    depths: [0, 1, 1, 2],
    degrees: [2, 1, 2, 1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RootedTreeDepthProfileInput,
  RootedTreeDepthProfileOutput
>;
export const rootedTreeDepthProfileTool = createModelDefinition<
  RootedTreeDepthProfileInput,
  RootedTreeDepthProfileOutput
>({
  id: "random/rooted-tree-depth-profile",
  title: "Random Rooted Tree Depth Profile Generator",
  description:
    "Generate rooted trees within explicit depth/branching capacities, reject provably infeasible sizes and retain parent/depth tables verified by breadth-first traversal.",
  inputSchema,
  outputSchema,
  execute: calculateRootedTreeDepthProfile,
});
export const runRootedTreeDepthProfile = rootedTreeDepthProfileTool.execute;
export default rootedTreeDepthProfileTool;
