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
import { calculateQrDecomposition } from "../../matrix/qr-decomposition/tool.js";

export type OrthogonalMatrixInput = {
  readonly size: number;
  readonly minimumInteger: number;
  readonly maximumInteger: number;
  readonly maximumResidual: number;
  readonly seed?: number;
};
export type OrthogonalMatrixOutput = {
  readonly source: readonly (readonly number[])[];
  readonly q: readonly (readonly number[])[];
  readonly sourceWasZero: boolean;
  readonly orthogonalityResidual: number;
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
    maximumResidual: { type: "number", minimum: 0 },
    seed: generatorSeedSchema,
  },
  required: ["size", "minimumInteger", "maximumInteger", "maximumResidual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: squareMatrix,
    q: squareMatrix,
    sourceWasZero: { type: "boolean" },
    orthogonalityResidual: { type: "number", minimum: 0 },
    randomness: generatorReplaySchema,
  },
  required: [
    "source",
    "q",
    "sourceWasZero",
    "orthogonalityResidual",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is OrthogonalMatrixInput =>
  matchesModelInput(input, inputSchema);
export const calculateOrthogonalMatrix = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<OrthogonalMatrixOutput> => {
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
    const sourceScale = Math.max(...source.flat().map(Math.abs)),
      scaled = source.map((row) =>
        row.map((value) => value / (sourceScale || 1)),
      );
    const q = calculateQrDecomposition({ matrix: scaled }).q,
      transposed = runTranspose({ matrix: q });
    if (!transposed.ok)
      throw new Error("QR returned an invalid square matrix.");
    const product = calculateMultiply({
      first: transposed.output.matrix,
      second: q,
    }).product;
    const orthogonalityResidual = Math.max(
      ...product.flatMap((row, i) =>
        row.map((value, j) => Math.abs(value - Number(i === j))),
      ),
    );
    if (
      !q.flat().every(Number.isFinite) ||
      !Number.isFinite(orthogonalityResidual)
    )
      simpleError(
        "maximumResidual",
        "The QR orthogonality evidence is not finite.",
        "numeric_overflow",
      );
    if (orthogonalityResidual > input.maximumResidual)
      simpleError(
        "maximumResidual",
        "The generated Q failed the supplied residual policy.",
        "orthogonality_check_failed",
      );
    return toolSuccess({
      source,
      q,
      sourceWasZero: sourceScale === 0,
      orthogonalityResidual,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const orthogonalMatrixExample = {
  input: {
    size: 2,
    minimumInteger: -2,
    maximumInteger: 3,
    maximumResidual: 1e-10,
    seed: 42,
  },
  output: {
    source: [
      [1, 0],
      [3, 2],
    ],
    q: [
      [-0.3162277660168378, -0.9486832980505138],
      [-0.9486832980505139, 0.3162277660168379],
    ],
    sourceWasZero: false,
    orthogonalityResidual: 1.6653345369377348e-16,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<OrthogonalMatrixInput, OrthogonalMatrixOutput>;
export const orthogonalMatrixTool = createModelDefinition<
  OrthogonalMatrixInput,
  OrthogonalMatrixOutput
>({
  id: "random/orthogonal-matrix",
  title: "Random Orthogonal Matrix Generator",
  description:
    "Generate an integer source matrix, scale it safely and reuse Householder QR for an orthogonal factor with a caller-bounded Q-transpose-Q residual; rank-deficient and zero sources use the core's deterministic completion, not Haar-uniform sampling.",
  inputSchema,
  outputSchema,
  execute: calculateOrthogonalMatrix,
});
export const runOrthogonalMatrix = orthogonalMatrixTool.execute;
export default orthogonalMatrixTool;
