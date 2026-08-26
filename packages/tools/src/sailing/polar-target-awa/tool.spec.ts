import { describe, expect, it } from "vitest";
import { polarTargetAwaExample, runPolarTargetAwa } from "./tool.js";

describe("Downwind AWA Guide", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPolarTargetAwa(polarTargetAwaExample.input)).toEqual({
      ok: true,
      output: { targetAwaDeg: 154 },
    });
  });

  it("returns one hundred fifty degrees for zero wind", () => {
    expect(runPolarTargetAwa({ windSpeedKt: 0 })).toEqual({
      ok: true,
      output: { targetAwaDeg: 150 },
    });
  });

  it("clamps at one hundred seventy degrees in strong wind", () => {
    expect(runPolarTargetAwa({ windSpeedKt: 67 })).toEqual({
      ok: true,
      output: { targetAwaDeg: 170 },
    });
    expect(runPolarTargetAwa({ windSpeedKt: 100 })).toEqual({
      ok: true,
      output: { targetAwaDeg: 170 },
    });
  });

  it("rounds to whole degrees", () => {
    expect(runPolarTargetAwa({ windSpeedKt: 5 })).toEqual({
      ok: true,
      output: { targetAwaDeg: 152 },
    });
  });

  it("accepts fractional wind speeds", () => {
    expect(runPolarTargetAwa({ windSpeedKt: 2.5 })).toEqual({
      ok: true,
      output: { targetAwaDeg: 151 },
    });
  });

  it("stays within the clamped band across the range", () => {
    for (const wind of [0, 10, 30, 80]) {
      const result = runPolarTargetAwa({ windSpeedKt: wind });
      if (!result.ok) throw new Error("expected success");
      expect(result.output.targetAwaDeg).toBeGreaterThanOrEqual(135);
      expect(result.output.targetAwaDeg).toBeLessThanOrEqual(170);
    }
  });

  it("rejects negative wind with a schema error", () => {
    expect(runPolarTargetAwa({ windSpeedKt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runPolarTargetAwa({ awaDegrees: 160, windSpeedKt: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "awaDegrees" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runPolarTargetAwa(null).ok).toBe(false);
    expect(runPolarTargetAwa({}).ok).toBe(false);
  });
});
