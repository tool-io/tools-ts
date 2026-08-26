import { describe, expect, it } from "vitest";
import { polarHeelTargetExample, runPolarHeelTarget } from "./tool.js";

describe("Heel Target Guide", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPolarHeelTarget(polarHeelTargetExample.input)).toEqual({
      ok: true,
      output: { targetHeelDeg: 10 },
    });
  });

  it("clamps at five degrees in light air", () => {
    expect(runPolarHeelTarget({ windSpeedKt: 0 })).toEqual({
      ok: true,
      output: { targetHeelDeg: 5 },
    });
    expect(runPolarHeelTarget({ windSpeedKt: 4 })).toEqual({
      ok: true,
      output: { targetHeelDeg: 5 },
    });
  });

  it("clamps at thirty degrees in heavy air", () => {
    expect(runPolarHeelTarget({ windSpeedKt: 50 })).toEqual({
      ok: true,
      output: { targetHeelDeg: 30 },
    });
  });

  it("rounds eight tenths products to whole degrees", () => {
    expect(runPolarHeelTarget({ windSpeedKt: 13 })).toEqual({
      ok: true,
      output: { targetHeelDeg: 10 },
    });
  });

  it("reaches twenty degrees at twenty five knots", () => {
    expect(runPolarHeelTarget({ windSpeedKt: 25 })).toEqual({
      ok: true,
      output: { targetHeelDeg: 20 },
    });
  });

  it("stays within the clamped band across the range", () => {
    for (const wind of [0, 6, 18, 45]) {
      const result = runPolarHeelTarget({ windSpeedKt: wind });
      if (!result.ok) throw new Error("expected success");
      expect(result.output.targetHeelDeg).toBeGreaterThanOrEqual(5);
      expect(result.output.targetHeelDeg).toBeLessThanOrEqual(30);
    }
  });

  it("rejects negative wind with a schema error", () => {
    expect(runPolarHeelTarget({ windSpeedKt: -2 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runPolarHeelTarget({ gustSpeedKt: 20, windSpeedKt: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "gustSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runPolarHeelTarget(null).ok).toBe(false);
    expect(runPolarHeelTarget({}).ok).toBe(false);
  });
});
