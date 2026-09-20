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

export type StackedBarTotalDatasetInput = {
  readonly totals: readonly number[];
  readonly componentCount: number;
  readonly seed?: number;
};
export type StackedBarTotalDatasetOutput = {
  readonly components: readonly (readonly number[])[];
  readonly totals: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    totals: array({ type: "integer", minimum: 0 }, 16, 1),
    componentCount: { type: "integer", minimum: 1, maximum: 8 },
    seed: generatorSeedSchema,
  },
  ["totals", "componentCount"],
);
export const outputSchema = object({
  components: array(array(integer, 8, 1), 16, 1),
  totals: array(integer, 16, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is StackedBarTotalDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateStackedBarTotalDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StackedBarTotalDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const components = input.totals.map((total) => {
      let left = total;
      const row: number[] = [];
      for (let j = 1; j < input.componentCount; j++) {
        const v = random.integer(0, left);
        row.push(v);
        left -= v;
      }
      row.push(left);
      if (sum(row) !== total) throw new Error("Total was not conserved");
      return row;
    });
    if (input.componentCount === 1) random.unit();
    const result = { components, totals: [...input.totals] };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const stackedBarTotalDatasetExample = {
  input: { totals: [10, 6], componentCount: 2, seed: 42 },
  output: {
    components: [
      [6, 4],
      [3, 3],
    ],
    totals: [10, 6],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  StackedBarTotalDatasetInput,
  StackedBarTotalDatasetOutput
>;
export const stackedBarTotalDatasetTool = createModelDefinition<
  StackedBarTotalDatasetInput,
  StackedBarTotalDatasetOutput
>({
  id: "random/stacked-bar-total-dataset",
  title: "Random Stacked Bar Total Dataset Generator",
  description:
    "Split supplied nonnegative category totals into synthetic stacked components using sequential residual draws; plotting is surface-owned.",
  inputSchema,
  outputSchema,
  execute: calculateStackedBarTotalDataset,
});
export const runStackedBarTotalDataset = stackedBarTotalDatasetTool.execute;
export default stackedBarTotalDatasetTool;
