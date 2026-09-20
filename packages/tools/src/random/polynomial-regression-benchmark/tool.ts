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
import { calculateEvaluatePolynomial } from "../../algebra/evaluate-polynomial/tool.js";
import {
  calculatePolynomialRegression,
  polynomialRegressionTool,
  type PolynomialRegressionOutput,
} from "../../regression/polynomial/tool.js";
import { SimpleToolError } from "../../core/simple.js";
import { generatedPredictorGrid } from "../regression-benchmark-construction.js";
import { drawSyntheticNormal } from "../synthetic-normal-construction.js";

export type PolynomialRegressionBenchmarkInput = {
  readonly coefficients: readonly number[];
  readonly count: number;
  readonly minimumX: number;
  readonly maximumX: number;
  readonly noiseStandardDeviation: number;
  readonly fittingDegrees: readonly number[];
  readonly seed?: number;
};
export type PolynomialRegressionBenchmarkOutput = {
  readonly model: {
    readonly coefficientsAscending: readonly number[];
    readonly noiseStandardDeviation: number;
  };
  readonly observations: readonly {
    readonly x: number;
    readonly target: number;
    readonly observed: number;
  }[];
  readonly fits: readonly {
    readonly degree: number;
    readonly status: "finite" | "singular" | "numeric-overflow";
    readonly result: PolynomialRegressionOutput | null;
    readonly predictions: readonly number[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: {
      type: "array",
      minItems: 1,
      maxItems: 7,
      items: { type: "number" },
      description: "Generating coefficients in ascending powers c0..cd.",
    },
    count: { type: "integer", minimum: 2, maximum: 1024 },
    minimumX: { type: "number" },
    maximumX: { type: "number" },
    noiseStandardDeviation: { type: "number", minimum: 0 },
    fittingDegrees: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: { type: "integer", minimum: 1, maximum: 6 },
    },
    seed: generatorSeedSchema,
  },
  required: [
    "coefficients",
    "count",
    "minimumX",
    "maximumX",
    "noiseStandardDeviation",
    "fittingDegrees",
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
        coefficientsAscending: inputSchema.properties.coefficients,
        noiseStandardDeviation: { type: "number", minimum: 0 },
      },
      required: ["coefficientsAscending", "noiseStandardDeviation"],
    },
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
    fits: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: { type: "integer", minimum: 1, maximum: 6 },
          status: {
            type: "string",
            enum: ["finite", "singular", "numeric-overflow"],
          },
          result: {
            anyOf: [polynomialRegressionTool.outputSchema, { type: "null" }],
          },
          predictions: {
            type: "array",
            maxItems: 1024,
            items: { type: "number" },
          },
        },
        required: ["degree", "status", "result", "predictions"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["model", "observations", "fits", "randomness"],
} as const;

const isInput = (input: unknown): input is PolynomialRegressionBenchmarkInput =>
  matchesModelInput(input, inputSchema);
export const calculatePolynomialRegressionBenchmark = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PolynomialRegressionBenchmarkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.fittingDegrees).size !== input.fittingDegrees.length)
      simpleError(
        "fittingDegrees",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    if (input.fittingDegrees.some((degree) => degree >= input.count))
      simpleError(
        "count",
        "Every requested degree requires at least degree+1 observations.",
        "insufficient_points",
      );
    const xs = generatedPredictorGrid(
        input.count,
        input.minimumX,
        input.maximumX,
      ),
      highestFirst = [...input.coefficients].reverse(),
      random = createGeneratorRandom(input.seed, context);
    const observations = xs.map((x) => {
      const target = calculateEvaluatePolynomial({
        coefficients: highestFirst,
        x,
      }).value;
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
    const ys = observations.map((point) => point.observed);
    const fits = input.fittingDegrees.map(
      (degree): PolynomialRegressionBenchmarkOutput["fits"][number] => {
        try {
          const result = calculatePolynomialRegression({
            degree,
            x: xs,
            y: ys,
          });
          if (![...result.coefficients, result.rSquared].every(Number.isFinite))
            return {
              degree,
              status: "numeric-overflow",
              result: null,
              predictions: [],
            };
          const predictions = xs.map(
            (x) =>
              calculateEvaluatePolynomial({
                coefficients: [...result.coefficients].reverse(),
                x,
              }).value,
          );
          return { degree, status: "finite", result, predictions };
        } catch (error) {
          if (
            error instanceof SimpleToolError &&
            error.code === "singular_matrix"
          )
            return {
              degree,
              status: "singular",
              result: null,
              predictions: [],
            };
          if (
            error instanceof SimpleToolError &&
            error.code === "result_not_finite"
          )
            return {
              degree,
              status: "numeric-overflow",
              result: null,
              predictions: [],
            };
          throw error;
        }
      },
    );
    return toolSuccess({
      model: {
        coefficientsAscending: input.coefficients,
        noiseStandardDeviation: input.noiseStandardDeviation,
      },
      observations,
      fits,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const polynomialRegressionBenchmarkExample = {
  input: {
    coefficients: [0, 0, 1],
    count: 3,
    minimumX: -1,
    maximumX: 1,
    noiseStandardDeviation: 0,
    fittingDegrees: [1, 2],
    seed: 42,
  },
  output: {
    model: {
      coefficientsAscending: [0, 0, 1],
      noiseStandardDeviation: 0,
    },
    observations: [
      {
        x: -1,
        target: 1,
        observed: 1,
      },
      {
        x: 0,
        target: 0,
        observed: 0,
      },
      {
        x: 1,
        target: 1,
        observed: 1,
      },
    ],
    fits: [
      {
        degree: 1,
        status: "finite",
        result: {
          coefficients: [0.6666666666666666, 0],
          rSquared: 0,
        },
        predictions: [
          0.6666666666666666, 0.6666666666666666, 0.6666666666666666,
        ],
      },
      {
        degree: 2,
        status: "finite",
        result: {
          coefficients: [0, 0, 1],
          rSquared: 1,
        },
        predictions: [1, 0, 1],
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  PolynomialRegressionBenchmarkInput,
  PolynomialRegressionBenchmarkOutput
>;
export const polynomialRegressionBenchmarkTool = createModelDefinition<
  PolynomialRegressionBenchmarkInput,
  PolynomialRegressionBenchmarkOutput
>({
  id: "random/polynomial-regression-benchmark",
  title: "Random Polynomial Regression Benchmark Generator",
  description:
    "Generate known ascending-coefficient polynomial targets on a bounded evenly spaced grid, add seeded normal noise, and delegate separate requested degree-1–6 normal-equation fits and predictions; reverse coefficients only at the highest-first evaluator boundary, retain singular/nonfinite fit outcomes, and make no exact-solver or stability guarantee.",
  inputSchema,
  outputSchema,
  execute: calculatePolynomialRegressionBenchmark,
});
export const runPolynomialRegressionBenchmark =
  polynomialRegressionBenchmarkTool.execute;
export default polynomialRegressionBenchmarkTool;
