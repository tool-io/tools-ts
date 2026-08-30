import { describe, expect, it } from "vitest"; import { calculateRandomServer, randomServerExample, runRandomServer } from "./tool.js";
describe("Random Server Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomServerExample))).toEqual(randomServerExample);expect(runRandomServer(randomServerExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomServer(randomServerExample.input, () => 0)).toEqual({ datasetId: "example/server", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomServer(randomServerExample.input, () => 0.75)).toEqual(calculateRandomServer(randomServerExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomServer({ ...randomServerExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomServer({ ...randomServerExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomServer(randomServerExample.input, { random: () => 1 }).ok).toBe(false); });
});
