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
import { sampleMultinomial } from "../../probability/advanced-samplers.js";
import { sampleNormalBoxMuller } from "../../probability/normal-box-muller-sampler/tool.js";
import { runExponentialSampler } from "../../probability/exponential-sampler/tool.js";
import {
  derivedExperimentSeed,
  experimentPositiveSchema,
} from "../statistical-experiment-construction.js";

export type MixtureExperimentComponent =
  | {
      readonly kind: "normal";
      readonly weight: number;
      readonly mean: number;
      readonly standardDeviation: number;
    }
  | {
      readonly kind: "exponential";
      readonly weight: number;
      readonly rate: number;
    };
export type MixtureDistributionExperimentInput = {
  readonly count: number;
  readonly components: readonly MixtureExperimentComponent[];
  readonly seed?: number;
};
export type MixtureDistributionExperimentOutput = {
  readonly countSamplerSeed: string;
  readonly components: readonly {
    readonly index: number;
    readonly parameters: MixtureExperimentComponent;
    readonly probability: number;
    readonly sampleCount: number;
    readonly samplerSeed: string;
  }[];
  readonly observations: readonly {
    readonly componentIndex: number;
    readonly value: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const normalSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", const: "normal" },
    weight: { type: "number", minimum: 0 },
    mean: { type: "number" },
    standardDeviation: { type: "number", minimum: 0 },
  },
  required: ["kind", "weight", "mean", "standardDeviation"],
} as const;
const exponentialSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", const: "exponential" },
    weight: { type: "number", minimum: 0 },
    rate: experimentPositiveSchema,
  },
  required: ["kind", "weight", "rate"],
} as const;
// Each discriminated branch rejects unknown fields; the union shell stays open.
const componentSchema = {
  type: "object",
  additionalProperties: true,
  anyOf: [normalSchema, exponentialSchema],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 2048 },
    components: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: componentSchema,
    },
    seed: generatorSeedSchema,
  },
  required: ["count", "components"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countSamplerSeed: { type: "string", minLength: 1 },
    components: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer", minimum: 0, maximum: 15 },
          parameters: componentSchema,
          probability: { type: "number", minimum: 0, maximum: 1 },
          sampleCount: { type: "integer", minimum: 0, maximum: 2048 },
          samplerSeed: { type: "string", minLength: 1 },
        },
        required: [
          "index",
          "parameters",
          "probability",
          "sampleCount",
          "samplerSeed",
        ],
      },
    },
    observations: {
      type: "array",
      minItems: 1,
      maxItems: 2048,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          componentIndex: { type: "integer", minimum: 0, maximum: 15 },
          value: { type: "number" },
        },
        required: ["componentIndex", "value"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["countSamplerSeed", "components", "observations", "randomness"],
} as const;

const isInput = (input: unknown): input is MixtureDistributionExperimentInput =>
  matchesModelInput(input, inputSchema);
export const calculateMixtureDistributionExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MixtureDistributionExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const largest = Math.max(
      ...input.components.map((component) => component.weight),
    );
    if (largest === 0)
      simpleError(
        "components",
        "At least one component must have positive weight.",
        "zero_total_weight",
      );
    const weights = input.components.map(
        (component) => component.weight / largest,
      ),
      total = weights.reduce((sum, weight) => sum + weight, 0);
    const active = weights
      .map((weight, index) => ({ weight, index }))
      .filter(({ weight }) => weight > 0);
    const random = createGeneratorRandom(input.seed, context),
      countSamplerSeed = derivedExperimentSeed(random, "mixture-counts");
    const drawnCounts = sampleMultinomial(
      active.map(({ weight }) => weight),
      input.count,
      1,
      countSamplerSeed,
    ).samples[0];
    const counts = Array<number>(input.components.length).fill(0);
    active.forEach(({ index }, i) => {
      counts[index] = drawnCounts[i];
    });
    const observations: { componentIndex: number; value: number }[] = [];
    const components = input.components.map((parameters, index) => {
      const samplerSeed = derivedExperimentSeed(
          random,
          "mixture-component-" + index,
        ),
        sampleCount = counts[index];
      if (sampleCount > 0) {
        let samples: readonly number[];
        if (parameters.kind === "normal") {
          const values = sampleNormalBoxMuller(
            parameters.mean,
            parameters.standardDeviation,
            sampleCount,
            samplerSeed,
          );
          if (values === null)
            return simpleError(
              "components",
              "A normal component could not produce finite observations.",
              "sampler_failed",
            );
          samples = values;
        } else {
          const result = runExponentialSampler({
            rate: parameters.rate,
            count: sampleCount,
            seed: samplerSeed,
          });
          if (!result.ok)
            return simpleError(
              "components",
              "An exponential component could not produce finite observations.",
              "sampler_failed",
            );
          samples = result.output.samples as readonly number[];
        }
        for (const value of samples)
          observations.push({ componentIndex: index, value });
      }
      return {
        index,
        parameters,
        probability: weights[index] / total,
        sampleCount,
        samplerSeed,
      };
    });
    return toolSuccess({
      countSamplerSeed,
      components,
      observations: random.shuffle(observations),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const mixtureDistributionExperimentExample = {
  input: {
    count: 5,
    components: [
      {
        kind: "normal",
        weight: 1,
        mean: 0,
        standardDeviation: 1,
      },
      {
        kind: "exponential",
        weight: 1,
        rate: 2,
      },
    ],
    seed: 42,
  },
  output: {
    countSamplerSeed: "mixture-counts:2581720956",
    components: [
      {
        index: 0,
        parameters: {
          kind: "normal",
          weight: 1,
          mean: 0,
          standardDeviation: 1,
        },
        probability: 0.5,
        sampleCount: 3,
        samplerSeed: "mixture-component-0:1925393290",
      },
      {
        index: 1,
        parameters: {
          kind: "exponential",
          weight: 1,
          rate: 2,
        },
        probability: 0.5,
        sampleCount: 2,
        samplerSeed: "mixture-component-1:3661312704",
      },
    ],
    observations: [
      {
        componentIndex: 0,
        value: 0.2703889241,
      },
      {
        componentIndex: 1,
        value: 0.37272969328403577,
      },
      {
        componentIndex: 0,
        value: 0.8889417657,
      },
      {
        componentIndex: 0,
        value: -0.3672253541,
      },
      {
        componentIndex: 1,
        value: 0.04164995389125125,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MixtureDistributionExperimentInput,
  MixtureDistributionExperimentOutput
>;
export const mixtureDistributionExperimentTool = createModelDefinition<
  MixtureDistributionExperimentInput,
  MixtureDistributionExperimentOutput
>({
  id: "random/mixture-distribution-experiment",
  title: "Random Mixture Distribution Experiment Generator",
  description:
    "Generate labeled observations from explicitly weighted normal/exponential components via multinomial counts, separate visible component sampler seeds, and a seeded shuffle; preserve normal sampler 10-significant-digit rounding and inherited endpoint clipping, without fitting or classifying real data.",
  inputSchema,
  outputSchema,
  execute: calculateMixtureDistributionExperiment,
});
export const runMixtureDistributionExperiment =
  mixtureDistributionExperimentTool.execute;
export default mixtureDistributionExperimentTool;
