import { describe, expect, it } from "vitest";
import { polarTargetTwaExample, runPolarTargetTwa } from "./tool.js";

describe("Upwind TWA Guide", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPolarTargetTwa(polarTargetTwaExample.input)).toEqual({
      ok: true,
      output: { targetTwaDeg: 39 },
    });
  });

  it("returns forty five degrees for zero wind", () => {
    expect(runPolarTargetTwa({ windSpeedKt: 0 })).toEqual({
      ok: true,
      output: { targetTwaDeg: 45 },
    });
  });

  it("narrows to thirty five degrees at twenty knots", () => {
    expect(runPolarTargetTwa({ windSpeedKt: 20 })).toEqual({
      ok: true,
      output: { targetTwaDeg: 35 },
    });
  });

  it("clamps at thirty degrees in strong wind", () => {
    expect(runPolarTargetTwa({ windSpeedKt: 32 })).toEqual({
      ok: true,
      output: { targetTwaDeg: 30 },
    });
    expect(runPolarTargetTwa({ windSpeedKt: 60 })).toEqual({
      ok: true,
      output: { targetTwaDeg: 30 },
    });
  });

  it("rounds half knot results to whole degrees", () => {
    expect(runPolarTargetTwa({ windSpeedKt: 21 })).toEqual({
      ok: true,
      output: { targetTwaDeg: 35 },
    });
  });

  it("accepts fractional wind speeds", () => {
    expect(runPolarTargetTwa({ windSpeedKt: 8.5 })).toEqual({
      ok: true,
      output: { targetTwaDeg: 41 },
    });
  });

  it("rejects negative wind with a schema error", () => {
    expect(runPolarTargetTwa({ windSpeedKt: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runPolarTargetTwa({ twaDegrees: 40, windSpeedKt: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "twaDegrees" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runPolarTargetTwa(null).ok).toBe(false);
    expect(runPolarTargetTwa({}).ok).toBe(false);
  });
});
