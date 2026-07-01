import { defineTool } from "../../core/definition.js";
import { resourceLimitIssue } from "../../core/limits.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
export type ManhattanDistanceInput = { readonly first: readonly number[]; readonly second: readonly number[] };
export type ManhattanDistanceOutput = { readonly distance: number };
const finiteVector = (value: unknown): value is readonly number[] => Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === "number" && Number.isFinite(entry));
export const calculateManhattanDistance = (input: unknown): ToolResult<ManhattanDistanceOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]); const { first, second } = input as Record<string, unknown>;
  if (!finiteVector(first) || !finiteVector(second) || first.length !== second.length) return invalidInput([{ code: "matching_vectors_required", field: "first", message: "Provide non-empty finite vectors with equal dimensions." }]);
  const limit = resourceLimitIssue("matrixDimension", first.length, "dimensions"); if (limit) return invalidInput([limit]);
  return toolSuccess({ distance: first.reduce((sum, value, index) => sum + Math.abs(value - second[index]!), 0) });
};
export const manhattanDistanceTool = defineTool<ManhattanDistanceInput, ManhattanDistanceOutput>({ contractVersion: 1, description: "Calculate Manhattan distance as the sum of coordinate-wise absolute differences.", execute: calculateManhattanDistance, execution: { kind: "pure" }, id: "distance/manhattan", inputSchema: { additionalProperties: false, properties: { first: { items: { type: "number" }, minItems: 1, type: "array" }, second: { items: { type: "number" }, minItems: 1, type: "array" } }, required: ["first", "second"], type: "object" }, outputSchema: { additionalProperties: false, properties: { distance: { minimum: 0, type: "number" } }, required: ["distance"], type: "object" }, ports: { inputs: [{ id: "first", label: "First vector", required: true, valueType: { format: "vector", items: { type: "number" }, type: "list" } }, { id: "second", label: "Second vector", required: true, valueType: { format: "vector", items: { type: "number" }, type: "list" } }], outputs: [{ id: "distance", label: "Manhattan distance", valueType: { format: "distance/manhattan", type: "number" } }] }, title: "Manhattan Distance Calculator" });
export default manhattanDistanceTool;
