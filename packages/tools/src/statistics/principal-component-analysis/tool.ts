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
import { generatorFailure } from "../../random/generator-random.js";
import { singularValueDecomposition } from "../../matrix/singular-value-decomposition/tool.js";
import { SimpleToolError } from "../../core/simple.js";

export type PrincipalComponentAnalysisInput = {
  readonly observations: readonly (readonly number[])[];
  readonly componentCount: number;
};
export type PrincipalComponentAnalysisOutput = {
  readonly means: readonly number[];
  readonly components: readonly (readonly number[])[];
  readonly scores: readonly (readonly number[])[];
  readonly explainedVariance: readonly number[];
  readonly explainedVarianceRatio: readonly number[];
};
const vector = {
  type: "array",
  minItems: 1,
  maxItems: 20,
  items: { type: "number" },
} as const;
const matrix = {
  type: "array",
  minItems: 1,
  maxItems: 20,
  items: vector,
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observations: { ...matrix, minItems: 2 },
    componentCount: { type: "integer", minimum: 1, maximum: 20 },
  },
  required: ["observations", "componentCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    means: vector,
    components: matrix,
    scores: { ...matrix, minItems: 2 },
    explainedVariance: { ...vector, items: { type: "number", minimum: 0 } },
    explainedVarianceRatio: {
      ...vector,
      items: { type: "number", minimum: 0, maximum: 1 },
    },
  },
  required: [
    "means",
    "components",
    "scores",
    "explainedVariance",
    "explainedVarianceRatio",
  ],
} as const;

const isInput = (input: unknown): input is PrincipalComponentAnalysisInput =>
  matchesModelInput(input, inputSchema);
export const calculatePrincipalComponentAnalysis = (
  input: unknown,
): ToolResult<PrincipalComponentAnalysisOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const rows = input.observations.length,
      columns = input.observations[0].length;
    if (input.observations.some((row) => row.length !== columns))
      simpleError(
        "observations",
        "Observations must form a rectangular matrix.",
        "ragged_matrix",
      );
    if (input.componentCount > Math.min(rows, columns))
      simpleError(
        "componentCount",
        "The requested count exceeds the thin component dimension.",
        "infeasible_component_count",
      );
    const scale = Math.max(...input.observations.flat().map(Math.abs)) || 1;
    const normalized = input.observations.map((row) =>
      row.map((value) => value / scale),
    );
    const normalizedMeans = Array.from({ length: columns }, (_, column) => {
      const anchor = normalized[0][column];
      return (
        anchor +
        normalized.reduce((sum, row) => sum + (row[column] - anchor) / rows, 0)
      );
    });
    const centered = normalized.map((row) =>
      row.map((value, column) => value - normalizedMeans[column]),
    );
    const decompose = (): ReturnType<typeof singularValueDecomposition> => {
      try {
        return singularValueDecomposition(centered);
      } catch (error) {
        if (error instanceof SimpleToolError)
          return simpleError("observations", error.message, error.code);
        throw error;
      }
    };
    const decomposition = decompose();
    const components = decomposition.vt
      .slice(0, input.componentCount)
      .map((row) => {
        const pivot = row.reduce(
          (best, value, i) =>
            Math.abs(value) > Math.abs(row[best]) ? i : best,
          0,
        );
        return row.map((value) => {
          const signed = row[pivot] < 0 ? -value : value;
          return signed === 0 ? 0 : signed;
        });
      });
    const normalizedScores = centered.map((row) =>
      components.map((component) =>
        row.reduce((sum, value, i) => sum + value * component[i], 0),
      ),
    );
    const means = normalizedMeans.map((value) => value * scale);
    const scores = normalizedScores.map((row) =>
      row.map((value) => (value === 0 ? 0 : value * scale)),
    );
    const normalizedVariances = components.map(
      (_, column) =>
        normalizedScores.reduce((sum, row) => sum + row[column] ** 2, 0) /
        (rows - 1),
    );
    const totalVariance =
      centered.reduce(
        (sum, row) => sum + row.reduce((s, value) => s + value ** 2, 0),
        0,
      ) /
      (rows - 1);
    const explainedVariance = normalizedVariances.map(
      (value) => (Math.sqrt(value) * scale) ** 2,
    );
    const explainedVarianceRatio = normalizedVariances.map((value) =>
      totalVariance === 0 ? 0 : Math.min(1, value / totalVariance),
    );
    if (
      ![
        ...means,
        ...components.flat(),
        ...scores.flat(),
        ...explainedVariance,
        ...explainedVarianceRatio,
      ].every(Number.isFinite)
    )
      simpleError(
        "observations",
        "PCA outputs must remain finite at the supplied data scale.",
        "numeric_overflow",
      );
    return toolSuccess({
      means,
      components,
      scores,
      explainedVariance,
      explainedVarianceRatio,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const principalComponentAnalysisExample = {
  input: {
    observations: [
      [0, 4],
      [4, 4],
      [8, 4],
    ],
    componentCount: 2,
  },
  output: {
    means: [4, 4],
    components: [
      [1, 0],
      [0, 1],
    ],
    scores: [
      [-4, 0],
      [0, 0],
      [4, 0],
    ],
    explainedVariance: [16, 0],
    explainedVarianceRatio: [1, 0],
  },
} satisfies ToolExample<
  PrincipalComponentAnalysisInput,
  PrincipalComponentAnalysisOutput
>;
export const principalComponentAnalysisTool = createModelDefinition<
  PrincipalComponentAnalysisInput,
  PrincipalComponentAnalysisOutput
>({
  id: "statistics/principal-component-analysis",
  title: "Principal Component Analysis Tool",
  description:
    "Compute centered, unstandardized sample-covariance PCA through the existing thin Jacobi SVD, with projected scores, sample explained variances and deterministic component signs; degenerate subspaces remain nonunique.",
  inputSchema,
  outputSchema,
  execute: calculatePrincipalComponentAnalysis,
});
export const runPrincipalComponentAnalysis =
  principalComponentAnalysisTool.execute;
export default principalComponentAnalysisTool;
