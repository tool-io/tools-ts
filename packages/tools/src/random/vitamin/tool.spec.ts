import { describe, expect, it } from "vitest"; import { calculateRandomVitamin, randomVitaminExample, runRandomVitamin } from "./tool.js";
describe("Random Vitamin Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomVitaminExample))).toEqual(randomVitaminExample);expect(runRandomVitamin(randomVitaminExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomVitamin(randomVitaminExample.input, () => 0)).toEqual({ datasetId: "example/vitamin", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomVitamin(randomVitaminExample.input, () => 0.75)).toEqual(calculateRandomVitamin(randomVitaminExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomVitamin({ ...randomVitaminExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomVitamin({ ...randomVitaminExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomVitamin(randomVitaminExample.input, { random: () => 1 }).ok).toBe(false); });
});
