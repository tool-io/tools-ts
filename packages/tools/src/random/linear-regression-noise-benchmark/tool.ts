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
  calculateLinear,
  linearTool,
  type LinearOutput,
} from "../../regression/linear/tool.js";
import { generatedPredictorGrid } from "../regression-benchmark-construction.js";
import { drawSyntheticNormal } from "../synthetic-normal-construction.js";

export type LinearRegressionNoiseBenchmarkInput = {
  readonly count: number;
  readonly minimumX: number;
  readonly maximumX: number;
  readonly intercept: number;
  readonly slope: number;
  readonly noiseStandardDeviation: number;
  readonly seed?: number;
};
export type LinearRegressionNoiseBenchmarkOutput = {
  readonly model: {
    readonly intercept: number;
    readonly slope: number;
    readonly noiseStandardDeviation: number;
  };
  readonly observations: readonly {
    readonly x: number;
    readonly target: number;
    readonly observed: number;
  }[];
  readonly fit: {
    readonly status: "finite" | "numeric-overflow";
    readonly result: LinearOutput | null;
    readonly predictions: readonly number[];
  };
  readonly randomness: GeneratorReplay;
};
const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intercept: { type: "number" },
    slope: { type: "number" },
    noiseStandardDeviation: { type: "number", minimum: 0 },
  },
  required: ["intercept", "slope", "noiseStandardDeviation"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...modelSchema.properties,
    count: { type: "integer", minimum: 2, maximum: 1024 },
    minimumX: { type: "number" },
    maximumX: { type: "number" },
    seed: generatorSeedSchema,
  },
  required: [...modelSchema.required, "count", "minimumX", "maximumX"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: modelSchema,
    observations: {
      type: "array",
      minItems: 2,
      maxItems: 1024,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number" },
          target: { type: "number" },
          observed: { type: "number" },
        },
        required: ["x", "target", "observed"],
      },
    },
    fit: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["finite", "numeric-overflow"] },
        result: { anyOf: [linearTool.outputSchema, { type: "null" }] },
        predictions: {
          type: "array",
          maxItems: 1024,
          items: { type: "number" },
        },
      },
      required: ["status", "result", "predictions"],
    },
    randomness: generatorReplaySchema,
  },
  required: ["model", "observations", "fit", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is LinearRegressionNoiseBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateLinearRegressionNoiseBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<LinearRegressionNoiseBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const xs = generatedPredictorGrid(
      input.count,
      input.minimumX,
      input.maximumX,
    );
    const random = createGeneratorRandom(input.seed, context);
    const observations = xs.map((x) => {
      const target = input.intercept + input.slope * x;
      if (!Number.isFinite(target))
        simpleError(
          "slope",
          "A generating-line calculation overflowed.",
          "numeric_overflow",
        );
      return {
        x,
        target,
        observed: drawSyntheticNormal(
          target,
          input.noiseStandardDeviation,
          random,
          "noiseStandardDeviation",
        ),
      };
    });
    const result = calculateLinear({
      x: xs,
      y: observations.map((observation) => observation.observed),
    });
    let fit: LinearRegressionNoiseBenchmarkOutput["fit"] = {
      status: "numeric-overflow",
      result: null,
      predictions: [],
    };
    if (Object.values(result).every(Number.isFinite)) {
      const predictions = xs.map((x) => result.intercept + result.slope * x);
      if (predictions.every(Number.isFinite))
        fit = { status: "finite", result, predictions };
    }
    return toolSuccess({
      model: {
        intercept: input.intercept,
        slope: input.slope,
        noiseStandardDeviation: input.noiseStandardDeviation,
      },
      observations,
      fit,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const linearRegressionNoiseBenchmarkExample = {
  input: {
    count: 4,
    minimumX: 0,
    maximumX: 3,
    intercept: 1,
    slope: 2,
    noiseStandardDeviation: 1,
    seed: 42,
  },
  output: {
    model: {
      intercept: 1,
      slope: 2,
      noiseStandardDeviation: 1,
    },
    observations: [
      {
        x: 0,
        target: 1,
        observed: 0.043837770615851035,
      },
      {
        x: 1,
        target: 3,
        observed: 2.7269738951173896,
      },
      {
        x: 2,
        target: 5,
        observed: 3.1583728152164032,
      },
      {
        x: 3,
        target: 7,
        observed: 5.859117929045976,
      },
    ],
    fit: {
      status: "finite",
      result: {
        intercept: 0.26548969319,
        slope: 1.78772393954,
        rSquared: 0.939883837957,
      },
      predictions: [0.26548969319, 2.05321363273, 3.84093757227, 5.62866151181],
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  LinearRegressionNoiseBenchmarkInput,
  LinearRegressionNoiseBenchmarkOutput
>;
export const linearRegressionNoiseBenchmarkTool = createModelDefinition<
  LinearRegressionNoiseBenchmarkInput,
  LinearRegressionNoiseBenchmarkOutput
>({
  id: "random/linear-regression-noise-benchmark",
  title: "Random Linear Regression Noise Benchmark Generator",
  description:
    "Generate an evenly spaced predictor grid, known straight-line targets and seeded normal response noise, then delegate ordinary least squares and predictions from its 12-significant-digit coefficients; retain numeric-overflow fit status rather than claiming parameter recovery, statistical significance, or real-data accuracy.",
  inputSchema,
  outputSchema,
  execute: calculateLinearRegressionNoiseBenchmark,
});
export const runLinearRegressionNoiseBenchmark =
  linearRegressionNoiseBenchmarkTool.execute;
export default linearRegressionNoiseBenchmarkTool;
