import { describe, expect, it } from "vitest";
import { runBatteryCapacity } from "./tool.js";

describe("Battery Capacity Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBatteryCapacity({ currentA: 1, timeHours: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.capacityAh).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runBatteryCapacity(null).ok).toBe(false));
});
