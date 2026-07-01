import { defineTool, type ToolExecutionContext } from "../../core/definition.js";
import { matrixLimitIssues, resourceLimitIssue } from "../../core/limits.js";
import { randomIndex, resolveRandom } from "../../core/random.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type KMeansPlusPlusInput = { readonly clusters: number; readonly points: readonly (readonly number[])[]; readonly seed?: number };
export type KMeansPlusPlusOutput = { readonly centroidIndices: readonly number[]; readonly centroids: readonly (readonly number[])[] };
const squaredDistance = (first: readonly number[], second: readonly number[]): number => first.reduce((sum, value, index) => sum + (value - second[index]!) ** 2, 0);

export const initializeKMeansPlusPlus = (input: unknown, context?: ToolExecutionContext): ToolResult<KMeansPlusPlusOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]);
  const { clusters, points, seed } = input as Record<string, unknown>;
  if (!Array.isArray(points) || points.length === 0 || !points.every((point) => Array.isArray(point) && point.length > 0 && point.every((value) => typeof value === "number" && Number.isFinite(value))) || !points.every((point) => point.length === points[0]!.length)) return invalidInput([{ code: "finite_rectangular_points_required", field: "points", message: "Points must form a non-empty rectangular matrix of finite numbers." }]);
  if (typeof clusters !== "number" || !Number.isSafeInteger(clusters) || clusters < 1 || clusters > points.length || (seed !== undefined && (typeof seed !== "number" || !Number.isSafeInteger(seed)))) return invalidInput([{ code: "valid_cluster_count_required", field: "clusters", message: "Clusters must be a positive integer no greater than the number of points, and seed must be a safe integer." }]);
  const limits = [...matrixLimitIssues(points.length, points[0]!.length, "points"), resourceLimitIssue("iterations", clusters * points.length, "clusters")].filter((issue) => issue !== undefined); if (limits.length) return invalidInput(limits);
  const random = resolveRandom(seed as number | undefined, context); const centroidIndices = [randomIndex(points.length, random)];
  while (centroidIndices.length < clusters) {
    const weights = points.map((point) => Math.min(...centroidIndices.map((index) => squaredDistance(point, points[index]!)))); const total = weights.reduce((sum, weight) => sum + weight, 0);
    let selected = -1;
    if (total > 0) { let threshold = random() * total; for (let index = 0; index < weights.length; index += 1) { threshold -= weights[index]!; if (threshold <= 0 && !centroidIndices.includes(index)) { selected = index; break; } } }
    if (selected < 0) selected = points.findIndex((_, index) => !centroidIndices.includes(index));
    centroidIndices.push(selected);
  }
  return toolSuccess({ centroidIndices, centroids: centroidIndices.map((index) => [...points[index]!]) });
};

export const kMeansPlusPlusTool = defineTool<KMeansPlusPlusInput, KMeansPlusPlusOutput>({
  contractVersion: 1, description: "Choose reproducible initial centroids with k-means++ distance-weighted sampling.", execute: initializeKMeansPlusPlus, execution: { kind: "pure" }, id: "clustering/k-means-plus-plus",
  inputSchema: { additionalProperties: false, properties: { clusters: { minimum: 1, type: "integer" }, points: { items: { items: { type: "number" }, minItems: 1, type: "array" }, minItems: 1, type: "array" }, seed: { type: "integer" } }, required: ["points", "clusters"], type: "object" },
  outputSchema: { additionalProperties: false, properties: { centroidIndices: { items: { minimum: 0, type: "integer" }, type: "array" }, centroids: { items: { items: { type: "number" }, type: "array" }, type: "array" } }, required: ["centroidIndices", "centroids"], type: "object" },
  ports: { inputs: [{ id: "points", label: "Points", required: true, valueType: { format: "matrix", items: { items: { type: "number" }, type: "list" }, type: "list" } }, { id: "clusters", label: "Clusters", required: true, valueType: { format: "count", type: "integer" } }, { id: "seed", label: "Random seed", valueType: { format: "random-seed", type: "integer" } }], outputs: [{ id: "centroids", label: "Initial centroids", valueType: { format: "matrix", items: { items: { type: "number" }, type: "list" }, type: "list" } }, { id: "centroidIndices", label: "Centroid indices", valueType: { format: "indices", items: { type: "integer" }, type: "list" } }] }, title: "K-Means++ Initializer",
});
export default kMeansPlusPlusTool;
