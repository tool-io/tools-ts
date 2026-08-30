import { describe, expect, it } from "vitest"; import { calculateRandomBicycle, randomBicycleExample, runRandomBicycle } from "./tool.js";
describe("Random Bicycle Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomBicycleExample))).toEqual(randomBicycleExample);expect(runRandomBicycle(randomBicycleExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomBicycle(randomBicycleExample.input, () => 0)).toEqual({ datasetId: "example/bicycle", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomBicycle(randomBicycleExample.input, () => 0.75)).toEqual(calculateRandomBicycle(randomBicycleExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomBicycle({ ...randomBicycleExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomBicycle({ ...randomBicycleExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomBicycle(randomBicycleExample.input, { random: () => 1 }).ok).toBe(false); });
});
