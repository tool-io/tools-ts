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
import { runMinimum } from "../../statistics/minimum/tool.js";
import { runMaximum } from "../../statistics/maximum/tool.js";

export type UncertaintyBandChartDatasetInput = {
  readonly centers: readonly number[];
  readonly minimumWidth: number;
  readonly maximumWidth: number;
  readonly seed?: number;
};
export type UncertaintyBandChartDatasetOutput = {
  readonly centers: readonly number[];
  readonly lower: readonly number[];
  readonly upper: readonly number[];
  readonly minimum: number;
  readonly maximum: number;
  readonly rule: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    centers: array(number, 32, 1),
    minimumWidth: { type: "integer", minimum: 0, maximum: 9007199254740990 },
    maximumWidth: { type: "integer", minimum: 0, maximum: 9007199254740990 },
    seed: generatorSeedSchema,
  },
  ["centers", "minimumWidth", "maximumWidth"],
);
export const outputSchema = object({
  centers: array(number, 32, 1),
  lower: array(number, 32, 1),
  upper: array(number, 32, 1),
  minimum: number,
  maximum: number,
  rule: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is UncertaintyBandChartDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateUncertaintyBandChartDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UncertaintyBandChartDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.minimumWidth > input.maximumWidth)
      simpleError(
        "maximumWidth",
        "Width range must be ordered.",
        "invalid_range",
      );
    const lower: number[] = [],
      upper: number[] = [];
    for (const c of input.centers) {
      lower.push(
        finite(
          c - random.integer(input.minimumWidth, input.maximumWidth),
          "centers",
        ),
      );
      upper.push(
        finite(
          c + random.integer(input.minimumWidth, input.maximumWidth),
          "centers",
        ),
      );
    }
    const result = {
      centers: input.centers.map((c) => finite(c)),
      lower,
      upper,
      minimum: core(runMinimum({ values: lower })).minimum,
      maximum: core(runMaximum({ values: upper })).maximum,
      rule: "independent uniform integer widths; synthetic, not confidence bounds",
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const uncertaintyBandChartDatasetExample = {
  input: { centers: [10, 20], minimumWidth: 1, maximumWidth: 3, seed: 42 },
  output: {
    centers: [10, 20],
    lower: [8, 17],
    upper: [12, 23],
    minimum: 8,
    maximum: 23,
    rule: "independent uniform integer widths; synthetic, not confidence bounds",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  UncertaintyBandChartDatasetInput,
  UncertaintyBandChartDatasetOutput
>;
export const uncertaintyBandChartDatasetTool = createModelDefinition<
  UncertaintyBandChartDatasetInput,
  UncertaintyBandChartDatasetOutput
>({
  id: "random/uncertainty-band-chart-dataset",
  title: "Random Uncertainty Band Chart Dataset Generator",
  description:
    "Generate synthetic lower and upper chart bands using independent nonnegative widths around supplied centers, without confidence-interval inference.",
  inputSchema,
  outputSchema,
  execute: calculateUncertaintyBandChartDataset,
});
export const runUncertaintyBandChartDataset =
  uncertaintyBandChartDatasetTool.execute;
export default uncertaintyBandChartDatasetTool;
