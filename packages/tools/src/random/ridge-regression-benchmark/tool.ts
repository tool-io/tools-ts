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
  calculateLinearRegressionNoiseBenchmark,
  inputSchema as datasetInputSchema,
  outputSchema as datasetOutputSchema,
  type LinearRegressionNoiseBenchmarkInput,
  type LinearRegressionNoiseBenchmarkOutput,
} from "../linear-regression-noise-benchmark/tool.js";
import {
  fitRidgeRegression,
  type RidgeRegressionModel,
} from "../../regression/ridge/tool.js";

export type RidgeRegressionBenchmarkInput =
  LinearRegressionNoiseBenchmarkInput & { readonly lambdas: readonly number[] };
export type RidgeRegressionBenchmarkOutput = {
  readonly model: LinearRegressionNoiseBenchmarkOutput["model"];
  readonly observations: LinearRegressionNoiseBenchmarkOutput["observations"];
  readonly ordinaryLeastSquares: LinearRegressionNoiseBenchmarkOutput["fit"];
  readonly ridge: readonly {
    readonly lambda: number;
    readonly status: "finite" | "not-finite";
    readonly result: RidgeRegressionModel | null;
  }[];
  readonly randomness: GeneratorReplay;
};
const ridgeModelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lambda: { type: "number", minimum: 0 },
    intercept: { type: "number" },
    slope: { type: "number" },
    predictions: {
      type: "array",
      minItems: 2,
      maxItems: 1024,
      items: { type: "number" },
    },
  },
  required: ["lambda", "intercept", "slope", "predictions"],
} as const;
export const inputSchema = {
  ...datasetInputSchema,
  properties: {
    ...datasetInputSchema.properties,
    lambdas: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "number", minimum: 0 },
    },
  },
  required: [...datasetInputSchema.required, "lambdas"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: datasetOutputSchema.properties.model,
    observations: datasetOutputSchema.properties.observations,
    ordinaryLeastSquares: datasetOutputSchema.properties.fit,
    ridge: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          lambda: { type: "number", minimum: 0 },
          status: { type: "string", enum: ["finite", "not-finite"] },
          result: { anyOf: [ridgeModelSchema, { type: "null" }] },
        },
        required: ["lambda", "status", "result"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "model",
    "observations",
    "ordinaryLeastSquares",
    "ridge",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is RidgeRegressionBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculateRidgeRegressionBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RidgeRegressionBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.lambdas).size !== input.lambdas.length)
      simpleError("lambdas", "Entries must be distinct.", "duplicate_entries");
    const { lambdas, ...datasetInput } = input;
    const generated = calculateLinearRegressionNoiseBenchmark(
      datasetInput,
      context,
    );
    if (!generated.ok) return generated;
    const dataset = generated.output,
      xs = dataset.observations.map((point) => point.x),
      ys = dataset.observations.map((point) => point.observed);
    const ridge: RidgeRegressionBenchmarkOutput["ridge"] = lambdas.map(
      (lambda) => {
        const result = fitRidgeRegression(xs, ys, lambda);
        if (
          result === null ||
          ![result.intercept, result.slope, ...result.predictions].every(
            Number.isFinite,
          )
        )
          return { lambda, status: "not-finite" as const, result: null };
        return { lambda, status: "finite" as const, result };
      },
    );
    return toolSuccess({
      model: dataset.model,
      observations: dataset.observations,
      ordinaryLeastSquares: dataset.fit,
      ridge,
      randomness: dataset.randomness,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const ridgeRegressionBenchmarkExample = {
  input: {
    count: 4,
    minimumX: 0,
    maximumX: 3,
    intercept: 1,
    slope: 2,
    noiseStandardDeviation: 1,
    lambdas: [0, 5],
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
    ordinaryLeastSquares: {
      status: "finite",
      result: {
        intercept: 0.26548969319,
        slope: 1.78772393954,
        rSquared: 0.939883837957,
      },
      predictions: [0.26548969319, 2.05321363273, 3.84093757227, 5.62866151181],
    },
    ridge: [
      {
        lambda: 0,
        status: "finite",
        result: {
          lambda: 0,
          intercept: 0.2654896932,
          slope: 1.78772394,
          predictions: [0.2654896932, 2.053213633, 3.840937572, 5.628661512],
        },
      },
      {
        lambda: 5,
        status: "finite",
        result: {
          lambda: 5,
          intercept: 1.606282648,
          slope: 0.8938619698,
          predictions: [1.606282648, 2.500144618, 3.394006587, 4.287868557],
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  RidgeRegressionBenchmarkInput,
  RidgeRegressionBenchmarkOutput
>;
export const ridgeRegressionBenchmarkTool = createModelDefinition<
  RidgeRegressionBenchmarkInput,
  RidgeRegressionBenchmarkOutput
>({
  id: "random/ridge-regression-benchmark",
  title: "Random Ridge Regression Benchmark Generator",
  description:
    "Reuse the random linear-noise dataset generator once, then fit separate supplied ridge penalties with an unpenalized intercept alongside its OLS baseline; preserve the ridge core's 10-significant-digit coefficients/predictions (predictions use unrounded internal coefficients), and report nonfinite fits without training-quality claims.",
  inputSchema,
  outputSchema,
  execute: calculateRidgeRegressionBenchmark,
});
export const runRidgeRegressionBenchmark = ridgeRegressionBenchmarkTool.execute;
export default ridgeRegressionBenchmarkTool;
