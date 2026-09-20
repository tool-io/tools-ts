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

export type SunburstHierarchyDatasetInput = {
  readonly nodes: readonly HierarchyNode[];
  readonly minimum: number;
  readonly maximum: number;
  readonly emptyBranches: readonly number[];
  readonly seed?: number;
};
export type SunburstHierarchyDatasetOutput = {
  readonly nodes: readonly {
    readonly id: string;
    readonly parent: number;
    readonly depth: number;
    readonly value: number;
    readonly parentShare: number | null;
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
    emptyBranches: array({ type: "integer", minimum: 0, maximum: 31 }, 32),
    seed: generatorSeedSchema,
  },
  ["nodes", "minimum", "maximum", "emptyBranches"],
);
export const outputSchema = object({
  nodes: array(
    object({
      id: label,
      parent: integer,
      depth: integer,
      value: integer,
      parentShare: { anyOf: [number, { type: "null" }] },
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SunburstHierarchyDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateSunburstHierarchyDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SunburstHierarchyDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const g = hierarchyValues(
      input.nodes,
      input.minimum,
      input.maximum,
      input.emptyBranches,
      random,
    );
    const result = {
      nodes: input.nodes.map((n, i) => ({
        id: n.id,
        parent: n.parent,
        depth: g.depths[i],
        value: g.values[i],
        parentShare:
          n.parent < 0 || g.values[n.parent] === 0
            ? null
            : g.values[i] / g.values[n.parent],
      })),
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const sunburstHierarchyDatasetExample = {
  input: {
    nodes: [
      { id: "r", parent: -1, leaf: false },
      { id: "a", parent: 0, leaf: true },
      { id: "empty", parent: 0, leaf: false },
    ],
    minimum: 2,
    maximum: 5,
    emptyBranches: [2],
    seed: 42,
  },
  output: {
    nodes: [
      { id: "r", parent: -1, depth: 0, value: 4, parentShare: null },
      { id: "a", parent: 0, depth: 1, value: 4, parentShare: 1 },
      { id: "empty", parent: 0, depth: 1, value: 0, parentShare: 0 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SunburstHierarchyDatasetInput,
  SunburstHierarchyDatasetOutput
>;
export const sunburstHierarchyDatasetTool = createModelDefinition<
  SunburstHierarchyDatasetInput,
  SunburstHierarchyDatasetOutput
>({
  id: "random/sunburst-hierarchy-dataset",
  title: "Random Sunburst Hierarchy Dataset Generator",
  description:
    "Generate multilevel synthetic hierarchy totals, depths and parent shares with explicit empty terminal branches; radial layout is surface-owned.",
  inputSchema,
  outputSchema,
  execute: calculateSunburstHierarchyDataset,
});
export const runSunburstHierarchyDataset = sunburstHierarchyDatasetTool.execute;
export default sunburstHierarchyDatasetTool;
