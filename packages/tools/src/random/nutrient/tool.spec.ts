import { describe, expect, it } from "vitest"; import { calculateRandomNutrient, randomNutrientExample, runRandomNutrient } from "./tool.js";
describe("Random Nutrient Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomNutrientExample))).toEqual(randomNutrientExample);expect(runRandomNutrient(randomNutrientExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomNutrient(randomNutrientExample.input, () => 0)).toEqual({ datasetId: "example/nutrient", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomNutrient(randomNutrientExample.input, () => 0.75)).toEqual(calculateRandomNutrient(randomNutrientExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomNutrient({ ...randomNutrientExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomNutrient({ ...randomNutrientExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomNutrient(randomNutrientExample.input, { random: () => 1 }).ok).toBe(false); });
});
