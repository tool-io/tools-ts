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

export type LabeledTreeTopologyInput = {
  readonly nodes: readonly string[];
  readonly seed?: number;
};
export type LabeledTreeTopologyOutput = {
  readonly nodes: readonly string[];
  readonly edges: readonly Edge[];
  readonly degrees: readonly number[];
  readonly componentCount: number;
  readonly sampling: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  { nodes: array(label, 32, 1), seed: generatorSeedSchema },
  ["nodes"],
);
export const outputSchema = object({
  nodes: array(label, 32, 1),
  edges: array(array(label, 2, 2), 31),
  degrees: array(integer, 32, 1),
  componentCount: integer,
  sampling: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is LabeledTreeTopologyInput =>
  matchesModelInput(value, inputSchema);
export const calculateLabeledTreeTopology = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<LabeledTreeTopologyOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const edges = recursiveTree(input.nodes, random),
      result = {
        nodes: [...input.nodes],
        edges,
        degrees: degrees(input.nodes, edges),
        componentCount: components(input.nodes, edges),
        sampling: "ordered recursive tree; uniform earlier parent per node",
      };
    if (edges.length !== input.nodes.length - 1 || result.componentCount !== 1)
      throw new Error("Tree invariant failed");
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const labeledTreeTopologyExample = {
  input: { nodes: ["a", "b", "c", "d"], seed: 42 },
  output: {
    nodes: ["a", "b", "c", "d"],
    edges: [
      ["a", "b"],
      ["a", "c"],
      ["c", "d"],
    ],
    degrees: [2, 1, 2, 1],
    componentCount: 1,
    sampling: "ordered recursive tree; uniform earlier parent per node",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<LabeledTreeTopologyInput, LabeledTreeTopologyOutput>;
export const labeledTreeTopologyTool = createModelDefinition<
  LabeledTreeTopologyInput,
  LabeledTreeTopologyOutput
>({
  id: "random/labeled-tree-topology",
  title: "Random Labeled Tree Topology Generator",
  description:
    "Generate recursive labeled trees by attaching each later supplied ID uniformly to an earlier ID, retaining degrees and connectivity; this is not uniform over labeled trees.",
  inputSchema,
  outputSchema,
  execute: calculateLabeledTreeTopology,
});
export const runLabeledTreeTopology = labeledTreeTopologyTool.execute;
export default labeledTreeTopologyTool;
