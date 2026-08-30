import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateCatalogSelection, type CatalogSelectionInput, type CatalogSelectionOutput } from "../catalog-item/tool.js";
export type RandomNutrientInput = CatalogSelectionInput; export type RandomNutrientOutput = CatalogSelectionOutput;
export const calculateRandomNutrient = (input: RandomNutrientInput, random: RandomSource = Math.random): RandomNutrientOutput | null => calculateCatalogSelection(input, random);
export const randomNutrientExample = { input: { candidateIds: ["candidate-a", "candidate-b", "candidate-c"], datasetId: "example/nutrient", datasetVersion: "1", selectionCount: 2, sourceId: "example", withReplacement: false } } satisfies ToolExample<RandomNutrientInput, RandomNutrientOutput>;
export const randomNutrientTool = createSimpleTool({
  calculate: (input, context) => { const output = calculateRandomNutrient({ candidateIds: input.candidateIds as string[], datasetId: input.datasetId as string, datasetVersion: input.datasetVersion as string, selectionCount: input.selectionCount as number, sourceId: input.sourceId as string, withReplacement: input.withReplacement as boolean }, context.random ?? Math.random); if (output === null) return simpleError("candidateIds", "Provide unique nonempty candidate IDs, source metadata, a feasible count, and valid randomness.", "invalid_catalog_selection"); return output; },
  description: "Select nutrient record IDs from a caller-supplied normalized dataset while preserving dataset and source provenance.", id: "random/nutrient",
  inputs: [{ id: "candidateIds", kind: "stringList", label: "Candidate record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }, { id: "selectionCount", kind: "integer", label: "Selection count", maximum: 1000, minimum: 1 }, { default: false, id: "withReplacement", kind: "boolean", label: "Sample with replacement", required: false }],
  outputs: [{ id: "selectedIds", kind: "stringList", label: "Selected record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }], title: "Random Nutrient Picker",
});
export const runRandomNutrient = randomNutrientTool.execute; export default randomNutrientTool;
