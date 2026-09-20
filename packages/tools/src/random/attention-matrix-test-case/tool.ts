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
import { scaledDotProductAttention } from "../../machine-learning/scaled-dot-product-attention/tool.js";
import { runDimensions } from "../../matrix/dimensions/tool.js";
import { runDotProduct } from "../../vector/dot-product/tool.js";
import { runSoftmax } from "../../activation/softmax/tool.js";
import {
  generatedModelValueProperties,
  checkGeneratedModelRange,
  generatedModelMatrix,
  type GeneratedModelValueRange,
} from "../model-array-construction.js";

export type AttentionMatrixTestCaseInput = GeneratedModelValueRange & {
  readonly queryCount: number;
  readonly keyCount: number;
  readonly keyWidth: number;
  readonly valueWidth: number;
  readonly seed?: number;
};
export type GeneratedMatrixShape = {
  readonly rows: number;
  readonly columns: number;
};
export type AttentionMatrixTestCaseOutput = {
  readonly queries: readonly (readonly number[])[];
  readonly keys: readonly (readonly number[])[];
  readonly values: readonly (readonly number[])[];
  readonly weights: readonly (readonly number[])[];
  readonly attendedValues: readonly (readonly number[])[];
  readonly dimensions: {
    readonly queries: GeneratedMatrixShape;
    readonly keys: GeneratedMatrixShape;
    readonly values: GeneratedMatrixShape;
  };
  readonly randomness: GeneratorReplay;
};
const matrixSchema = {
  type: "array",
  minItems: 1,
  maxItems: 32,
  items: {
    type: "array",
    minItems: 1,
    maxItems: 16,
    items: { type: "number" },
  },
} as const;
const shapeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1, maximum: 32 },
    columns: { type: "integer", minimum: 1, maximum: 16 },
  },
  required: ["rows", "columns"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...generatedModelValueProperties,
    queryCount: { type: "integer", minimum: 1, maximum: 32 },
    keyCount: { type: "integer", minimum: 1, maximum: 32 },
    keyWidth: { type: "integer", minimum: 1, maximum: 16 },
    valueWidth: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  required: [
    "minimumValue",
    "maximumValue",
    "valueDivisor",
    "queryCount",
    "keyCount",
    "keyWidth",
    "valueWidth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queries: matrixSchema,
    keys: matrixSchema,
    values: matrixSchema,
    weights: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 32,
        items: { type: "number", minimum: 0, maximum: 1 },
      },
    },
    attendedValues: matrixSchema,
    dimensions: {
      type: "object",
      additionalProperties: false,
      properties: {
        queries: shapeSchema,
        keys: shapeSchema,
        values: shapeSchema,
      },
      required: ["queries", "keys", "values"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "queries",
    "keys",
    "values",
    "weights",
    "attendedValues",
    "dimensions",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is AttentionMatrixTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateAttentionMatrixTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<AttentionMatrixTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    checkGeneratedModelRange(input);
    const random = createGeneratorRandom(input.seed, context),
      queries = generatedModelMatrix(
        input.queryCount,
        input.keyWidth,
        input,
        random,
      ),
      keys = generatedModelMatrix(
        input.keyCount,
        input.keyWidth,
        input,
        random,
      ),
      values = generatedModelMatrix(
        input.keyCount,
        input.valueWidth,
        input,
        random,
      );
    const weights = queries.map((query) => {
      const scores = keys.map((key) => {
        const result = runDotProduct({ first: query, second: key });
        if (!result.ok) {
          // Only classify independently confirmed arithmetic overflow as a domain
          // error; preserve unexpected failures from the delegated calculation.
          const raw = query.reduce((sum, value, i) => sum + value * key[i], 0);
          if (!Number.isFinite(raw))
            return simpleError(
              "valueDivisor",
              "An attention dot product is outside the finite numeric range.",
              "numeric_overflow",
            );
          throw new Error(
            "Compatible finite generated vectors were rejected by the dot-product core.",
          );
        }
        const score =
          (result.output.dotProduct as number) / Math.sqrt(input.keyWidth);
        if (!Number.isFinite(score))
          simpleError(
            "valueDivisor",
            "An attention score is outside the finite numeric range.",
            "numeric_overflow",
          );
        return score;
      });
      const result = runSoftmax({ values: scores });
      if (!result.ok)
        throw new Error(
          "Finite generated scores were rejected by the softmax core.",
        );
      return result.output.probabilities as readonly number[];
    });
    const attendedValues = scaledDotProductAttention(queries, keys, values);
    if (attendedValues === null)
      throw new Error(
        "Generated compatible attention matrices were rejected by the attention core.",
      );
    if (
      attendedValues.some((row) => row.some((value) => !Number.isFinite(value)))
    )
      simpleError(
        "valueDivisor",
        "A delegated attention value is outside the finite numeric range.",
        "numeric_overflow",
      );
    const shape = (
      matrix: readonly (readonly number[])[],
    ): GeneratedMatrixShape => {
      const result = runDimensions({ matrix });
      if (!result.ok)
        throw new Error(
          "A rectangular generated matrix was rejected by the dimensions core.",
        );
      return {
        rows: result.output.rows as number,
        columns: result.output.columns as number,
      };
    };
    return toolSuccess({
      queries,
      keys,
      values,
      weights,
      attendedValues,
      dimensions: {
        queries: shape(queries),
        keys: shape(keys),
        values: shape(values),
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const attentionMatrixTestCaseExample = {
  input: {
    minimumValue: -2,
    maximumValue: 2,
    valueDivisor: 1,
    queryCount: 2,
    keyCount: 2,
    keyWidth: 1,
    valueWidth: 1,
    seed: 42,
  },
  output: {
    queries: [[1], [0]],
    keys: [[2], [1]],
    values: [[-2], [0]],
    weights: [
      [0.7310585786300049, 0.2689414213699951],
      [0.5, 0.5],
    ],
    attendedValues: [[-1.46211715726], [-1]],
    dimensions: {
      queries: {
        rows: 2,
        columns: 1,
      },
      keys: {
        rows: 2,
        columns: 1,
      },
      values: {
        rows: 2,
        columns: 1,
      },
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  AttentionMatrixTestCaseInput,
  AttentionMatrixTestCaseOutput
>;
export const attentionMatrixTestCaseTool = createModelDefinition<
  AttentionMatrixTestCaseInput,
  AttentionMatrixTestCaseOutput
>({
  id: "random/attention-matrix-test-case",
  title: "Random Attention Matrix Test Case Generator",
  description:
    "Generate compatible bounded quantized query/key/value matrices, delegate dimensions, dot products, stable softmax weights, and the existing 12-significant-digit scaled-dot-product attention output; this is single-head unmasked attention, not training, a Transformer benchmark, or an accuracy claim.",
  inputSchema,
  outputSchema,
  execute: calculateAttentionMatrixTestCase,
});
export const runAttentionMatrixTestCase = attentionMatrixTestCaseTool.execute;
export default attentionMatrixTestCaseTool;
