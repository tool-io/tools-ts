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
import { runDivideTwoNumbers } from "../../arithmetic/divide-two-numbers/tool.js";

export type FunnelStageCountDatasetInput = {
  readonly stages: readonly string[];
  readonly opening: number;
  readonly maximumDrops: readonly number[];
  readonly seed?: number;
};
export type FunnelStageCountDatasetOutput = {
  readonly counts: readonly number[];
  readonly drops: readonly number[];
  readonly conversions: readonly (number | null)[];
  readonly stages: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    stages: array(label, 16, 2),
    opening: { type: "integer", minimum: 0, maximum: 9007199254740990 },
    maximumDrops: array(
      { type: "integer", minimum: 0, maximum: 9007199254740990 },
      15,
      1,
    ),
    seed: generatorSeedSchema,
  },
  ["stages", "opening", "maximumDrops"],
);
export const outputSchema = object({
  counts: array(integer, 16, 2),
  drops: array(integer, 15, 1),
  conversions: array({ anyOf: [number, { type: "null" }] }, 15, 1),
  stages: array(label, 16, 2),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is FunnelStageCountDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateFunnelStageCountDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FunnelStageCountDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.stages, "stages");
    if (input.maximumDrops.length !== input.stages.length - 1)
      simpleError(
        "maximumDrops",
        "One drop cap is required per transition.",
        "shape_mismatch",
      );
    const counts = [finite(input.opening)],
      drops: number[] = [],
      conversions: (number | null)[] = [];
    for (const cap of input.maximumDrops) {
      const prior = counts[counts.length - 1],
        drop = random.integer(0, Math.min(prior, cap)),
        next = prior - drop;
      drops.push(drop);
      counts.push(next);
      conversions.push(
        prior === 0
          ? null
          : core(runDivideTwoNumbers({ dividend: next, divisor: prior }))
              .quotient,
      );
    }
    const result = { counts, drops, conversions, stages: [...input.stages] };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const funnelStageCountDatasetExample = {
  input: {
    stages: ["visit", "cart", "paid"],
    opening: 10,
    maximumDrops: [4, 3],
    seed: 42,
  },
  output: {
    counts: [10, 7, 6],
    drops: [3, 1],
    conversions: [0.7, 0.8571428571428571],
    stages: ["visit", "cart", "paid"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  FunnelStageCountDatasetInput,
  FunnelStageCountDatasetOutput
>;
export const funnelStageCountDatasetTool = createModelDefinition<
  FunnelStageCountDatasetInput,
  FunnelStageCountDatasetOutput
>({
  id: "random/funnel-stage-count-dataset",
  title: "Random Funnel Stage Count Dataset Generator",
  description:
    "Generate nonincreasing synthetic funnel counts under per-stage drop caps, with null conversion when the prior stage is empty.",
  inputSchema,
  outputSchema,
  execute: calculateFunnelStageCountDataset,
});
export const runFunnelStageCountDataset = funnelStageCountDatasetTool.execute;
export default funnelStageCountDatasetTool;
