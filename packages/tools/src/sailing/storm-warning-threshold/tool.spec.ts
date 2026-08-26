import { describe, expect, it } from "vitest";
import {
  runStormWarningThreshold,
  stormWarningThresholdExample,
} from "./tool.js";

describe("Storm Warning Check", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runStormWarningThreshold(stormWarningThresholdExample.input),
    ).toEqual({
      ok: true,
      output: { isStormForce: true },
    });
  });

  it("starts storm force at exactly forty-eight knots", () => {
    expect(runStormWarningThreshold({ windSpeedKt: 47.9 })).toEqual({
      ok: true,
      output: { isStormForce: false },
    });
    expect(runStormWarningThreshold({ windSpeedKt: 48 })).toEqual({
      ok: true,
      output: { isStormForce: true },
    });
  });

  it("ends storm force below sixty-four knots", () => {
    expect(runStormWarningThreshold({ windSpeedKt: 63.9 })).toEqual({
      ok: true,
      output: { isStormForce: true },
    });
    expect(runStormWarningThreshold({ windSpeedKt: 64 })).toEqual({
      ok: true,
      output: { isStormForce: false },
    });
  });

  it("returns false for winds below gale strength", () => {
    expect(runStormWarningThreshold({ windSpeedKt: 34 })).toEqual({
      ok: true,
      output: { isStormForce: false },
    });
    expect(runStormWarningThreshold({ windSpeedKt: 0 })).toEqual({
      ok: true,
      output: { isStormForce: false },
    });
  });

  it("returns false for violent storm and hurricane winds", () => {
    expect(runStormWarningThreshold({ windSpeedKt: 80 })).toEqual({
      ok: true,
      output: { isStormForce: false },
    });
  });

  it("accepts fractional wind speeds inside the band", () => {
    expect(runStormWarningThreshold({ windSpeedKt: 55.5 })).toEqual({
      ok: true,
      output: { isStormForce: true },
    });
  });

  it("rejects negative wind speed at the schema level", () => {
    expect(runStormWarningThreshold({ windSpeedKt: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runStormWarningThreshold({ seaState: 8, windSpeedKt: 50 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "seaState" }] },
      ok: false,
    });
    expect(runStormWarningThreshold(null).ok).toBe(false);
    expect(runStormWarningThreshold({}).ok).toBe(false);
  });
});
