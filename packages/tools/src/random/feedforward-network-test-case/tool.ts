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
  demonstrateFeedforwardNetwork,
  type Activation,
} from "../../neural-network/feedforward/tool.js";
import {
  generatedModelValueProperties,
  checkGeneratedModelRange,
  generatedModelScalar,
  generatedModelMatrix,
  type GeneratedModelValueRange,
} from "../model-array-construction.js";

export type FeedforwardNetworkTestCaseInput = GeneratedModelValueRange & {
  readonly layerSizes: readonly number[];
  readonly activations: readonly Activation[];
  readonly seed?: number;
};
export type GeneratedFeedforwardLayer = {
  readonly weights: readonly (readonly number[])[];
  readonly biases: readonly number[];
  readonly activation: Activation;
  readonly preActivation: readonly number[];
  readonly output: readonly number[];
};
export type FeedforwardNetworkTestCaseOutput = {
  readonly inputs: readonly number[];
  readonly layers: readonly GeneratedFeedforwardLayer[];
  readonly output: readonly number[];
  readonly randomness: GeneratorReplay;
};
const vectorSchema = {
  type: "array",
  minItems: 1,
  maxItems: 16,
  items: { type: "number" },
} as const;
const activationSchema = {
  type: "string",
  enum: ["linear", "relu", "sigmoid", "tanh"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...generatedModelValueProperties,
    layerSizes: {
      type: "array",
      minItems: 2,
      maxItems: 9,
      items: { type: "integer", minimum: 1, maximum: 16 },
    },
    activations: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: activationSchema,
    },
    seed: generatorSeedSchema,
  },
  required: [
    "minimumValue",
    "maximumValue",
    "valueDivisor",
    "layerSizes",
    "activations",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputs: vectorSchema,
    layers: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          weights: {
            type: "array",
            minItems: 1,
            maxItems: 16,
            items: vectorSchema,
          },
          biases: vectorSchema,
          activation: activationSchema,
          preActivation: vectorSchema,
          output: vectorSchema,
        },
        required: [
          "weights",
          "biases",
          "activation",
          "preActivation",
          "output",
        ],
      },
    },
    output: vectorSchema,
    randomness: generatorReplaySchema,
  },
  required: ["inputs", "layers", "output", "randomness"],
} as const;

const isInput = (input: unknown): input is FeedforwardNetworkTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateFeedforwardNetworkTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FeedforwardNetworkTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    checkGeneratedModelRange(input);
    if (input.activations.length !== input.layerSizes.length - 1)
      simpleError(
        "activations",
        "Choose exactly one supported activation per dense layer.",
        "activation_count_mismatch",
      );
    const random = createGeneratorRandom(input.seed, context),
      inputs = Array.from({ length: input.layerSizes[0] }, () =>
        generatedModelScalar(input, random),
      ),
      layers: GeneratedFeedforwardLayer[] = [];
    let previous: readonly number[] = inputs;
    for (let layer = 0; layer < input.activations.length; layer += 1) {
      const width = input.layerSizes[layer + 1],
        weights = generatedModelMatrix(width, previous.length, input, random),
        biases = Array.from({ length: width }, () =>
          generatedModelScalar(input, random),
        ),
        activation = input.activations[layer];
      const result = demonstrateFeedforwardNetwork(
        previous,
        weights,
        biases,
        activation,
      );
      if (result === null)
        throw new Error(
          "Generated matching dense-layer shapes were rejected by the feedforward core.",
        );
      if (![...result.preActivation, ...result.output].every(Number.isFinite))
        simpleError(
          "valueDivisor",
          "A delegated dense-layer result is outside the finite numeric range.",
          "numeric_overflow",
        );
      layers.push({
        weights,
        biases,
        activation,
        preActivation: result.preActivation,
        output: result.output,
      });
      previous = result.output;
    }
    return toolSuccess({
      inputs,
      layers,
      output: previous,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const feedforwardNetworkTestCaseExample = {
  input: {
    minimumValue: -3,
    maximumValue: 3,
    valueDivisor: 1,
    layerSizes: [3, 2, 1],
    activations: ["relu", "linear"],
    seed: 42,
  },
  output: {
    inputs: [1, 0, 2],
    layers: [
      {
        weights: [
          [1, -2, 0],
          [-2, 1, 3],
        ],
        biases: [0, -2],
        activation: "relu",
        preActivation: [1, 2],
        output: [1, 2],
      },
      {
        weights: [[3, 2]],
        biases: [-1],
        activation: "linear",
        preActivation: [6],
        output: [6],
      },
    ],
    output: [6],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FeedforwardNetworkTestCaseInput,
  FeedforwardNetworkTestCaseOutput
>;
export const feedforwardNetworkTestCaseTool = createModelDefinition<
  FeedforwardNetworkTestCaseInput,
  FeedforwardNetworkTestCaseOutput
>({
  id: "random/feedforward-network-test-case",
  title: "Random Feedforward Network Test Case Generator",
  description:
    "Generate finite quantized inputs, dense weights, and biases for supplied small layer sizes/activations and compose the existing one-layer feedforward core; retain each layer's 10-significant-digit preactivations/outputs, propagating those rounded outputs to the next layer, with no training or accuracy claims.",
  inputSchema,
  outputSchema,
  execute: calculateFeedforwardNetworkTestCase,
});
export const runFeedforwardNetworkTestCase =
  feedforwardNetworkTestCaseTool.execute;
export default feedforwardNetworkTestCaseTool;
