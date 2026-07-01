import { defineTool } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FStatisticInput = { readonly denominatorVariance: number; readonly numeratorVariance: number };
export type FStatisticOutput = { readonly fStatistic: number };

export const calculateFStatistic = (input: unknown): ToolResult<FStatisticOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]);
  const { denominatorVariance, numeratorVariance } = input as Record<string, unknown>;
  if (typeof numeratorVariance !== "number" || !Number.isFinite(numeratorVariance) || numeratorVariance < 0 || typeof denominatorVariance !== "number" || !Number.isFinite(denominatorVariance) || denominatorVariance <= 0)
    return invalidInput([{ code: "valid_variances_required", field: "denominatorVariance", message: "The numerator variance must be nonnegative and the denominator variance must be positive." }]);
  return toolSuccess({ fStatistic: numeratorVariance / denominatorVariance });
};

export const fStatisticTool = defineTool<FStatisticInput, FStatisticOutput>({
  contractVersion: 1,
  description: "Calculate an F statistic as the ratio of two variances.",
  execute: calculateFStatistic,
  execution: { kind: "pure" },
  id: "statistics/f-statistic",
  inputSchema: { additionalProperties: false, properties: { denominatorVariance: { exclusiveMinimum: 0, type: "number" }, numeratorVariance: { minimum: 0, type: "number" } }, required: ["numeratorVariance", "denominatorVariance"], type: "object" },
  outputSchema: { additionalProperties: false, properties: { fStatistic: { minimum: 0, type: "number" } }, required: ["fStatistic"], type: "object" },
  ports: { inputs: [
    { id: "numeratorVariance", label: "Numerator variance", required: true, valueType: { format: "variance", type: "number" } },
    { id: "denominatorVariance", label: "Denominator variance", required: true, valueType: { format: "variance", type: "number" } },
  ], outputs: [{ id: "fStatistic", label: "F statistic", valueType: { format: "f-statistic", type: "number" } }] },
  title: "F-Statistic Calculator",
});
export default fStatisticTool;
