import { describe, expect, it } from "vitest";
import { batteryRuntimeExample, runBatteryRuntime } from "./tool.js";
describe("Battery Runtime Hours", () => {
  it("publishes an executable example", () =>
    expect(runBatteryRuntime(batteryRuntimeExample.input)).toEqual({
      ok: true,
      output: batteryRuntimeExample.output,
    }));
  it("computes fractional runtime", () =>
    expect(runBatteryRuntime({ capacityAh: 2, loadCurrentA: 4 })).toEqual({
      ok: true,
      output: { runtimeHours: 0.5 },
    }));
  it("rejects zero capacity", () =>
    expect(runBatteryRuntime({ capacityAh: 0, loadCurrentA: 1 }).ok).toBe(
      false,
    ));
  it("rejects negative load current", () =>
    expect(runBatteryRuntime({ capacityAh: 10, loadCurrentA: -1 }).ok).toBe(
      false,
    ));
});
