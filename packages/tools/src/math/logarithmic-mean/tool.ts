import { defineTool } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
export type LogarithmicMeanInput = { readonly first: number; readonly second: number };
export type LogarithmicMeanOutput = { readonly logarithmicMean: number };
export const calculateLogarithmicMean = (input: unknown): ToolResult<LogarithmicMeanOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]);
  const { first, second } = input as Record<string, unknown>;
  if (typeof first !== "number" || !Number.isFinite(first) || first <= 0 || typeof second !== "number" || !Number.isFinite(second) || second <= 0)
    return invalidInput([{ code: "positive_numbers_required", field: "first", message: "Both values must be finite and greater than zero." }]);
  return toolSuccess({ logarithmicMean: first === second ? first : (second - first) / (Math.log(second) - Math.log(first)) });
};
export const logarithmicMeanTool = defineTool<LogarithmicMeanInput, LogarithmicMeanOutput>({
  contractVersion: 1, description: "Calculate the logarithmic mean of two positive numbers.", execute: calculateLogarithmicMean, execution: { kind: "pure" }, id: "math/logarithmic-mean",
  inputSchema: { additionalProperties: false, properties: { first: { exclusiveMinimum: 0, type: "number" }, second: { exclusiveMinimum: 0, type: "number" } }, required: ["first", "second"], type: "object" },
  outputSchema: { additionalProperties: false, properties: { logarithmicMean: { exclusiveMinimum: 0, type: "number" } }, required: ["logarithmicMean"], type: "object" },
  ports: { inputs: [{ id: "first", label: "First value", required: true, valueType: { type: "number" } }, { id: "second", label: "Second value", required: true, valueType: { type: "number" } }], outputs: [{ id: "logarithmicMean", label: "Logarithmic mean", valueType: { format: "mean", type: "number" } }] }, title: "Logarithmic Mean Calculator",
});
export default logarithmicMeanTool;
