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

export type SankeyFlowConservationDatasetInput = {
  readonly source: string;
  readonly sink: string;
  readonly branches: readonly string[];
  readonly total: number;
  readonly seed?: number;
};
export type SankeyFlowConservationDatasetOutput = {
  readonly links: readonly {
    readonly source: string;
    readonly target: string;
    readonly value: number;
  }[];
  readonly balances: readonly {
    readonly id: string;
    readonly inflow: number;
    readonly outflow: number;
  }[];
  readonly sourceTotal: number;
  readonly sinkTotal: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    source: label,
    sink: label,
    branches: array(label, 16, 1),
    total: { type: "integer", minimum: 0, maximum: 9007199254740990 },
    seed: generatorSeedSchema,
  },
  ["source", "sink", "branches", "total"],
);
export const outputSchema = object({
  links: array(object({ source: label, target: label, value: integer }), 32, 2),
  balances: array(
    object({ id: label, inflow: integer, outflow: integer }),
    16,
    1,
  ),
  sourceTotal: integer,
  sinkTotal: integer,
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SankeyFlowConservationDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateSankeyFlowConservationDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SankeyFlowConservationDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct([input.source, ...input.branches, input.sink], "branches");
    let left = input.total;
    const allocations = input.branches.map((_, i) => {
      if (i === input.branches.length - 1) return left;
      const value = random.integer(0, left);
      left -= value;
      return value;
    });
    if (input.branches.length === 1) random.unit();
    const links = input.branches.flatMap((id, i) => [
      { source: input.source, target: id, value: allocations[i] },
      { source: id, target: input.sink, value: allocations[i] },
    ]);
    const balances = input.branches.map((id, i) => ({
      id,
      inflow: allocations[i],
      outflow: allocations[i],
    }));
    const result = {
      links,
      balances,
      sourceTotal: sum(allocations),
      sinkTotal: sum(allocations),
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const sankeyFlowConservationDatasetExample = {
  input: {
    source: "in",
    sink: "out",
    branches: ["a", "b"],
    total: 10,
    seed: 42,
  },
  output: {
    links: [
      { source: "in", target: "a", value: 6 },
      { source: "a", target: "out", value: 6 },
      { source: "in", target: "b", value: 4 },
      { source: "b", target: "out", value: 4 },
    ],
    balances: [
      { id: "a", inflow: 6, outflow: 6 },
      { id: "b", inflow: 4, outflow: 4 },
    ],
    sourceTotal: 10,
    sinkTotal: 10,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SankeyFlowConservationDatasetInput,
  SankeyFlowConservationDatasetOutput
>;
export const sankeyFlowConservationDatasetTool = createModelDefinition<
  SankeyFlowConservationDatasetInput,
  SankeyFlowConservationDatasetOutput
>({
  id: "random/sankey-flow-conservation-dataset",
  title: "Random Sankey Flow Conservation Dataset Generator",
  description:
    "Construct synthetic source-to-branch-to-sink flows with exact integer conservation at every intermediate node.",
  inputSchema,
  outputSchema,
  execute: calculateSankeyFlowConservationDataset,
});
export const runSankeyFlowConservationDataset =
  sankeyFlowConservationDatasetTool.execute;
export default sankeyFlowConservationDatasetTool;
