import { defineTool } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
export type TScoreInput = { readonly hypothesizedMean: number; readonly sampleMean: number; readonly sampleSize: number; readonly sampleStandardDeviation: number };
export type TScoreOutput = { readonly degreesOfFreedom: number; readonly tScore: number };
export const calculateTScore = (input: unknown): ToolResult<TScoreOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]);
  const { hypothesizedMean, sampleMean, sampleSize, sampleStandardDeviation } = input as Record<string, unknown>;
  if (![hypothesizedMean, sampleMean].every((value) => typeof value === "number" && Number.isFinite(value)) || typeof sampleStandardDeviation !== "number" || !Number.isFinite(sampleStandardDeviation) || sampleStandardDeviation <= 0 || typeof sampleSize !== "number" || !Number.isSafeInteger(sampleSize) || sampleSize < 2)
    return invalidInput([{ code: "valid_t_score_input_required", field: "sampleStandardDeviation", message: "Means must be finite, sample standard deviation positive, and sample size at least two." }]);
  return toolSuccess({ degreesOfFreedom: sampleSize - 1, tScore: ((sampleMean as number) - (hypothesizedMean as number)) / ((sampleStandardDeviation as number) / Math.sqrt(sampleSize)) });
};
export const tScoreTool = defineTool<TScoreInput, TScoreOutput>({
  contractVersion: 1, description: "Calculate a one-sample t score for a hypothesized population mean.", execute: calculateTScore, execution: { kind: "pure" }, id: "statistics/t-score",
  inputSchema: { additionalProperties: false, properties: { hypothesizedMean: { type: "number" }, sampleMean: { type: "number" }, sampleSize: { minimum: 2, type: "integer" }, sampleStandardDeviation: { exclusiveMinimum: 0, type: "number" } }, required: ["sampleMean", "hypothesizedMean", "sampleStandardDeviation", "sampleSize"], type: "object" },
  outputSchema: { additionalProperties: false, properties: { degreesOfFreedom: { minimum: 1, type: "integer" }, tScore: { type: "number" } }, required: ["tScore", "degreesOfFreedom"], type: "object" },
  ports: { inputs: [{ id: "sampleMean", label: "Sample mean", required: true, valueType: { format: "mean", type: "number" } }, { id: "hypothesizedMean", label: "Hypothesized mean", required: true, valueType: { format: "mean", type: "number" } }, { id: "sampleStandardDeviation", label: "Sample standard deviation", required: true, valueType: { format: "standard-deviation", type: "number" } }, { id: "sampleSize", label: "Sample size", required: true, valueType: { format: "count", type: "integer" } }], outputs: [{ id: "tScore", label: "T score", valueType: { format: "t-statistic", type: "number" } }, { id: "degreesOfFreedom", label: "Degrees of freedom", valueType: { format: "count", type: "integer" } }] }, title: "One-Sample T-Score Calculator",
});
export default tScoreTool;
