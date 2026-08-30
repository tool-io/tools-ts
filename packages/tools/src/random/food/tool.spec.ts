import { describe, expect, it } from "vitest"; import { calculateRandomFood, randomFoodExample, runRandomFood } from "./tool.js";
describe("Random Food Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomFoodExample))).toEqual(randomFoodExample);expect(runRandomFood(randomFoodExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomFood(randomFoodExample.input, () => 0)).toEqual({ datasetId: "example/food", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomFood(randomFoodExample.input, () => 0.75)).toEqual(calculateRandomFood(randomFoodExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomFood({ ...randomFoodExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomFood({ ...randomFoodExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomFood(randomFoodExample.input, { random: () => 1 }).ok).toBe(false); });
});
