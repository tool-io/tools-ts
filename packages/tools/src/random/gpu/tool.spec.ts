import { describe, expect, it } from "vitest"; import { calculateRandomGpu, randomGpuExample, runRandomGpu } from "./tool.js";
describe("Random GPU Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomGpuExample))).toEqual(randomGpuExample);expect(runRandomGpu(randomGpuExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomGpu(randomGpuExample.input, () => 0)).toEqual({ datasetId: "example/gpu", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomGpu(randomGpuExample.input, () => 0.75)).toEqual(calculateRandomGpu(randomGpuExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomGpu({ ...randomGpuExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomGpu({ ...randomGpuExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomGpu(randomGpuExample.input, { random: () => 1 }).ok).toBe(false); });
});
