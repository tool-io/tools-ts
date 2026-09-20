import {
  matchesModelInput,
  createModelDefinition,
  modelInputIssues,
} from "../../core/model-definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type KurtosisInput = {
  readonly values: readonly number[];
  readonly biasCorrected?: boolean;
};
export type KurtosisOutput = {
  readonly biasCorrected: boolean;
  readonly count: number;
  readonly excessKurtosis: number;
  readonly pearsonKurtosis: number;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    values: {
      items: { type: "number" },
      maxItems: 512,
      minItems: 2,
      type: "array",
    },
    biasCorrected: { default: false, type: "boolean" },
  },
  required: ["values"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    biasCorrected: { type: "boolean" },
    count: { minimum: 2, maximum: 512, type: "integer" },
    excessKurtosis: { type: "number" },
    pearsonKurtosis: { type: "number" },
  },
  required: ["biasCorrected", "count", "excessKurtosis", "pearsonKurtosis"],
  type: "object",
} as const;
const isInput = (input: unknown): input is KurtosisInput =>
  matchesModelInput(input, inputSchema);

export const calculateKurtosis = (
  input: unknown,
): ToolResult<KurtosisOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  const count = input.values.length,
    biasCorrected = input.biasCorrected ?? false;
  if (biasCorrected && count < 4)
    return invalidInput([
      {
        code: "insufficient_samples",
        field: "values",
        message: "Bias correction requires at least four observations.",
      },
    ]);
  // Dimensionless moments avoid overflowing the fourth powers of large data.
  const scale = Math.max(...input.values.map(Math.abs)) || 1;
  const normalized = input.values.map((value) => value / scale);
  const mean = normalized.reduce((sum, value) => sum + value, 0) / count;
  let second = 0,
    fourth = 0;
  for (const value of normalized) {
    const squared = (value - mean) ** 2;
    second += squared;
    fourth += squared ** 2;
  }
  second /= count;
  fourth /= count;
  if (second === 0)
    return invalidInput([
      {
        code: "zero_variance",
        field: "values",
        message: "Kurtosis is undefined for constant observations.",
      },
    ]);
  let excessKurtosis = fourth / (second * second) - 3;
  if (biasCorrected)
    excessKurtosis =
      ((count - 1) / ((count - 2) * (count - 3))) *
      ((count + 1) * excessKurtosis + 6);
  if (!Number.isFinite(excessKurtosis))
    return invalidInput([
      {
        code: "numeric_overflow",
        field: "values",
        message:
          "The standardized fourth moment cannot be represented finitely.",
      },
    ]);
  return toolSuccess({
    biasCorrected,
    count,
    excessKurtosis,
    pearsonKurtosis: excessKurtosis + 3,
  });
};
export const kurtosisExample = {
  input: { values: [-2, -1, 0, 1, 2] },
  output: {
    biasCorrected: false,
    count: 5,
    excessKurtosis: -1.3,
    pearsonKurtosis: 1.7,
  },
} satisfies ToolExample<KurtosisInput, KurtosisOutput>;
export const kurtosisTool = createModelDefinition<
  KurtosisInput,
  KurtosisOutput
>({
  id: "statistics/kurtosis",
  title: "Sample Kurtosis Calculator",
  description:
    "Calculate Pearson and Fisher excess kurtosis from sample central moments, with optional finite-sample bias correction and no normality-test claim.",
  inputSchema,
  outputSchema,
  execute: calculateKurtosis,
});
export const runKurtosis = kurtosisTool.execute;
export default kurtosisTool;
