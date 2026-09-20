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
} from "../../random/generator-random.js";
import { randomNormal } from "../normal-box-muller-sampler/tool.js";
import { calculate as chooseWeighted } from "../../random/weighted-item/tool.js";

export type GaussianMixtureSamplerInput = {
  readonly count: number;
  readonly components: readonly {
    readonly weight: number;
    readonly mean: number;
    readonly standardDeviation: number;
  }[];
  readonly seed?: number;
};
export type GaussianMixtureSamplerOutput = {
  readonly samples: readonly number[];
  readonly componentIndices: readonly number[];
  readonly componentProbabilities: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 4096 },
    components: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          weight: { type: "number", minimum: 0 },
          mean: { type: "number" },
          standardDeviation: { type: "number", minimum: 0 },
        },
        required: ["weight", "mean", "standardDeviation"],
      },
    },
    seed: generatorSeedSchema,
  },
  required: ["count", "components"],
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
    componentIndices: {
      type: "array",
      minItems: 1,
      maxItems: 4096,
      items: { type: "integer", minimum: 0, maximum: 15 },
    },
    componentProbabilities: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "number", minimum: 0, maximum: 1 },
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "samples",
    "componentIndices",
    "componentProbabilities",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is GaussianMixtureSamplerInput =>
  matchesModelInput(input, inputSchema);
export const calculateGaussianMixtureSampler = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GaussianMixtureSamplerOutput> => {
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
      total = weights.reduce((a, b) => a + b, 0);
    const componentProbabilities = weights.map((weight) => weight / total),
      labels = weights.map((_, i) => String(i));
    const random = createGeneratorRandom(input.seed, context),
      samples: number[] = [],
      componentIndices: number[] = [];
    for (let i = 0; i < input.count; i += 1) {
      const selected = chooseWeighted(
        {
          seed: "advancing-mixture-source",
          actualCandidateValues: labels,
          callerActualNonnegativeWeights: weights,
        },
        { random: random.unit },
      );
      const label = selected.result.selectedValue;
      if (typeof label !== "string")
        throw new Error("Weighted-item core returned a nonstring label.");
      const componentIndex = labels.indexOf(label);
      if (componentIndex < 0)
        throw new Error("Weighted-item core returned an unknown label.");
      const normal = randomNormal(random.unit);
      if (normal === null)
        throw new Error(
          "Validated unit draws could not generate a finite standard normal.",
        );
      const component = input.components[componentIndex],
        sample = component.mean + component.standardDeviation * normal;
      if (!Number.isFinite(sample))
        simpleError(
          "components",
          "A generated component sample is not finite.",
          "numeric_overflow",
        );
      samples.push(sample);
      componentIndices.push(componentIndex);
    }
    return toolSuccess({
      samples,
      componentIndices,
      componentProbabilities,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const gaussianMixtureSamplerExample = {
  input: {
    count: 4,
    components: [
      {
        weight: 2,
        mean: 0,
        standardDeviation: 1,
      },
      {
        weight: 1,
        mean: 10,
        standardDeviation: 0.5,
      },
    ],
    seed: 42,
  },
  output: {
    samples: [
      0.7603579045861287, 9.079186407608201, 0.6436137875717839,
      1.2285906730631042,
    ],
    componentIndices: [0, 1, 0, 0],
    componentProbabilities: [0.6666666666666666, 0.3333333333333333],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  GaussianMixtureSamplerInput,
  GaussianMixtureSamplerOutput
>;
export const gaussianMixtureSamplerTool = createModelDefinition<
  GaussianMixtureSamplerInput,
  GaussianMixtureSamplerOutput
>({
  id: "probability/gaussian-mixture-sampler",
  title: "Gaussian Mixture Model Sampler Tool",
  description:
    "Draw labeled samples from supplied univariate Gaussian components using the weighted-item and Box–Muller cores, with scaled weights and the normal core's epsilon-clipped zero-draw convention; no model fitting.",
  inputSchema,
  outputSchema,
  execute: calculateGaussianMixtureSampler,
});
export const runGaussianMixtureSampler = gaussianMixtureSamplerTool.execute;
export default gaussianMixtureSamplerTool;
