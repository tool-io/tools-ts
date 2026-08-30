import { describe, expect, it } from "vitest"; import { calculateRandomFruit, randomFruitExample, runRandomFruit } from "./tool.js";
describe("Random Fruit Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomFruitExample))).toEqual(randomFruitExample);expect(runRandomFruit(randomFruitExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomFruit(randomFruitExample.input, () => 0)).toEqual({ datasetId: "example/fruit", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomFruit(randomFruitExample.input, () => 0.75)).toEqual(calculateRandomFruit(randomFruitExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomFruit({ ...randomFruitExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomFruit({ ...randomFruitExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomFruit(randomFruitExample.input, { random: () => 1 }).ok).toBe(false); });
});
