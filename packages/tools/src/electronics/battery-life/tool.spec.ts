import { describe, expect, it } from "vitest";
import {
  batteryLifeExample,
  calculateBatteryLife,
  runBatteryLife,
} from "./tool.js";

describe("battery life calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBatteryLife(batteryLifeExample.input)).toEqual({
      ok: true,
      output: batteryLifeExample.output,
    });
  });

  it("halves runtime when the load doubles", () => {
    const base = calculateBatteryLife({
      capacityMah: 2000,
      loadMa: 500,
    }).runtimeHours;
    expect(base).toBe(4);
    expect(
      calculateBatteryLife({ capacityMah: 2000, loadMa: 1000 }).runtimeHours,
    ).toBe(2);
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { capacityMah: 0, loadMa: 500 },
      { capacityMah: 2000, loadMa: -500 },
    ])
      expect(runBatteryLife(bad).ok).toBe(false);
  });
});
