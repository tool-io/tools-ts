import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";

export type CatalogSelectionInput = {
  readonly candidateIds: readonly string[];
  readonly datasetId: string;
  readonly datasetVersion: string;
  readonly selectionCount: number;
  readonly sourceId: string;
  readonly withReplacement?: boolean;
};
export type CatalogSelectionOutput = {
  readonly datasetId: string;
  readonly datasetVersion: string;
  readonly selectedIds: readonly string[];
  readonly sourceId: string;
};

const nonempty = (value: string): boolean => value.trim().length > 0;
export const calculateCatalogSelection = (
  input: CatalogSelectionInput,
  random: RandomSource = Math.random,
): CatalogSelectionOutput | null => {
  if (
    !nonempty(input.datasetId) || !nonempty(input.datasetVersion) || !nonempty(input.sourceId) ||
    !Number.isSafeInteger(input.selectionCount) || input.selectionCount < 1 || input.selectionCount > 1000 ||
    input.candidateIds.length === 0 || input.candidateIds.length > 1000 ||
    input.candidateIds.some((id) => !nonempty(id)) || new Set(input.candidateIds).size !== input.candidateIds.length ||
    (!input.withReplacement && input.selectionCount > input.candidateIds.length)
  ) return null;
  const selectedIds: string[] = [];
  if (input.withReplacement) {
    for (let draw = 0; draw < input.selectionCount; draw += 1) {
      const sample = sampleRandomSource(random); if (sample === null) return null;
      selectedIds.push(input.candidateIds[Math.floor(sample * input.candidateIds.length)]!);
    }
  } else {
    const pool = [...input.candidateIds];
    for (let draw = 0; draw < input.selectionCount; draw += 1) {
      const sample = sampleRandomSource(random); if (sample === null) return null;
      const selectedIndex = draw + Math.floor(sample * (pool.length - draw));
      [pool[draw], pool[selectedIndex]] = [pool[selectedIndex]!, pool[draw]!];
      selectedIds.push(pool[draw]!);
    }
  }
  return { datasetId: input.datasetId, datasetVersion: input.datasetVersion, selectedIds, sourceId: input.sourceId };
};

export type RandomCatalogItemInput = CatalogSelectionInput;
export type RandomCatalogItemOutput = CatalogSelectionOutput;
export const calculateRandomCatalogItem = calculateCatalogSelection;
export const randomCatalogItemExample = { input: { candidateIds: ["item-a", "item-b", "item-c"], datasetId: "example/catalog", datasetVersion: "1", selectionCount: 2, sourceId: "example", withReplacement: false } } satisfies ToolExample<RandomCatalogItemInput, RandomCatalogItemOutput>;

export const randomCatalogItemTool = createSimpleTool({
  calculate: (input, context) => {
    const output = calculateRandomCatalogItem({ candidateIds: input.candidateIds as string[], datasetId: input.datasetId as string, datasetVersion: input.datasetVersion as string, selectionCount: input.selectionCount as number, sourceId: input.sourceId as string, withReplacement: input.withReplacement as boolean }, context.random ?? Math.random);
    if (output === null) return simpleError("candidateIds", "Provide unique nonempty candidate IDs, source metadata, a feasible count, and valid randomness.", "invalid_catalog_selection");
    return output;
  },
  description: "Select references from caller-supplied normalized catalog records while preserving dataset and source provenance.",
  id: "random/catalog-item",
  inputs: [
    { id: "candidateIds", kind: "stringList", label: "Candidate record IDs" },
    { id: "datasetId", kind: "string", label: "Dataset ID" },
    { id: "datasetVersion", kind: "string", label: "Dataset version" },
    { id: "sourceId", kind: "string", label: "Source ID" },
    { id: "selectionCount", kind: "integer", label: "Selection count", maximum: 1000, minimum: 1 },
    { default: false, id: "withReplacement", kind: "boolean", label: "Sample with replacement", required: false },
  ],
  outputs: [
    { id: "selectedIds", kind: "stringList", label: "Selected record IDs" },
    { id: "datasetId", kind: "string", label: "Dataset ID" },
    { id: "datasetVersion", kind: "string", label: "Dataset version" },
    { id: "sourceId", kind: "string", label: "Source ID" },
  ],
  title: "Random Catalog Item Picker",
});
export const runRandomCatalogItem = randomCatalogItemTool.execute;
export default randomCatalogItemTool;
