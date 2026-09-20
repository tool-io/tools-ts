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
  validateEdges,
  nearEdge,
  binOf,
} from "../m500b-charts-math-graphs-bins.js";

export type ChoroplethBinBoundaryDatasetInput = {
  readonly regions: readonly string[];
  readonly edges: readonly number[];
  readonly epsilon: number;
  readonly seed?: number;
};
export type ChoroplethBinBoundaryDatasetOutput = {
  readonly rows: readonly {
    readonly region: string;
    readonly value: number;
    readonly classIndex: number;
  }[];
  readonly classCounts: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    regions: array(label, 32, 1),
    edges: array(integer, 17, 2),
    epsilon: { type: "integer", minimum: 1 },
    seed: generatorSeedSchema,
  },
  ["regions", "edges", "epsilon"],
);
export const outputSchema = object({
  rows: array(
    object({ region: label, value: integer, classIndex: integer }),
    32,
    1,
  ),
  classCounts: array(integer, 16, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ChoroplethBinBoundaryDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateChoroplethBinBoundaryDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ChoroplethBinBoundaryDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.regions, "regions");
    validateEdges(input.edges, input.epsilon);
    const rows = input.regions.map((region) => {
        const value = nearEdge(input.edges, input.epsilon, random);
        return { region, value, classIndex: binOf(value, input.edges, "left") };
      }),
      classCounts = input.edges
        .slice(1)
        .map((_, i) => rows.filter((r) => r.classIndex === i).length);
    const result = { rows, classCounts };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const choroplethBinBoundaryDatasetExample = {
  input: { regions: ["a", "b"], edges: [0, 10, 20], epsilon: 1, seed: 42 },
  output: {
    rows: [
      { region: "a", value: 10, classIndex: 1 },
      { region: "b", value: 21, classIndex: -1 },
    ],
    classCounts: [0, 1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ChoroplethBinBoundaryDatasetInput,
  ChoroplethBinBoundaryDatasetOutput
>;
export const choroplethBinBoundaryDatasetTool = createModelDefinition<
  ChoroplethBinBoundaryDatasetInput,
  ChoroplethBinBoundaryDatasetOutput
>({
  id: "random/choropleth-bin-boundary-dataset",
  title: "Random Choropleth Bin Boundary Dataset Generator",
  description:
    "Assign synthetic near-break values to supplied region IDs with explicit lower-closed class labels and outside controls; no map geometry is supplied.",
  inputSchema,
  outputSchema,
  execute: calculateChoroplethBinBoundaryDataset,
});
export const runChoroplethBinBoundaryDataset =
  choroplethBinBoundaryDatasetTool.execute;
export default choroplethBinBoundaryDatasetTool;
