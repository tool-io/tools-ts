import { describe, expect, it } from "vitest";
import { lockWaterVolumeExample, runLockWaterVolume } from "./tool.js";

describe("Lock Water Volume Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runLockWaterVolume(lockWaterVolumeExample.input)).toEqual({
      ok: true,
      output: { volumeCubicMeters: 5040 },
    });
  });

  it("returns length times width times change for unit values", () => {
    expect(
      runLockWaterVolume({
        chamberLengthMeters: 10,
        chamberWidthMeters: 5,
        waterLevelChangeMeters: 2,
      }),
    ).toEqual({ ok: true, output: { volumeCubicMeters: 100 } });
  });

  it("handles fractional dimensions", () => {
    const result = runLockWaterVolume({
      chamberLengthMeters: 24.5,
      chamberWidthMeters: 6.2,
      waterLevelChangeMeters: 1.75,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.volumeCubicMeters).toBeCloseTo(265.825, 10);
  });

  it("scales linearly with the water level change", () => {
    const small = runLockWaterVolume({
      chamberLengthMeters: 50,
      chamberWidthMeters: 8,
      waterLevelChangeMeters: 1,
    });
    const large = runLockWaterVolume({
      chamberLengthMeters: 50,
      chamberWidthMeters: 8,
      waterLevelChangeMeters: 4,
    });
    if (!small.ok || !large.ok) throw new Error("expected success");
    expect(large.output.volumeCubicMeters).toBe(
      Number(small.output.volumeCubicMeters) * 4,
    );
  });

  it("rejects non-positive chamber dimensions and accepts no level change", () => {
    expect(
      runLockWaterVolume({
        chamberLengthMeters: -10,
        chamberWidthMeters: 5,
        waterLevelChangeMeters: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "chamberLengthMeters" }],
      },
      ok: false,
    });
    expect(
      runLockWaterVolume({
        chamberLengthMeters: 10,
        chamberWidthMeters: 0,
        waterLevelChangeMeters: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "chamberWidthMeters" }],
      },
      ok: false,
    });
    expect(
      runLockWaterVolume({
        chamberLengthMeters: 10,
        chamberWidthMeters: 5,
        waterLevelChangeMeters: 0,
      }),
    ).toEqual({ ok: true, output: { volumeCubicMeters: 0 } });
  });

  it("rejects non-finite inputs", () => {
    expect(
      runLockWaterVolume({
        chamberLengthMeters: Number.NaN,
        chamberWidthMeters: 5,
        waterLevelChangeMeters: 2,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runLockWaterVolume({
        chamberDepthMeters: 9,
        chamberLengthMeters: 120,
        chamberWidthMeters: 14,
        waterLevelChangeMeters: 3,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "unknown_field", field: "chamberDepthMeters" }],
      },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runLockWaterVolume(null).ok).toBe(false);
    expect(runLockWaterVolume({ chamberLengthMeters: 120 }).ok).toBe(false);
  });
});
