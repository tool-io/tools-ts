import { describe, expect, it } from "vitest"; import { calculateRandomMonitor, randomMonitorExample, runRandomMonitor } from "./tool.js";
describe("Random Monitor Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomMonitorExample))).toEqual(randomMonitorExample);expect(runRandomMonitor(randomMonitorExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomMonitor(randomMonitorExample.input, () => 0)).toEqual({ datasetId: "example/monitor", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomMonitor(randomMonitorExample.input, () => 0.75)).toEqual(calculateRandomMonitor(randomMonitorExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomMonitor({ ...randomMonitorExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomMonitor({ ...randomMonitorExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomMonitor(randomMonitorExample.input, { random: () => 1 }).ok).toBe(false); });
});
