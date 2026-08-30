import { describe, expect, it } from "vitest";
import { calculateRandomCatalogItem, randomCatalogItemExample, runRandomCatalogItem } from "./tool.js";
describe("Random Catalog Item Picker", () => {
  it("selects exact IDs without replacement and preserves provenance", () => {
    expect(JSON.parse(JSON.stringify(randomCatalogItemExample))).toEqual(randomCatalogItemExample);expect(runRandomCatalogItem(randomCatalogItemExample.input,{random:()=>0}).ok).toBe(true);
    expect(calculateRandomCatalogItem(randomCatalogItemExample.input, () => 0)).toEqual({ datasetId: "example/catalog", datasetVersion: "1", selectedIds: ["item-a", "item-b"], sourceId: "example" });
  });
  it("supports explicit sampling with replacement", () => {
    expect(calculateRandomCatalogItem({ ...randomCatalogItemExample.input, selectionCount: 3, withReplacement: true }, () => 0.999)).toMatchObject({ selectedIds: ["item-c", "item-c", "item-c"] });
  });
  it("rejects duplicate IDs, infeasible counts, and invalid randomness", () => {
    expect(runRandomCatalogItem({ ...randomCatalogItemExample.input, candidateIds: ["x", "x"] }).ok).toBe(false);
    expect(runRandomCatalogItem({ ...randomCatalogItemExample.input, selectionCount: 4 }).ok).toBe(false);
    expect(runRandomCatalogItem(randomCatalogItemExample.input, { random: () => 1 }).ok).toBe(false);
  });
});
