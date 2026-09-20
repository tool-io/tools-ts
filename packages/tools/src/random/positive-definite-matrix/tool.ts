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
import { runTranspose } from "../../matrix/transpose/tool.js";
import { calculateMultiply } from "../../matrix/multiply/tool.js";
import { orderedInstanceRange } from "../optimization-instance-integers.js";
import { runIdentity } from "../../matrix/identity/tool.js";
import { runAdd } from "../../matrix/add/tool.js";
import { calculateCholeskyDecomposition } from "../../matrix/cholesky-decomposition/tool.js";
import { SimpleToolError } from "../../core/simple.js";

export type PositiveDefiniteMatrixInput = {
  readonly size: number;
  readonly minimumInteger: number;
  readonly maximumInteger: number;
  readonly diagonalShift: number;
  readonly seed?: number;
};
export type PositiveDefiniteMatrixOutput = {
  readonly source: readonly (readonly number[])[];
  readonly matrix: readonly (readonly number[])[];
  readonly lower: readonly (readonly number[])[];
  readonly relativeReconstructionError: number;
  readonly randomness: GeneratorReplay;
};
const squareMatrix = {
  type: "array",
  minItems: 1,
  maxItems: 16,
  items: {
    type: "array",
    minItems: 1,
    maxItems: 16,
    items: { type: "number" },
  },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    size: { type: "integer", minimum: 1, maximum: 16 },
    minimumInteger: { type: "integer" },
    maximumInteger: { type: "integer" },
    diagonalShift: { type: "number", exclusiveMinimum: 0 },
    seed: generatorSeedSchema,
  },
  required: ["size", "minimumInteger", "maximumInteger", "diagonalShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: squareMatrix,
    matrix: squareMatrix,
    lower: squareMatrix,
    relativeReconstructionError: { type: "number", minimum: 0 },
    randomness: generatorReplaySchema,
  },
  required: [
    "source",
    "matrix",
    "lower",
    "relativeReconstructionError",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is PositiveDefiniteMatrixInput =>
  matchesModelInput(input, inputSchema);
export const calculatePositiveDefiniteMatrix = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PositiveDefiniteMatrixOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumInteger,
      input.maximumInteger,
      "maximumInteger",
    );
    const random = createGeneratorRandom(input.seed, context),
      source = Array.from({ length: input.size }, () =>
        Array.from({ length: input.size }, () =>
          random.integer(input.minimumInteger, input.maximumInteger),
        ),
      );
    const transposed = runTranspose({ matrix: source }),
      identity = runIdentity({ size: input.size });
    if (!transposed.ok || !identity.ok)
      throw new Error(
        "Validated square dimensions were rejected by matrix construction.",
      );
    const gram = calculateMultiply({
      first: transposed.output.matrix,
      second: source,
    }).product;
    const shiftedIdentity = identity.output.matrix.map((row) =>
      row.map((value) => value * input.diagonalShift),
    );
    const added = runAdd({ first: gram, second: shiftedIdentity });
    if (!added.ok)
      return simpleError(
        "diagonalShift",
        "The shifted Gram matrix cannot be represented by the existing matrix core.",
        "numeric_overflow",
      );
    const matrix = added.output.matrix;
    if (matrix.some((row, i) => row[i] <= gram[i][i]))
      return simpleError(
        "diagonalShift",
        "The positive shift disappeared at floating-point precision; increase the shift or reduce the source scale.",
        "numerical_cholesky_failure",
      );
    if (!matrix.flat().every(Number.isFinite))
      simpleError(
        "diagonalShift",
        "Matrix entries must remain finite.",
        "numeric_overflow",
      );
    const factor = (): readonly (readonly number[])[] => {
      try {
        return calculateCholeskyDecomposition({ matrix, tolerance: 0 }).lower;
      } catch (error) {
        if (error instanceof SimpleToolError)
          return simpleError(
            "diagonalShift",
            "The shifted matrix failed Cholesky at floating-point precision; increase the shift or reduce the source scale.",
            "numerical_cholesky_failure",
          );
        throw error;
      }
    };
    const lower = factor(),
      lowerTranspose = runTranspose({ matrix: lower });
    if (!lowerTranspose.ok)
      throw new Error("Cholesky returned an invalid matrix.");
    const reconstructed = calculateMultiply({
      first: lower,
      second: lowerTranspose.output.matrix,
    }).product;
    const scale = Math.max(...matrix.flat().map(Math.abs));
    const relativeReconstructionError = Math.max(
      ...reconstructed.flatMap((row, i) =>
        row.map((value, j) => Math.abs(value / scale - matrix[i][j] / scale)),
      ),
    );
    if (![...lower.flat(), relativeReconstructionError].every(Number.isFinite))
      simpleError(
        "diagonalShift",
        "Finite Cholesky and reconstruction evidence is required.",
        "numeric_overflow",
      );
    return toolSuccess({
      source,
      matrix,
      lower,
      relativeReconstructionError,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const positiveDefiniteMatrixExample = {
  input: {
    size: 2,
    minimumInteger: -2,
    maximumInteger: 3,
    diagonalShift: 2,
    seed: 42,
  },
  output: {
    source: [
      [1, 0],
      [3, 2],
    ],
    matrix: [
      [12, 6],
      [6, 6],
    ],
    lower: [
      [3.4641016151377544, 0],
      [1.7320508075688774, 1.7320508075688772],
    ],
    relativeReconstructionError: 1.1102230246251565e-16,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  PositiveDefiniteMatrixInput,
  PositiveDefiniteMatrixOutput
>;
export const positiveDefiniteMatrixTool = createModelDefinition<
  PositiveDefiniteMatrixInput,
  PositiveDefiniteMatrixOutput
>({
  id: "random/positive-definite-matrix",
  title: "Random Positive-Definite Matrix Generator",
  description:
    "Generate an integer matrix A and construct A-transpose A plus a supplied positive diagonal shift using existing matrix tools, then verify Cholesky and report a relative reconstruction residual; shifts lost to floating-point conditioning return a structured failure.",
  inputSchema,
  outputSchema,
  execute: calculatePositiveDefiniteMatrix,
});
export const runPositiveDefiniteMatrix = positiveDefiniteMatrixTool.execute;
export default positiveDefiniteMatrixTool;
