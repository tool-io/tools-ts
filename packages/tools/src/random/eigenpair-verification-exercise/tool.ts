import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import { calculateMultiply } from "../../matrix/multiply/tool.js";

export type EigenpairVerificationExerciseInput = {
  readonly minimum: number;
  readonly maximum: number;
  readonly invalidProbability: number;
  readonly count: number;
  readonly seed?: number;
};
export type EigenpairVerificationExerciseOutput = {
  readonly cards: readonly {
    readonly matrix: readonly (readonly number[])[];
    readonly vector: readonly number[];
    readonly eigenvalue: number;
    readonly product: readonly number[];
    readonly expectedProduct: readonly number[];
    readonly valid: boolean;
    readonly repeatedEigenvalue: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    minimum: integer,
    maximum: integer,
    invalidProbability: { type: "number", minimum: 0, maximum: 1 },
    count: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  ["minimum", "maximum", "invalidProbability", "count"],
);
export const outputSchema = object({
  cards: array(
    object({
      matrix: array(array(integer, 2, 2), 2, 2),
      vector: array(integer, 2, 2),
      eigenvalue: integer,
      product: array(integer, 2, 2),
      expectedProduct: array(integer, 2, 2),
      valid: bool,
      repeatedEigenvalue: bool,
    }),
    16,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is EigenpairVerificationExerciseInput =>
  matchesModelInput(value, inputSchema);
export const calculateEigenpairVerificationExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<EigenpairVerificationExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (
      input.minimum > input.maximum ||
      !Number.isSafeInteger(input.maximum - input.minimum + 1)
    )
      simpleError(
        "maximum",
        "Eigenvalue range must be ordered and safe.",
        "invalid_range",
      );
    const cards = Array.from({ length: input.count }, () => {
      const a = random.integer(input.minimum, input.maximum),
        b = random.integer(input.minimum, input.maximum),
        axis = random.integer(0, 1),
        invalid = random.unit() < input.invalidProbability,
        matrix = [
          [a, 0],
          [0, b],
        ],
        vector = axis === 0 ? [1, 0] : [0, 1],
        eigenvalue = safe((axis === 0 ? a : b) + (invalid ? 1 : 0), "maximum"),
        product = calculateMultiply({
          first: matrix,
          second: vector.map((v) => [v]),
        }).product.map((r) => finite(r[0])),
        expectedProduct = vector.map((v) => finite(v * eigenvalue));
      return {
        matrix,
        vector,
        eigenvalue,
        product,
        expectedProduct,
        valid: product.every((v, i) => v === expectedProduct[i]),
        repeatedEigenvalue: a === b,
      };
    });
    const result = { cards };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const eigenpairVerificationExerciseExample = {
  input: { minimum: 1, maximum: 5, invalidProbability: 0, count: 1, seed: 42 },
  output: {
    cards: [
      {
        matrix: [
          [4, 0],
          [0, 3],
        ],
        vector: [0, 1],
        eigenvalue: 3,
        product: [0, 3],
        expectedProduct: [0, 3],
        valid: true,
        repeatedEigenvalue: false,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  EigenpairVerificationExerciseInput,
  EigenpairVerificationExerciseOutput
>;
export const eigenpairVerificationExerciseTool = createModelDefinition<
  EigenpairVerificationExerciseInput,
  EigenpairVerificationExerciseOutput
>({
  id: "random/eigenpair-verification-exercise",
  title: "Random Eigenpair Verification Exercise Generator",
  description:
    "Construct diagonal two-dimensional eigenpair verification cards with exact matrix products, explicit false candidates and repeated-eigenvalue labels.",
  inputSchema,
  outputSchema,
  execute: calculateEigenpairVerificationExercise,
});
export const runEigenpairVerificationExercise =
  eigenpairVerificationExerciseTool.execute;
export default eigenpairVerificationExerciseTool;
