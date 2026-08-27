import { describe, expect, it } from "vitest";
import { capacityFromRuntimeExample, runCapacityFromRuntime } from "./tool.js";
describe("Capacity From Runtime", () => {
  it("publishes an executable example", () =>
    expect(runCapacityFromRuntime(capacityFromRuntimeExample.input)).toEqual({
      ok: true,
      output: capacityFromRuntimeExample.output,
    }));
  it("scales with load current", () =>
    expect(
      runCapacityFromRuntime({ loadCurrentA: 2, runtimeHours: 10 }),
    ).toEqual({ ok: true, output: { capacityAh: 20 } }));
  it("rejects zero load current", () =>
    expect(
      runCapacityFromRuntime({ loadCurrentA: 0, runtimeHours: 1 }).ok,
    ).toBe(false));
  it("rejects negative runtime", () =>
    expect(
      runCapacityFromRuntime({ loadCurrentA: 1, runtimeHours: -2 }).ok,
    ).toBe(false));
});
