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
  hierarchyValues,
  type HierarchyNode,
} from "../m500b-charts-math-graphs-hierarchy.js";

export type TreemapHierarchyDatasetInput = {
  readonly nodes: readonly HierarchyNode[];
  readonly minimum: number;
  readonly maximum: number;
  readonly seed?: number;
};
export type TreemapHierarchyDatasetOutput = {
  readonly nodes: readonly {
    readonly id: string;
    readonly parent: number;
    readonly value: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(
      object({
        id: label,
        parent: { type: "integer", minimum: -1, maximum: 30 },
        leaf: bool,
      }),
      32,
      1,
    ),
    minimum: { type: "integer", minimum: 1, maximum: 9007199254740990 },
    maximum: { type: "integer", minimum: 1, maximum: 9007199254740990 },
    seed: generatorSeedSchema,
  },
  ["nodes", "minimum", "maximum"],
);
export const outputSchema = object({
  nodes: array(object({ id: label, parent: integer, value: integer }), 32, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is TreemapHierarchyDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateTreemapHierarchyDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TreemapHierarchyDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const generated = hierarchyValues(
      input.nodes,
      input.minimum,
      input.maximum,
      [],
      random,
    );
    const result = {
      nodes: input.nodes.map((node, i) => ({
        id: node.id,
        parent: node.parent,
        value: generated.values[i],
      })),
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const treemapHierarchyDatasetExample = {
  input: {
    nodes: [
      { id: "root", parent: -1, leaf: false },
      { id: "a", parent: 0, leaf: true },
      { id: "b", parent: 0, leaf: true },
    ],
    minimum: 2,
    maximum: 5,
    seed: 42,
  },
  output: {
    nodes: [
      { id: "root", parent: -1, value: 7 },
      { id: "a", parent: 0, value: 4 },
      { id: "b", parent: 0, value: 3 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  TreemapHierarchyDatasetInput,
  TreemapHierarchyDatasetOutput
>;
export const treemapHierarchyDatasetTool = createModelDefinition<
  TreemapHierarchyDatasetInput,
  TreemapHierarchyDatasetOutput
>({
  id: "random/treemap-hierarchy-dataset",
  title: "Random Treemap Hierarchy Dataset Generator",
  description:
    "Generate positive leaf weights and exact ancestor totals in a supplied rooted hierarchy; treemap packing belongs to the renderer.",
  inputSchema,
  outputSchema,
  execute: calculateTreemapHierarchyDataset,
});
export const runTreemapHierarchyDataset = treemapHierarchyDatasetTool.execute;
export default treemapHierarchyDatasetTool;
