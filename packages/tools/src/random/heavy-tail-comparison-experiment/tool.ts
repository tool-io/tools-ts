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
import { runCauchySampler } from "../../probability/cauchy-sampler/tool.js";
import { samplePareto } from "../../probability/pareto-sampler/tool.js";
import { calculateMedian } from "../../statistics/median/tool.js";
import {
  derivedExperimentSeed,
  experimentSamplesSchema,
  experimentPositiveSchema,
  experimentQuantile,
} from "../statistical-experiment-construction.js";

export type HeavyTailComparisonExperimentInput = {
  readonly count: number;
  readonly cauchyLocation: number;
  readonly cauchyScale: number;
  readonly paretoScale: number;
  readonly paretoShape: number;
  readonly percentiles: readonly number[];
  readonly seed?: number;
};
export type HeavyTailBatch = {
  readonly samplerSeed: string;
  readonly samples: readonly number[];
  readonly minimum: number;
  readonly maximum: number;
  readonly median: number;
  readonly quantiles: readonly {
    readonly percentile: number;
    readonly value: number;
  }[];
};
export type HeavyTailComparisonExperimentOutput = {
  readonly model: {
    readonly cauchyLocation: number;
    readonly cauchyScale: number;
    readonly paretoScale: number;
    readonly paretoShape: number;
  };
  readonly cauchy: HeavyTailBatch;
  readonly pareto: HeavyTailBatch;
  readonly randomness: GeneratorReplay;
};
const batchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplerSeed: { type: "string", minLength: 1 },
    samples: experimentSamplesSchema,
    minimum: { type: "number" },
    maximum: { type: "number" },
    median: { type: "number" },
    quantiles: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          percentile: { type: "number", minimum: 0, maximum: 100 },
          value: { type: "number" },
        },
        required: ["percentile", "value"],
      },
    },
  },
  required: [
    "samplerSeed",
    "samples",
    "minimum",
    "maximum",
    "median",
    "quantiles",
  ],
} as const;
const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cauchyLocation: { type: "number" },
    cauchyScale: experimentPositiveSchema,
    paretoScale: experimentPositiveSchema,
    paretoShape: experimentPositiveSchema,
  },
  required: ["cauchyLocation", "cauchyScale", "paretoScale", "paretoShape"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...modelSchema.properties,
    count: { type: "integer", minimum: 1, maximum: 2048 },
    percentiles: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "number", minimum: 0, maximum: 100 },
    },
    seed: generatorSeedSchema,
  },
  required: [...modelSchema.required, "count", "percentiles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: modelSchema,
    cauchy: batchSchema,
    pareto: batchSchema,
    randomness: generatorReplaySchema,
  },
  required: ["model", "cauchy", "pareto", "randomness"],
} as const;

const isInput = (input: unknown): input is HeavyTailComparisonExperimentInput =>
  matchesModelInput(input, inputSchema);
export const calculateHeavyTailComparisonExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HeavyTailComparisonExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.percentiles).size !== input.percentiles.length)
      simpleError(
        "percentiles",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    const random = createGeneratorRandom(input.seed, context),
      cauchySeed = derivedExperimentSeed(random, "cauchy"),
      paretoSeed = derivedExperimentSeed(random, "pareto");
    const cauchy = runCauchySampler({
      location: input.cauchyLocation,
      scale: input.cauchyScale,
      count: input.count,
      seed: cauchySeed,
    });
    if (!cauchy.ok)
      return invalidInput(
        cauchy.error.issues.map((issue) => ({
          ...issue,
          field: "cauchyScale",
          code: "sampler_failed",
        })),
      );
    const pareto = samplePareto(
      input.paretoScale,
      input.paretoShape,
      input.count,
      paretoSeed,
    );
    if (pareto === null)
      return simpleError(
        "paretoShape",
        "The Pareto sampler could not produce a finite batch.",
        "sampler_failed",
      );
    const batch = (
      samples: readonly number[],
      samplerSeed: string,
    ): HeavyTailBatch => {
      const scale = Math.max(...samples.map(Math.abs)) || 1,
        normalized = samples.map((value) => value / scale);
      const medianResult = calculateMedian({ values: normalized });
      if (!medianResult.ok)
        throw new Error(
          "Validated normalized samples were rejected by the median core.",
        );
      const median = medianResult.output.median * scale;
      if (!Number.isFinite(median))
        simpleError(
          "count",
          "The empirical median is outside the finite numeric range.",
          "numeric_overflow",
        );
      return {
        samplerSeed,
        samples,
        minimum: Math.min(...samples),
        maximum: Math.max(...samples),
        median: median === 0 ? 0 : median,
        quantiles: input.percentiles.map((percentile) => ({
          percentile,
          value: experimentQuantile(samples, percentile, "percentiles"),
        })),
      };
    };
    return toolSuccess({
      model: {
        cauchyLocation: input.cauchyLocation,
        cauchyScale: input.cauchyScale,
        paretoScale: input.paretoScale,
        paretoShape: input.paretoShape,
      },
      cauchy: batch(cauchy.output.samples as readonly number[], cauchySeed),
      pareto: batch(pareto, paretoSeed),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const heavyTailComparisonExperimentExample = {
  input: {
    count: 4,
    cauchyLocation: 0,
    cauchyScale: 1,
    paretoScale: 1,
    paretoShape: 2,
    percentiles: [25, 75],
    seed: 42,
  },
  output: {
    model: {
      cauchyLocation: 0,
      cauchyScale: 1,
      paretoScale: 1,
      paretoShape: 2,
    },
    cauchy: {
      samplerSeed: "cauchy:2581720956",
      samples: [
        -0.9827371429979488, -2.4105147195888246, -6.616965306583044,
        68.51463976143775,
      ],
      minimum: -6.616965306583044,
      maximum: 68.51463976143775,
      median: -1.6966259312933867,
      quantiles: [
        {
          percentile: 25,
          value: -3.4621273663373793,
        },
        {
          percentile: 75,
          value: 16.391607083110976,
        },
      ],
    },
    pareto: {
      samplerSeed: "pareto:1925393290",
      samples: [3.267891477, 1.039048033, 1.210292686, 1.200343332],
      minimum: 1.039048033,
      maximum: 3.267891477,
      median: 1.205318009,
      quantiles: [
        {
          percentile: 25,
          value: 1.1600195072500001,
        },
        {
          percentile: 75,
          value: 1.7246923837500001,
        },
      ],
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  HeavyTailComparisonExperimentInput,
  HeavyTailComparisonExperimentOutput
>;
export const heavyTailComparisonExperimentTool = createModelDefinition<
  HeavyTailComparisonExperimentInput,
  HeavyTailComparisonExperimentOutput
>({
  id: "random/heavy-tail-comparison-experiment",
  title: "Random Heavy-Tail Comparison Experiment Generator",
  description:
    "Compare matched-size Cauchy and Pareto Type I samples with visible derived sampler seeds, observed extremes, medians, and linearly interpolated empirical quantiles; preserve Pareto sampler 10-significant-digit rounding and epsilon tail clipping, and do not report a finite Cauchy population mean or variance.",
  inputSchema,
  outputSchema,
  execute: calculateHeavyTailComparisonExperiment,
});
export const runHeavyTailComparisonExperiment =
  heavyTailComparisonExperimentTool.execute;
export default heavyTailComparisonExperimentTool;
