import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { calculateCatalogSelection, type CatalogSelectionInput, type CatalogSelectionOutput } from "../catalog-item/tool.js";
export type RandomMicrophoneInput = CatalogSelectionInput; export type RandomMicrophoneOutput = CatalogSelectionOutput;
export const calculateRandomMicrophone = (input: RandomMicrophoneInput, random: RandomSource = Math.random): RandomMicrophoneOutput | null => calculateCatalogSelection(input, random);
export const randomMicrophoneExample = { input: { candidateIds: ["candidate-a", "candidate-b", "candidate-c"], datasetId: "example/microphone", datasetVersion: "1", selectionCount: 2, sourceId: "example", withReplacement: false } } satisfies ToolExample<RandomMicrophoneInput, RandomMicrophoneOutput>;
export const randomMicrophoneTool = createSimpleTool({
  calculate: (input, context) => { const output = calculateRandomMicrophone({ candidateIds: input.candidateIds as string[], datasetId: input.datasetId as string, datasetVersion: input.datasetVersion as string, selectionCount: input.selectionCount as number, sourceId: input.sourceId as string, withReplacement: input.withReplacement as boolean }, context.random ?? Math.random); if (output === null) return simpleError("candidateIds", "Provide unique nonempty candidate IDs, source metadata, a feasible count, and valid randomness.", "invalid_catalog_selection"); return output; },
  description: "Select microphone record IDs from a caller-supplied normalized dataset while preserving dataset and source provenance.", id: "random/microphone",
  inputs: [{ id: "candidateIds", kind: "stringList", label: "Candidate record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }, { id: "selectionCount", kind: "integer", label: "Selection count", maximum: 1000, minimum: 1 }, { default: false, id: "withReplacement", kind: "boolean", label: "Sample with replacement", required: false }],
  outputs: [{ id: "selectedIds", kind: "stringList", label: "Selected record IDs" }, { id: "datasetId", kind: "string", label: "Dataset ID" }, { id: "datasetVersion", kind: "string", label: "Dataset version" }, { id: "sourceId", kind: "string", label: "Source ID" }], title: "Random Microphone Picker",
});
export const runRandomMicrophone = randomMicrophoneTool.execute; export default randomMicrophoneTool;
