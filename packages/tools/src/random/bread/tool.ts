import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateCatalogSelection, type CatalogSelectionInput, type CatalogSelectionOutput } from "../catalog-item/tool.js";
export type RandomBreadInput = CatalogSelectionInput; export type RandomBreadOutput = CatalogSelectionOutput;
export const calculateRandomBread = (input: RandomBreadInput, random: RandomSource = Math.random): RandomBreadOutput | null => calculateCatalogSelection(input, random);
export const randomBreadExample = { input: { candidateIds: ["candidate-a", "candidate-b", "candidate-c"], datasetId: "example/bread", datasetVersion: "1", selectionCount: 2, sourceId: "example", withReplacement: false } } satisfies ToolExample<RandomBreadInput, RandomBreadOutput>;
export const randomBreadTool = createSimpleTool({
  calculate: (input, context) => { const output = calculateRandomBread({ candidateIds: input.candidateIds as string[], datasetId: input.datasetId as string, datasetVersion: input.datasetVersion as string, selectionCount: input.selectionCount as number, sourceId: input.sourceId as string, withReplacement: input.withReplacement as boolean }, context.random ?? Math.random); if (output === null) return simpleError("candidateIds", "Provide unique nonempty candidate IDs, source metadata, a feasible count, and valid randomness.", "invalid_catalog_selection"); return output; },
  description: "Select bread record IDs from a caller-supplied normalized dataset while preserving dataset and source provenance.", id: "random/bread",
  inputs: [{ id: "candidateIds", kind: "stringList", label: "Candidate record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }, { id: "selectionCount", kind: "integer", label: "Selection count", maximum: 1000, minimum: 1 }, { default: false, id: "withReplacement", kind: "boolean", label: "Sample with replacement", required: false }],
  outputs: [{ id: "selectedIds", kind: "stringList", label: "Selected record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }], title: "Random Bread Picker",
});
export const runRandomBread = randomBreadTool.execute; export default randomBreadTool;
