import { defineTool } from "../../core/definition.js";
import { resourceLimitIssue } from "../../core/limits.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { finiteDataset, mean, numericDatasetSchema } from "../input.js";
export type SumOfSquaresInput = { readonly values: readonly number[] | number | string };
export type SumOfSquaresOutput = { readonly mean: number; readonly sumOfSquares: number };
export const calculateSumOfSquares = (input: unknown): ToolResult<SumOfSquaresOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]);
  const values = finiteDataset((input as Record<string, unknown>).values); const limit = resourceLimitIssue("samples", values?.length ?? 0, "values"); if (limit) return invalidInput([limit]);
  if (!values?.length) return invalidInput([{ code: "sample_required", field: "values", message: "Provide at least one finite number." }]);
  const center = mean(values); return toolSuccess({ mean: center, sumOfSquares: values.reduce((sum, value) => sum + (value - center) ** 2, 0) });
};
export const sumOfSquaresTool = defineTool<SumOfSquaresInput, SumOfSquaresOutput>({ contractVersion: 1, description: "Calculate the sum of squared deviations from the sample mean.", execute: calculateSumOfSquares, execution: { kind: "pure" }, id: "statistics/sum-of-squares", inputSchema: { additionalProperties: false, properties: { values: numericDatasetSchema }, required: ["values"], type: "object" }, outputSchema: { additionalProperties: false, properties: { mean: { type: "number" }, sumOfSquares: { minimum: 0, type: "number" } }, required: ["mean", "sumOfSquares"], type: "object" }, ports: { inputs: [{ id: "values", label: "Sample", required: true, valueType: { items: { type: "number" }, type: "list" } }], outputs: [{ id: "sumOfSquares", label: "Sum of squares", valueType: { format: "sum-of-squares", type: "number" } }, { id: "mean", label: "Mean", valueType: { format: "mean", type: "number" } }] }, title: "Sum of Squares Calculator" });
export default sumOfSquaresTool;
