import { describe, expect, it } from "vitest";
import { runWaveHeightWind, waveHeightWindExample } from "./tool.js";

describe("fully developed wave height", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWaveHeightWind(waveHeightWindExample.input)).toEqual({
      ok: true,
      output: waveHeightWindExample.output,
    });
  });

  it("quadruples height when wind speed doubles", () => {
    const gentle = runWaveHeightWind({ windSpeedKt: 10 });
    const fresh = runWaveHeightWind({ windSpeedKt: 20 });
    if (!gentle.ok || !fresh.ok) throw new Error("expected success");
    expect(gentle.output.significantWaveHeightMeters).toBeCloseTo(
      0.5667282111481495,
      12,
    );
    expect(fresh.output.significantWaveHeightMeters).toBeCloseTo(
      4 * (gentle.output.significantWaveHeightMeters as number),
      12,
    );
  });

  it("supports fractional wind speeds", () => {
    const result = runWaveHeightWind({ windSpeedKt: 12.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.significantWaveHeightMeters).toBeCloseTo(
      0.8855128299189835,
      12,
    );
  });

  it("rejects zero wind speeds through calculation and negative winds through validation", () => {
    expect(runWaveHeightWind({ windSpeedKt: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "windSpeedKt" }] },
      ok: false,
    });
    expect(runWaveHeightWind({ windSpeedKt: -10 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("accepts small positive winds at the practical boundary", () => {
    const result = runWaveHeightWind({ windSpeedKt: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.significantWaveHeightMeters).toBeGreaterThan(0);
  });

  it("rejects missing and malformed inputs", () => {
    expect(runWaveHeightWind({}).ok).toBe(false);
    expect(runWaveHeightWind({ windSpeedKt: "gale" }).ok).toBe(false);
    expect(runWaveHeightWind(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
  });
});
