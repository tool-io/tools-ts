import { describe, expect, it } from "vitest";
import { moonTidePhaseExample, runMoonTidePhase } from "./tool.js";

describe("spring neap factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMoonTidePhase(moonTidePhaseExample.input)).toEqual({
      ok: true,
      output: moonTidePhaseExample.output,
    });
  });

  it("returns one again at the full-cycle boundary of 29.53 days", () => {
    expect(runMoonTidePhase({ lunarAgeDays: 29.53 })).toEqual({
      ok: true,
      output: { springNeapFactor: 1 },
    });
  });

  it("is near zero at the neaps midpoint", () => {
    const result = runMoonTidePhase({ lunarAgeDays: 7.3825 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.springNeapFactor).toBeCloseTo(0, 9);
  });

  it("stays within zero and one across the cycle", () => {
    for (const lunarAgeDays of [3.69125, 11, 14.765, 22]) {
      const result = runMoonTidePhase({ lunarAgeDays });
      if (!result.ok) throw new Error("expected success");
      expect(result.output.springNeapFactor).toBeGreaterThanOrEqual(0);
      expect(result.output.springNeapFactor).toBeLessThanOrEqual(1);
    }
  });

  it("rejects negative lunar age through validation", () => {
    expect(runMoonTidePhase({ lunarAgeDays: -0.1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lunarAgeDays" }] },
      ok: false,
    });
  });

  it("rejects ages beyond one synodic month through validation", () => {
    expect(runMoonTidePhase({ lunarAgeDays: 29.54 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lunarAgeDays" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runMoonTidePhase({}).ok).toBe(false);
    expect(runMoonTidePhase({ lunarAgeDays: "new" }).ok).toBe(false);
    expect(
      runMoonTidePhase({ lunarAgeDays: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });
});
