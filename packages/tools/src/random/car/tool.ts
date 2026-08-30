import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateCatalogSelection, type CatalogSelectionInput, type CatalogSelectionOutput } from "../catalog-item/tool.js";
export type RandomCarInput = CatalogSelectionInput; export type RandomCarOutput = CatalogSelectionOutput;
export const calculateRandomCar = (input: RandomCarInput, random: RandomSource = Math.random): RandomCarOutput | null => calculateCatalogSelection(input, random);
export const randomCarExample = { input: { candidateIds: ["candidate-a", "candidate-b", "candidate-c"], datasetId: "example/car", datasetVersion: "1", selectionCount: 2, sourceId: "example", withReplacement: false } } satisfies ToolExample<RandomCarInput, RandomCarOutput>;
export const randomCarTool = createSimpleTool({
  calculate: (input, context) => { const output = calculateRandomCar({ candidateIds: input.candidateIds as string[], datasetId: input.datasetId as string, datasetVersion: input.datasetVersion as string, selectionCount: input.selectionCount as number, sourceId: input.sourceId as string, withReplacement: input.withReplacement as boolean }, context.random ?? Math.random); if (output === null) return simpleError("candidateIds", "Provide unique nonempty candidate IDs, source metadata, a feasible count, and valid randomness.", "invalid_catalog_selection"); return output; },
  description: "Select car record IDs from a caller-supplied normalized dataset while preserving dataset and source provenance.", id: "random/car",
  inputs: [{ id: "candidateIds", kind: "stringList", label: "Candidate record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }, { id: "selectionCount", kind: "integer", label: "Selection count", maximum: 1000, minimum: 1 }, { default: false, id: "withReplacement", kind: "boolean", label: "Sample with replacement", required: false }],
  outputs: [{ id: "selectedIds", kind: "stringList", label: "Selected record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }], title: "Random Car Picker",
});
export const runRandomCar = randomCarTool.execute; export default randomCarTool;
