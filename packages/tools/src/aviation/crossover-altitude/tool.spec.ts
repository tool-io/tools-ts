import { describe, expect, it } from "vitest";
import { crossoverAltitudeExample, runCrossoverAltitude } from "./tool.js";

describe("crossover altitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCrossoverAltitude(crossoverAltitudeExample.input)).toEqual({
      ok: true,
      output: crossoverAltitudeExample.output,
    });
  });

  it("lands in the expected band for Mach 0.80 and CAS 300", () => {
    const result = runCrossoverAltitude({ casKt: 300, machNumber: 0.8 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.crossoverAltitudeFt).toBeGreaterThan(24000);
    expect(result.output.crossoverAltitudeFt).toBeLessThan(29000);
  });

  it("lowers the crossover altitude as CAS increases at constant Mach", () => {
    const lower = runCrossoverAltitude({ casKt: 300, machNumber: 0.8 });
    const higher = runCrossoverAltitude({ casKt: 350, machNumber: 0.8 });
    if (!lower.ok || !higher.ok) throw new Error("expected success");
    expect(higher.output.crossoverAltitudeFt).toBeLessThan(
      Number(lower.output.crossoverAltitudeFt),
    );
  });

  it("raises the crossover altitude as Mach increases at constant CAS", () => {
    const slow = runCrossoverAltitude({ casKt: 300, machNumber: 0.8 });
    const fast = runCrossoverAltitude({ casKt: 300, machNumber: 0.85 });
    if (!slow.ok || !fast.ok) throw new Error("expected success");
    expect(fast.output.crossoverAltitudeFt).toBeGreaterThan(
      Number(slow.output.crossoverAltitudeFt),
    );
  });

  it("converges to a stable altitude across repeated runs", () => {
    const first = runCrossoverAltitude({ casKt: 250, machNumber: 0.7 });
    const second = runCrossoverAltitude({ casKt: 250, machNumber: 0.7 });
    if (!first.ok || !second.ok) throw new Error("expected success");
    expect(second.output.crossoverAltitudeFt).toBe(
      first.output.crossoverAltitudeFt,
    );
  });

  it("rejects combinations without a crossing with no_crossing_error", () => {
    expect(runCrossoverAltitude({ casKt: 100, machNumber: 0.1 })).toMatchObject(
      {
        error: { issues: [{ code: "no_crossing_error" }] },
        ok: false,
      },
    );
  });

  it("rejects Mach numbers below 0.1 through validation", () => {
    expect(runCrossoverAltitude({ casKt: 300, machNumber: 0.09 }).ok).toBe(
      false,
    );
  });

  it("rejects Mach numbers above 0.95 through validation", () => {
    expect(runCrossoverAltitude({ casKt: 300, machNumber: 0.96 }).ok).toBe(
      false,
    );
  });

  it("rejects CAS below 100 knots through validation", () => {
    expect(runCrossoverAltitude({ casKt: 99, machNumber: 0.8 }).ok).toBe(false);
  });

  it("rejects CAS above 400 knots through validation", () => {
    expect(runCrossoverAltitude({ casKt: 401, machNumber: 0.8 }).ok).toBe(
      false,
    );
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { casKt: Number.NaN, machNumber: 0.8 },
      { casKt: 300, machNumber: Number.POSITIVE_INFINITY },
    ])
      expect(runCrossoverAltitude(bad).ok).toBe(false);
  });
});
