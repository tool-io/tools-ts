import { describe, expect, it } from "vitest";
import {
  calculateDockDoorUtilizationPercent,
  dockDoorUtilizationPercentExample,
  runDockDoorUtilizationPercent,
} from "./tool.js";

describe("dock-door-utilization-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDockDoorUtilizationPercent(dockDoorUtilizationPercentExample.input),
    ).toEqual({
      ok: true,
      output: dockDoorUtilizationPercentExample.output,
    });
  });

  it("reports over-capacity use above one hundred percent", () => {
    expect(
      runDockDoorUtilizationPercent({
        occupiedDoorHours: 60,
        availableDoorHours: 50,
      }),
    ).toEqual({ ok: true, output: { utilizationPercent: 120 } });
  });

  it("rejects zero available door hours", () => {
    const result = runDockDoorUtilizationPercent({
      occupiedDoorHours: 10,
      availableDoorHours: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "availableDoorHours",
    });
  });

  it("rejects non-finite hours and overflowing utilization", () => {
    expect(() =>
      calculateDockDoorUtilizationPercent({
        occupiedDoorHours: Number.NaN,
        availableDoorHours: 10,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateDockDoorUtilizationPercent({
        occupiedDoorHours: Number.MAX_VALUE,
        availableDoorHours: Number.MIN_VALUE,
      }),
    ).toThrow("too large to represent");
  });
});
