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
  recursiveTree,
  components,
  degrees,
  type Edge,
} from "../m500b-charts-math-graphs-graphs.js";

export type ForestComponentSizeSetInput = {
  readonly nodes: readonly string[];
  readonly sizes: readonly number[];
  readonly seed?: number;
};
export type ForestComponentSizeSetOutput = {
  readonly nodes: readonly string[];
  readonly edges: readonly Edge[];
  readonly componentLabels: readonly number[];
  readonly sizes: readonly number[];
  readonly degrees: readonly number[];
  readonly componentCount: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(label, 32, 1),
    sizes: array({ type: "integer", minimum: 1, maximum: 32 }, 32, 1),
    seed: generatorSeedSchema,
  },
  ["nodes", "sizes"],
);
export const outputSchema = object({
  nodes: array(label, 32, 1),
  edges: array(array(label, 2, 2), 31),
  componentLabels: array(integer, 32, 1),
  sizes: array(integer, 32, 1),
  degrees: array(integer, 32, 1),
  componentCount: integer,
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ForestComponentSizeSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateForestComponentSizeSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ForestComponentSizeSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.nodes, "nodes");
    if (sum(input.sizes) !== input.nodes.length)
      simpleError(
        "sizes",
        "Component sizes must sum to the supplied node count.",
        "shape_mismatch",
      );
    const nodes = random.shuffle(input.nodes),
      edges: Edge[] = [],
      componentLabels: number[] = [];
    let offset = 0;
    input.sizes.forEach((size, c) => {
      const group = nodes.slice(offset, offset + size);
      edges.push(...recursiveTree(group, random));
      componentLabels.push(...group.map(() => c));
      offset += size;
    });
    const componentCount = components(nodes, edges);
    if (
      componentCount !== input.sizes.length ||
      edges.length !== nodes.length - componentCount
    )
      throw new Error("Forest invariant failed");
    const result = {
      nodes,
      edges,
      componentLabels,
      sizes: [...input.sizes],
      degrees: degrees(nodes, edges),
      componentCount,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const forestComponentSizeSetExample = {
  input: { nodes: ["a", "b", "c"], sizes: [2, 1], seed: 42 },
  output: {
    nodes: ["c", "a", "b"],
    edges: [["c", "a"]],
    componentLabels: [0, 0, 1],
    sizes: [2, 1],
    degrees: [1, 1, 0],
    componentCount: 2,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ForestComponentSizeSetInput,
  ForestComponentSizeSetOutput
>;
export const forestComponentSizeSetTool = createModelDefinition<
  ForestComponentSizeSetInput,
  ForestComponentSizeSetOutput
>({
  id: "random/forest-component-size-set",
  title: "Random Forest Component Size Set Generator",
  description:
    "Generate an acyclic forest with caller-selected component sizes, shuffled node membership and verified degree/connectivity labels.",
  inputSchema,
  outputSchema,
  execute: calculateForestComponentSizeSet,
});
export const runForestComponentSizeSet = forestComponentSizeSetTool.execute;
export default forestComponentSizeSetTool;
