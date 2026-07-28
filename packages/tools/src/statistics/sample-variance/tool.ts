import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { resourceLimitIssue } from "../../core/limits.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { finiteDataset, mean, numericDatasetSchema } from "../input.js";
export type SampleVarianceInput = {
  readonly values: readonly number[] | number | string;
};
export type SampleVarianceOutput = { readonly sampleVariance: number };
export const sampleVarianceExample = {
  input: { values: [1, 2, 3] },
} satisfies ToolExample<SampleVarianceInput>;
export const calculateSampleVariance = (
  input: unknown,
): ToolResult<SampleVarianceOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const values = finiteDataset((input as Record<string, unknown>).values);
  const limit = resourceLimitIssue("samples", values?.length ?? 0, "values");
  if (limit) return invalidInput([limit]);
  if (!values || values.length < 2)
    return invalidInput([
      {
        code: "sample_required",
        field: "values",
        message: "Provide at least two finite numbers.",
      },
    ]);
  const center = mean(values);
  return toolSuccess({
    sampleVariance:
      values.reduce((sum, value) => sum + (value - center) ** 2, 0) /
      (values.length - 1),
  });
};
export const sampleVarianceTool = defineTool<
  SampleVarianceInput,
  SampleVarianceOutput
>({
  contractVersion: 1,
  description: "Calculate unbiased sample variance using the n−1 denominator.",
  execute: calculateSampleVariance,
  execution: { kind: "pure" },
  id: "statistics/sample-variance",
  inputSchema: {
    additionalProperties: false,
    properties: { values: numericDatasetSchema },
    required: ["values"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { sampleVariance: { minimum: 0, type: "number" } },
    required: ["sampleVariance"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "values",
        label: "Sample",
        required: true,
        valueType: { items: { type: "number" }, type: "list" },
      },
    ],
    outputs: [
      {
        id: "sampleVariance",
        label: "Sample variance",
        valueType: { format: "variance", type: "number" },
      },
    ],
  },
  title: "Sample Variance Calculator",
});
export default sampleVarianceTool;
