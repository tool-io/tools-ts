import { describe, expect, it } from "vitest"; import { calculateRandomCheese, randomCheeseExample, runRandomCheese } from "./tool.js";
describe("Random Cheese Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomCheeseExample))).toEqual(randomCheeseExample);expect(runRandomCheese(randomCheeseExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomCheese(randomCheeseExample.input, () => 0)).toEqual({ datasetId: "example/cheese", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomCheese(randomCheeseExample.input, () => 0.75)).toEqual(calculateRandomCheese(randomCheeseExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomCheese({ ...randomCheeseExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomCheese({ ...randomCheeseExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomCheese(randomCheeseExample.input, { random: () => 1 }).ok).toBe(false); });
});
