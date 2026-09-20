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
  calculatePopulationSummary,
  type PopulationSummary,
} from "../../statistics/population-summary/tool.js";

export type MonteCarloUniformInput = {
  readonly count: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly binCount: number;
  readonly seed?: number;
};
export type MonteCarloUniformOutput = {
  readonly samples: readonly number[];
  readonly histogram: readonly number[];
  readonly summary: PopulationSummary;
  readonly theoreticalMean: number;
  readonly theoreticalVariance: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 4096 },
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
    binCount: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: ["count", "lowerBound", "upperBound", "binCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: {
      type: "array",
      minItems: 1,
      maxItems: 4096,
      items: { type: "number" },
    },
    histogram: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { type: "integer", minimum: 0, maximum: 4096 },
    },
    summary: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 1, maximum: 4096 },
        mean: { type: "number" },
        variance: { type: "number", minimum: 0 },
        standardDeviation: { type: "number", minimum: 0 },
      },
      required: ["count", "mean", "variance", "standardDeviation"],
    },
    theoreticalMean: { type: "number" },
    theoreticalVariance: { type: "number", minimum: 0 },
    randomness: generatorReplaySchema,
  },
  required: [
    "samples",
    "histogram",
    "summary",
    "theoreticalMean",
    "theoreticalVariance",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MonteCarloUniformInput =>
  matchesModelInput(input, inputSchema);
export const calculateMonteCarloUniform = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MonteCarloUniformOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const span = input.upperBound - input.lowerBound;
    if (!(span > 0) || !Number.isFinite(span))
      simpleError(
        "upperBound",
        "The interval must have a positive finite width.",
        "invalid_interval",
      );
    const theoreticalMean = input.lowerBound / 2 + input.upperBound / 2,
      theoreticalVariance = (span / Math.sqrt(12)) ** 2;
    if (!Number.isFinite(theoreticalVariance))
      simpleError(
        "upperBound",
        "The theoretical variance must remain finite.",
        "numeric_overflow",
      );
    const random = createGeneratorRandom(input.seed, context),
      histogram = Array<number>(input.binCount).fill(0);
    const samples = Array.from({ length: input.count }, () => {
      const value = input.lowerBound + span * random.unit();
      if (
        !Number.isFinite(value) ||
        value < input.lowerBound ||
        value > input.upperBound
      )
        simpleError(
          "upperBound",
          "A floating-point sample left the declared finite interval.",
          "numeric_overflow",
        );
      const bin = Math.max(
        0,
        Math.min(
          input.binCount - 1,
          Math.floor(((value - input.lowerBound) / span) * input.binCount),
        ),
      );
      histogram[bin] += 1;
      return value;
    });
    const summary = calculatePopulationSummary(samples);
    if (summary === null)
      return simpleError(
        "upperBound",
        "Sample summary arithmetic must remain finite.",
        "numeric_overflow",
      );
    return toolSuccess({
      samples,
      histogram,
      summary,
      theoreticalMean,
      theoreticalVariance,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const monteCarloUniformExample = {
  input: {
    count: 5,
    lowerBound: -2,
    upperBound: 4,
    binCount: 3,
    seed: 42,
  },
  output: {
    samples: [
      1.6066225115209818, 0.68974335398525, 3.114794760942459,
      2.018404248636216, -0.9511166075244546,
    ],
    histogram: [1, 2, 2],
    summary: {
      count: 5,
      mean: 1.2956896535120905,
      variance: 1.86868966252351,
      standardDeviation: 1.3670002423275243,
    },
    theoreticalMean: 1,
    theoreticalVariance: 3.0000000000000004,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<MonteCarloUniformInput, MonteCarloUniformOutput>;
export const monteCarloUniformTool = createModelDefinition<
  MonteCarloUniformInput,
  MonteCarloUniformOutput
>({
  id: "random/monte-carlo-uniform",
  title: "Monte Carlo Uniform Distribution Experiment Tool",
  description:
    "Generate affine floating-point uniform interval samples, histogram counts and delegated population summaries alongside theoretical mean/variance; rounding may attain the upper endpoint and bins include it in the last cell.",
  inputSchema,
  outputSchema,
  execute: calculateMonteCarloUniform,
});
export const runMonteCarloUniform = monteCarloUniformTool.execute;
export default monteCarloUniformTool;
