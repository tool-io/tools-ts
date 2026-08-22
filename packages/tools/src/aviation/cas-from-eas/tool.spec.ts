import { describe, expect, it } from "vitest";
import { casFromEasExample, runCasFromEas } from "./tool.js";

describe("cas from eas calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCasFromEas(casFromEasExample.input)).toEqual({
      ok: true,
      output: casFromEasExample.output,
    });
  });

  it("collapses to the same speed as EAS at sea level", () => {
    const result = runCasFromEas({
      equivalentAirspeedKt: 250,
      pressureAltitudeFt: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.casKt).toBeCloseTo(250, 6);
  });

  it("exceeds EAS at cruise altitude", () => {
    const result = runCasFromEas({
      equivalentAirspeedKt: 200,
      pressureAltitudeFt: 20000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.casKt).toBeGreaterThan(200);
    expect(result.output.casKt).toBeCloseTo(295.0351647117714, 9);
  });

  it("grows with altitude for fixed EAS", () => {
    const low = runCasFromEas({
      equivalentAirspeedKt: 150,
      pressureAltitudeFt: 5000,
    });
    const high = runCasFromEas({
      equivalentAirspeedKt: 150,
      pressureAltitudeFt: 25000,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(Number(high.output.casKt)).toBeGreaterThan(Number(low.output.casKt));
    expect(low.output.casKt).toBeGreaterThan(150);
  });

  it("stays finite across the full troposphere band", () => {
    const top = runCasFromEas({
      equivalentAirspeedKt: 200,
      pressureAltitudeFt: 36000,
    });
    if (!top.ok) throw new Error("expected success");
    expect(top.output.casKt).toBeCloseTo(422.2883041760025, 9);
  });

  it("handles slow speeds near the stall region", () => {
    const result = runCasFromEas({
      equivalentAirspeedKt: 80,
      pressureAltitudeFt: 5000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.casKt).toBeCloseTo(87.7036093236198, 9);
  });

  it("rejects non-positive equivalent airspeeds", () => {
    const result = runCasFromEas({
      equivalentAirspeedKt: 0,
      pressureAltitudeFt: 5000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_equivalent_airspeed");
  });

  it("rejects altitudes outside the model range", () => {
    expect(
      runCasFromEas({ equivalentAirspeedKt: 200, pressureAltitudeFt: -1 }),
    ).toMatchObject({ ok: false });
    expect(
      runCasFromEas({ equivalentAirspeedKt: 200, pressureAltitudeFt: 36001 }),
    ).toMatchObject({ ok: false });
  });

  it("rejects missing inputs", () => {
    expect(runCasFromEas({ equivalentAirspeedKt: 200 })).toMatchObject({
      ok: false,
    });
  });
});
