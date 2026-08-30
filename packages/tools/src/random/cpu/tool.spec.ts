import { describe, expect, it } from "vitest"; import { calculateRandomCpu, randomCpuExample, runRandomCpu } from "./tool.js";
describe("Random CPU Picker", () => {
  it("selects exact IDs and preserves provenance", () => { expect(JSON.parse(JSON.stringify(randomCpuExample))).toEqual(randomCpuExample);expect(runRandomCpu(randomCpuExample.input,{random:()=>0}).ok).toBe(true); expect(calculateRandomCpu(randomCpuExample.input, () => 0)).toEqual({ datasetId: "example/cpu", datasetVersion: "1", selectedIds: ["candidate-a", "candidate-b"], sourceId: "example" }); });
  it("is deterministic with injected randomness", () => { expect(calculateRandomCpu(randomCpuExample.input, () => 0.75)).toEqual(calculateRandomCpu(randomCpuExample.input, () => 0.75)); });
  it("rejects invalid pools and randomness", () => { expect(runRandomCpu({ ...randomCpuExample.input, candidateIds: [] }).ok).toBe(false); expect(runRandomCpu({ ...randomCpuExample.input, selectionCount: 4 }).ok).toBe(false); expect(runRandomCpu(randomCpuExample.input, { random: () => 1 }).ok).toBe(false); });
});
