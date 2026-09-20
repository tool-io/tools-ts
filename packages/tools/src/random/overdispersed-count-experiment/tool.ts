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
import { sampleBinomial } from "../../probability/binomial-sampler/tool.js";
import { sampleBetaBinomial } from "../../probability/beta-binomial-sampler/tool.js";
import { calculatePopulationVariance } from "../../statistics/variance/tool.js";
import {
  derivedExperimentSeed,
  experimentPositiveSchema,
  experimentPopulationSummary,
} from "../statistical-experiment-construction.js";

export type OverdispersedCountExperimentInput = {
  readonly trials: number;
  readonly alpha: number;
  readonly beta: number;
  readonly count: number;
  readonly seed?: number;
};
export type OverdispersedCountBatch = {
  readonly samplerSeed: string;
  readonly samples: readonly number[];
  readonly observedMean: number;
  readonly observedVariance: number;
  readonly theoreticalVariance: number;
};
export type OverdispersedCountExperimentOutput = {
  readonly model: {
    readonly trials: number;
    readonly alpha: number;
    readonly beta: number;
    readonly meanProbability: number;
    readonly theoreticalMean: number;
  };
  readonly binomial: OverdispersedCountBatch;
  readonly betaBinomial: OverdispersedCountBatch;
  readonly randomness: GeneratorReplay;
};
const batchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplerSeed: { type: "string", minLength: 1 },
    samples: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: { type: "integer", minimum: 0 },
    },
    observedMean: { type: "number", minimum: 0 },
    observedVariance: { type: "number", minimum: 0 },
    theoreticalVariance: { type: "number", minimum: 0 },
  },
  required: [
    "samplerSeed",
    "samples",
    "observedMean",
    "observedVariance",
    "theoreticalVariance",
  ],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trials: { type: "integer", minimum: 0, maximum: 1000000 },
    alpha: experimentPositiveSchema,
    beta: experimentPositiveSchema,
    count: { type: "integer", minimum: 1, maximum: 512 },
    seed: generatorSeedSchema,
  },
  required: ["trials", "alpha", "beta", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: {
      type: "object",
      additionalProperties: false,
      properties: {
        trials: { type: "integer", minimum: 0 },
        alpha: experimentPositiveSchema,
        beta: experimentPositiveSchema,
        meanProbability: { type: "number", minimum: 0, maximum: 1 },
        theoreticalMean: { type: "number", minimum: 0 },
      },
      required: [
        "trials",
        "alpha",
        "beta",
        "meanProbability",
        "theoreticalMean",
      ],
    },
    binomial: batchSchema,
    betaBinomial: batchSchema,
    randomness: generatorReplaySchema,
  },
  required: ["model", "binomial", "betaBinomial", "randomness"],
} as const;

const isInput = (input: unknown): input is OverdispersedCountExperimentInput =>
  matchesModelInput(input, inputSchema);
export const calculateOverdispersedCountExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<OverdispersedCountExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.trials * input.count > 1000000)
      simpleError(
        "count",
        "Each batch is limited to one million Bernoulli trial iterations.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      binomialSeed = derivedExperimentSeed(random, "binomial"),
      betaSeed = derivedExperimentSeed(random, "beta-binomial");
    const scale = Math.max(input.alpha, input.beta),
      a = input.alpha / scale,
      b = input.beta / scale,
      meanProbability = a / (a + b);
    const ordinary = sampleBinomial(
        input.trials,
        meanProbability,
        input.count,
        binomialSeed,
      ),
      dispersed = sampleBetaBinomial(
        input.trials,
        input.alpha,
        input.beta,
        input.count,
        betaSeed,
      );
    if (ordinary === null || dispersed === null)
      return simpleError(
        "alpha",
        "The existing sampler could not realize the requested parameters within its numerical/rejection limits.",
        "sampler_failed",
      );
    const binomialVariance =
      input.trials * meanProbability * (1 - meanProbability);
    const dispersionFactor =
      input.trials === 0
        ? 1
        : 1 + (input.trials - 1) / (input.alpha + input.beta + 1);
    const makeBatch = (
      samples: readonly number[],
      samplerSeed: string,
      theoreticalVariance: number,
    ): OverdispersedCountBatch => {
      const observedVariance = calculatePopulationVariance(samples);
      if (observedVariance === null)
        throw new Error(
          "Bounded count samples were rejected by the variance core.",
        );
      return {
        samplerSeed,
        samples,
        observedMean: experimentPopulationSummary(samples, "count").mean,
        observedVariance,
        theoreticalVariance,
      };
    };
    return toolSuccess({
      model: {
        trials: input.trials,
        alpha: input.alpha,
        beta: input.beta,
        meanProbability,
        theoreticalMean: input.trials * meanProbability,
      },
      binomial: makeBatch(ordinary, binomialSeed, binomialVariance),
      betaBinomial: makeBatch(
        dispersed,
        betaSeed,
        binomialVariance * dispersionFactor,
      ),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const overdispersedCountExperimentExample = {
  input: {
    trials: 6,
    alpha: 2,
    beta: 2,
    count: 4,
    seed: 42,
  },
  output: {
    model: {
      trials: 6,
      alpha: 2,
      beta: 2,
      meanProbability: 0.5,
      theoreticalMean: 3,
    },
    binomial: {
      samplerSeed: "binomial:2581720956",
      samples: [2, 5, 2, 0],
      observedMean: 2.25,
      observedVariance: 3.1875,
      theoreticalVariance: 1.5,
    },
    betaBinomial: {
      samplerSeed: "beta-binomial:1925393290",
      samples: [5, 6, 0, 3],
      observedMean: 3.5,
      observedVariance: 5.25,
      theoreticalVariance: 3,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  OverdispersedCountExperimentInput,
  OverdispersedCountExperimentOutput
>;
export const overdispersedCountExperimentTool = createModelDefinition<
  OverdispersedCountExperimentInput,
  OverdispersedCountExperimentOutput
>({
  id: "random/overdispersed-count-experiment",
  title: "Random Overdispersed Count Experiment Generator",
  description:
    "Compare equal-size binomial and beta-binomial batches at the same beta-derived mean probability, using visible derived string-seeded sampler substreams; report observed population means/variances and theoretical variances, without claiming every realized batch is more dispersed or fitting real data.",
  inputSchema,
  outputSchema,
  execute: calculateOverdispersedCountExperiment,
});
export const runOverdispersedCountExperiment =
  overdispersedCountExperimentTool.execute;
export default overdispersedCountExperimentTool;
