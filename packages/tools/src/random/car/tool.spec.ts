import { describe, expect, it } from "vitest"; import { calculateRandomCar, randomCarExample, runRandomCar } from "./tool.js";
describe("Random Car Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomCarExample))).toEqual(randomCarExample);expect(runRandomCar(randomCarExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomCar(randomCarExample.input, () => 0)).toEqual({ datasetId: "example/car", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomCar(randomCarExample.input, () => 0.75)).toEqual(calculateRandomCar(randomCarExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomCar({ ...randomCarExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomCar({ ...randomCarExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomCar(randomCarExample.input, { random: () => 1 }).ok).toBe(false); });
});
