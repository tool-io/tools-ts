import { describe, expect, it } from "vitest"; import { calculateRandomTablet, randomTabletExample, runRandomTablet } from "./tool.js";
describe("Random Tablet Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomTabletExample))).toEqual(randomTabletExample);expect(runRandomTablet(randomTabletExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomTablet(randomTabletExample.input, () => 0)).toEqual({ datasetId: "example/tablet", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomTablet(randomTabletExample.input, () => 0.75)).toEqual(calculateRandomTablet(randomTabletExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomTablet({ ...randomTabletExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomTablet({ ...randomTabletExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomTablet(randomTabletExample.input, { random: () => 1 }).ok).toBe(false); });
});
