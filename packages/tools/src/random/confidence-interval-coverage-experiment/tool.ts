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
import { runMean } from "../../statistics/mean/tool.js";
import { calculateSampleVariance } from "../../statistics/sample-variance/tool.js";
import { runNthRoot } from "../../arithmetic/nth-root/tool.js";
import { calculateTInterval } from "../../statistics/t-interval/tool.js";
import {
  calculateZConfidenceInterval,
  type ZConfidenceLevel,
} from "../../statistics/z-confidence-interval/tool.js";
import { drawSyntheticNormal } from "../synthetic-normal-construction.js";
import { experimentSamplesSchema } from "../statistical-experiment-construction.js";

export type ConfidenceIntervalCoverageExperimentInput = {
  readonly experimentCount: number;
  readonly sampleCount: number;
  readonly mean: number;
  readonly standardDeviation: number;
  readonly confidenceLevel: ZConfidenceLevel;
  readonly seed?: number;
};
export type CoverageExperimentInterval = {
  readonly lower: number;
  readonly upper: number;
  readonly coversMean: boolean;
};
export type ConfidenceIntervalCoverageExperimentOutput = {
  readonly model: {
    readonly mean: number;
    readonly standardDeviation: number;
    readonly confidenceLevel: ZConfidenceLevel;
    readonly sampleCount: number;
  };
  readonly experiments: readonly {
    readonly values: readonly number[];
    readonly sampleMean: number;
    readonly sampleStandardDeviation: number;
    readonly tInterval: CoverageExperimentInterval;
    readonly zInterval: CoverageExperimentInterval;
  }[];
  readonly coverage: {
    readonly tCount: number;
    readonly zCount: number;
    readonly experimentCount: number;
    readonly tFraction: number;
    readonly zFraction: number;
  };
  readonly randomness: GeneratorReplay;
};
const confidenceSchema = {
  type: "integer",
  enum: [80, 85, 90, 95, 98, 99],
} as const;
const intervalSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    coversMean: { type: "boolean" },
  },
  required: ["lower", "upper", "coversMean"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    experimentCount: { type: "integer", minimum: 1, maximum: 128 },
    sampleCount: { type: "integer", minimum: 2, maximum: 128 },
    mean: { type: "number" },
    standardDeviation: { type: "number", minimum: 0 },
    confidenceLevel: confidenceSchema,
    seed: generatorSeedSchema,
  },
  required: [
    "experimentCount",
    "sampleCount",
    "mean",
    "standardDeviation",
    "confidenceLevel",
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
        confidenceLevel: confidenceSchema,
        sampleCount: { type: "integer", minimum: 2, maximum: 128 },
      },
      required: ["mean", "standardDeviation", "confidenceLevel", "sampleCount"],
    },
    experiments: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          values: { ...experimentSamplesSchema, minItems: 2, maxItems: 128 },
          sampleMean: { type: "number" },
          sampleStandardDeviation: { type: "number", minimum: 0 },
          tInterval: intervalSchema,
          zInterval: intervalSchema,
        },
        required: [
          "values",
          "sampleMean",
          "sampleStandardDeviation",
          "tInterval",
          "zInterval",
        ],
      },
    },
    coverage: {
      type: "object",
      additionalProperties: false,
      properties: {
        tCount: { type: "integer", minimum: 0, maximum: 128 },
        zCount: { type: "integer", minimum: 0, maximum: 128 },
        experimentCount: { type: "integer", minimum: 1, maximum: 128 },
        tFraction: { type: "number", minimum: 0, maximum: 1 },
        zFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "tCount",
        "zCount",
        "experimentCount",
        "tFraction",
        "zFraction",
      ],
    },
    randomness: generatorReplaySchema,
  },
  required: ["model", "experiments", "coverage", "randomness"],
} as const;
const finiteSummary = (value: number): number => {
  if (!Number.isFinite(value))
    return simpleError(
      "standardDeviation",
      "A moment or confidence endpoint is not representable as a finite number.",
      "numeric_overflow",
    );
  return value === 0 ? 0 : value;
};
const isInput = (
  input: unknown,
): input is ConfidenceIntervalCoverageExperimentInput =>
  matchesModelInput(input, inputSchema);
export const calculateConfidenceIntervalCoverageExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ConfidenceIntervalCoverageExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.experimentCount * input.sampleCount > 4096)
      simpleError(
        "experimentCount",
        "The combined experiment is limited to 4096 generated observations.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      experiments: ConfidenceIntervalCoverageExperimentOutput["experiments"][number][] =
        [];
    let tCount = 0,
      zCount = 0;
    for (let i = 0; i < input.experimentCount; i += 1) {
      const values = Array.from({ length: input.sampleCount }, () =>
        drawSyntheticNormal(
          input.mean,
          input.standardDeviation,
          random,
          "standardDeviation",
        ),
      );
      const scale =
          Math.max(
            ...values.map(Math.abs),
            Math.abs(input.mean),
            input.standardDeviation,
          ) || 1,
        normalized = values.map((value) => value / scale);
      const center = runMean({ values: normalized }),
        variance = calculateSampleVariance({ values: normalized });
      if (!center.ok || !variance.ok)
        throw new Error(
          "Validated normalized observations were rejected by a moment core.",
        );
      const root = runNthRoot({
        value: variance.output.sampleVariance,
        degree: 2,
      });
      if (!root.ok)
        throw new Error(
          "A nonnegative normalized sample variance was rejected by the root core.",
        );
      const mean = center.output.mean as number,
        deviation = root.output.root as number;
      const t = calculateTInterval({
        confidenceLevel: input.confidenceLevel / 100,
        sampleMean: mean,
        sampleSize: input.sampleCount,
        sampleStandardDeviation: deviation,
      });
      const z = calculateZConfidenceInterval(
        input.sampleCount,
        mean,
        input.standardDeviation / scale,
        input.confidenceLevel,
      );
      if (!t.ok || z === null)
        throw new Error(
          "Supported normalized interval inputs were rejected by an interval core.",
        );
      const makeInterval = (
        lower: number,
        upper: number,
      ): CoverageExperimentInterval => ({
        lower: finiteSummary(lower * scale),
        upper: finiteSummary(upper * scale),
        coversMean: lower <= input.mean / scale && upper >= input.mean / scale,
      });
      const tInterval = makeInterval(t.output.lower, t.output.upper),
        zInterval = makeInterval(z[0], z[1]);
      if (tInterval.coversMean) tCount += 1;
      if (zInterval.coversMean) zCount += 1;
      experiments.push({
        values,
        sampleMean: finiteSummary(mean * scale),
        sampleStandardDeviation: finiteSummary(deviation * scale),
        tInterval,
        zInterval,
      });
    }
    return toolSuccess({
      model: {
        mean: input.mean,
        standardDeviation: input.standardDeviation,
        confidenceLevel: input.confidenceLevel,
        sampleCount: input.sampleCount,
      },
      experiments,
      coverage: {
        tCount,
        zCount,
        experimentCount: input.experimentCount,
        tFraction: tCount / input.experimentCount,
        zFraction: zCount / input.experimentCount,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const confidenceIntervalCoverageExperimentExample = {
  input: {
    experimentCount: 2,
    sampleCount: 2,
    mean: 0,
    standardDeviation: 1,
    confidenceLevel: 80,
    seed: 42,
  },
  output: {
    model: {
      mean: 0,
      standardDeviation: 1,
      confidenceLevel: 80,
      sampleCount: 2,
    },
    experiments: [
      {
        values: [-0.956162229384149, -0.2730261048826104],
        sampleMean: -0.6145941671333797,
        sampleStandardDeviation: 0.4830501861085355,
        tInterval: {
          lower: -1.6658325691474236,
          upper: 0.4366442348806643,
          coversMean: true,
        },
        zInterval: {
          lower: -1.5207879695702027,
          upper: 0.29159963530344346,
          coversMean: true,
        },
      },
      {
        values: [-1.8416271847835968, -1.1408820709540242],
        sampleMean: -1.4912546278688106,
        sampleStandardDeviation: 0.4955016218722299,
        tInterval: {
          lower: -2.569590478163447,
          upper: -0.41291877757417417,
          coversMean: false,
        },
        zInterval: {
          lower: -2.3974484303056336,
          upper: -0.5850608254319875,
          coversMean: false,
        },
      },
    ],
    coverage: {
      tCount: 1,
      zCount: 1,
      experimentCount: 2,
      tFraction: 0.5,
      zFraction: 0.5,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ConfidenceIntervalCoverageExperimentInput,
  ConfidenceIntervalCoverageExperimentOutput
>;
export const confidenceIntervalCoverageExperimentTool = createModelDefinition<
  ConfidenceIntervalCoverageExperimentInput,
  ConfidenceIntervalCoverageExperimentOutput
>({
  id: "random/confidence-interval-coverage-experiment",
  title: "Random Confidence Interval Coverage Experiment Generator",
  description:
    "Generate repeated normal samples and compare observed coverage of delegated Student t and known-sigma z mean intervals at supported confidence levels; normalize moment/interval calculations for scale and retain full-precision summaries and endpoints, not a nominal-coverage guarantee.",
  inputSchema,
  outputSchema,
  execute: calculateConfidenceIntervalCoverageExperiment,
});
export const runConfidenceIntervalCoverageExperiment =
  confidenceIntervalCoverageExperimentTool.execute;
export default confidenceIntervalCoverageExperimentTool;
