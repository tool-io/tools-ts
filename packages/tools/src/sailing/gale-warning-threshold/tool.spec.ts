import { describe, expect, it } from "vitest";
import {
  galeWarningThresholdExample,
  runGaleWarningThreshold,
} from "./tool.js";

describe("Gale Warning Check", () => {
  it("calculates the canonical example exactly", () => {
    expect(runGaleWarningThreshold(galeWarningThresholdExample.input)).toEqual({
      ok: true,
      output: { isGaleForce: true },
    });
  });

  it("starts gale force at exactly thirty-four knots", () => {
    expect(runGaleWarningThreshold({ windSpeedKt: 33.9 })).toEqual({
      ok: true,
      output: { isGaleForce: false },
    });
    expect(runGaleWarningThreshold({ windSpeedKt: 34 })).toEqual({
      ok: true,
      output: { isGaleForce: true },
    });
  });

  it("ends gale force below forty-eight knots", () => {
    expect(runGaleWarningThreshold({ windSpeedKt: 47.9 })).toEqual({
      ok: true,
      output: { isGaleForce: true },
    });
    expect(runGaleWarningThreshold({ windSpeedKt: 48 })).toEqual({
      ok: true,
      output: { isGaleForce: false },
    });
  });

  it("returns false for calm and light winds", () => {
    expect(runGaleWarningThreshold({ windSpeedKt: 0 })).toEqual({
      ok: true,
      output: { isGaleForce: false },
    });
    expect(runGaleWarningThreshold({ windSpeedKt: 15 })).toEqual({
      ok: true,
      output: { isGaleForce: false },
    });
  });

  it("returns false for hurricane strength winds", () => {
    expect(runGaleWarningThreshold({ windSpeedKt: 70 })).toEqual({
      ok: true,
      output: { isGaleForce: false },
    });
  });

  it("accepts fractional wind speeds inside the band", () => {
    expect(runGaleWarningThreshold({ windSpeedKt: 40.5 })).toEqual({
      ok: true,
      output: { isGaleForce: true },
    });
  });

  it("rejects negative wind speed at the schema level", () => {
    expect(runGaleWarningThreshold({ windSpeedKt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runGaleWarningThreshold({ gustKt: 50, windSpeedKt: 36 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "gustKt" }] },
      ok: false,
    });
    expect(runGaleWarningThreshold(null).ok).toBe(false);
    expect(runGaleWarningThreshold({}).ok).toBe(false);
  });
});
