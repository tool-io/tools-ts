import type { ToolExample } from "../../core/example.js";
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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  calculateBootstrapConfidenceInterval,
  type BootstrapStatistic,
} from "../../statistics/bootstrap-confidence-interval/tool.js";
import { drawSyntheticNormal } from "../synthetic-normal-construction.js";
import { experimentSamplesSchema } from "../statistical-experiment-construction.js";

export type BootstrapIntervalExperimentInput = {
  readonly datasetCount: number;
  readonly sampleCount: number;
  readonly mean: number;
  readonly standardDeviation: number;
  readonly statistic: BootstrapStatistic;
  readonly confidenceLevel: number;
  readonly resamples: number;
  readonly seed?: number;
};
export type BootstrapIntervalExperimentOutput = {
  readonly model: { readonly mean: number; readonly standardDeviation: number };
  readonly experiments: readonly {
    readonly values: readonly number[];
    readonly interval: {
      readonly estimate: number;
      readonly low: number;
      readonly high: number;
      readonly confidenceLevel: number;
      readonly resamples: number;
      readonly statistic: BootstrapStatistic;
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const statisticSchema = { type: "string", enum: ["mean", "median"] } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datasetCount: { type: "integer", minimum: 1, maximum: 32 },
    sampleCount: { type: "integer", minimum: 2, maximum: 128 },
    mean: { type: "number" },
    standardDeviation: { type: "number", minimum: 0 },
    statistic: statisticSchema,
    confidenceLevel: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 1,
    },
    resamples: { type: "integer", minimum: 2, maximum: 4096 },
    seed: generatorSeedSchema,
  },
  required: [
    "datasetCount",
    "sampleCount",
    "mean",
    "standardDeviation",
    "statistic",
    "confidenceLevel",
    "resamples",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: {
      type: "object",
      additionalProperties: false,
      properties: {
        mean: { type: "number" },
        standardDeviation: { type: "number", minimum: 0 },
      },
      required: ["mean", "standardDeviation"],
    },
    experiments: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          values: { ...experimentSamplesSchema, minItems: 2, maxItems: 128 },
          interval: {
            type: "object",
            additionalProperties: false,
            properties: {
              estimate: { type: "number" },
              low: { type: "number" },
              high: { type: "number" },
              confidenceLevel: {
                type: "number",
                exclusiveMinimum: 0,
                exclusiveMaximum: 1,
              },
              resamples: { type: "integer", minimum: 2, maximum: 4096 },
              statistic: statisticSchema,
            },
            required: [
              "estimate",
              "low",
              "high",
              "confidenceLevel",
              "resamples",
              "statistic",
            ],
          },
        },
        required: ["values", "interval"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["model", "experiments", "randomness"],
} as const;

const isInput = (input: unknown): input is BootstrapIntervalExperimentInput =>
  matchesModelInput(input, inputSchema);
export const calculateBootstrapIntervalExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BootstrapIntervalExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.datasetCount * input.sampleCount * input.resamples > 250000)
      simpleError(
        "resamples",
        "The experiment is limited to 250,000 resampled observations.",
        "resource_limit",
      );
    const coreLevel = 1 - (1 - input.confidenceLevel) / 2;
    if (!(coreLevel > 0.5 && coreLevel < 1))
      simpleError(
        "confidenceLevel",
        "Equal bootstrap tails are not distinguishable at floating-point precision.",
        "unrepresentable_confidence",
      );
    const random = createGeneratorRandom(input.seed, context),
      experiments: {
        values: number[];
        interval: {
          estimate: number;
          low: number;
          high: number;
          confidenceLevel: number;
          resamples: number;
          statistic: BootstrapStatistic;
        };
      }[] = [];
    for (let i = 0; i < input.datasetCount; i += 1) {
      const values = Array.from({ length: input.sampleCount }, () =>
        drawSyntheticNormal(
          input.mean,
          input.standardDeviation,
          random,
          "standardDeviation",
        ),
      );
      const result = calculateBootstrapConfidenceInterval(
        {
          values,
          statistic: input.statistic,
          resamples: input.resamples,
          level: coreLevel,
        },
        { ...context, random: random.unit },
      );
      if (!result.ok) return result;
      const { estimate, low, high } = result.output;
      if (![estimate, low, high].every(Number.isFinite))
        simpleError(
          "mean",
          "The delegated interval summary is outside the finite numeric range.",
          "numeric_overflow",
        );
      experiments.push({
        values,
        interval: {
          estimate,
          low,
          high,
          confidenceLevel: input.confidenceLevel,
          resamples: input.resamples,
          statistic: input.statistic,
        },
      });
    }
    return toolSuccess({
      model: { mean: input.mean, standardDeviation: input.standardDeviation },
      experiments,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bootstrapIntervalExperimentExample = {
  input: {
    datasetCount: 1,
    sampleCount: 3,
    mean: 0,
    standardDeviation: 1,
    statistic: "mean",
    confidenceLevel: 0.5,
    resamples: 4,
    seed: 42,
  },
  output: {
    model: {
      mean: 0,
      standardDeviation: 1,
    },
    experiments: [
      {
        values: [-0.956162229384149, -0.2730261048826104, -1.8416271847835968],
        interval: {
          estimate: -1.02360517302,
          low: -1.25131721452,
          high: -1.02360517302,
          confidenceLevel: 0.5,
          resamples: 4,
          statistic: "mean",
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  BootstrapIntervalExperimentInput,
  BootstrapIntervalExperimentOutput
>;
export const bootstrapIntervalExperimentTool = createModelDefinition<
  BootstrapIntervalExperimentInput,
  BootstrapIntervalExperimentOutput
>({
  id: "random/bootstrap-interval-experiment",
  title: "Random Bootstrap Interval Experiment Generator",
  description:
    "Generate bounded normal datasets and delegate mean/median percentile-bootstrap intervals with equal two-sided tail probabilities, adapting the older core level convention; retain nearest-rank endpoints and 12-significant-digit summary rounding, not BCa intervals or guaranteed nominal coverage.",
  inputSchema,
  outputSchema,
  execute: calculateBootstrapIntervalExperiment,
});
export const runBootstrapIntervalExperiment =
  bootstrapIntervalExperimentTool.execute;
export default bootstrapIntervalExperimentTool;
