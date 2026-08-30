import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateCatalogSelection, type CatalogSelectionInput, type CatalogSelectionOutput } from "../catalog-item/tool.js";
export type RandomTelevisionInput = CatalogSelectionInput; export type RandomTelevisionOutput = CatalogSelectionOutput;
export const calculateRandomTelevision = (input: RandomTelevisionInput, random: RandomSource = Math.random): RandomTelevisionOutput | null => calculateCatalogSelection(input, random);
export const randomTelevisionExample = { input: { candidateIds: ["candidate-a", "candidate-b", "candidate-c"], datasetId: "example/television", datasetVersion: "1", selectionCount: 2, sourceId: "example", withReplacement: false } } satisfies ToolExample<RandomTelevisionInput, RandomTelevisionOutput>;
export const randomTelevisionTool = createSimpleTool({
  calculate: (input, context) => { const output = calculateRandomTelevision({ candidateIds: input.candidateIds as string[], datasetId: input.datasetId as string, datasetVersion: input.datasetVersion as string, selectionCount: input.selectionCount as number, sourceId: input.sourceId as string, withReplacement: input.withReplacement as boolean }, context.random ?? Math.random); if (output === null) return simpleError("candidateIds", "Provide unique nonempty candidate IDs, source metadata, a feasible count, and valid randomness.", "invalid_catalog_selection"); return output; },
  description: "Select television record IDs from a caller-supplied normalized dataset while preserving dataset and source provenance.", id: "random/television",
  inputs: [{ id: "candidateIds", kind: "stringList", label: "Candidate record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }, { id: "selectionCount", kind: "integer", label: "Selection count", maximum: 1000, minimum: 1 }, { default: false, id: "withReplacement", kind: "boolean", label: "Sample with replacement", required: false }],
  outputs: [{ id: "selectedIds", kind: "stringList", label: "Selected record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }], title: "Random Television Picker",
});
export const runRandomTelevision = randomTelevisionTool.execute; export default randomTelevisionTool;
