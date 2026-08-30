import { describe, expect, it } from "vitest"; import { calculateRandomBread, randomBreadExample, runRandomBread } from "./tool.js";
describe("Random Bread Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomBreadExample))).toEqual(randomBreadExample);expect(runRandomBread(randomBreadExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomBread(randomBreadExample.input, () => 0)).toEqual({ datasetId: "example/bread", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomBread(randomBreadExample.input, () => 0.75)).toEqual(calculateRandomBread(randomBreadExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomBread({ ...randomBreadExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomBread({ ...randomBreadExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomBread(randomBreadExample.input, { random: () => 1 }).ok).toBe(false); });
});
