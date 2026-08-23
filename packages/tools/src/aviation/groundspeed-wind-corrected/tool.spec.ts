import { describe, expect, it } from "vitest";
import { runGroundspeedWindCorrected } from "./tool.js";
describe("Groundspeed Corrected Calculator", () => {
  it("calculates a valid result with pure headwind", () =>
    expect(
      runGroundspeedWindCorrected({
        crosswindKt: 0,
        headwindKt: 20,
        trueAirspeedKt: 100,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 80 } }));
  it("gains speed with a tailwind", () =>
    expect(
      runGroundspeedWindCorrected({
        crosswindKt: 0,
        headwindKt: -20,
        trueAirspeedKt: 100,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 120 } }));
  it("handles a pure crosswind", () => {
    const result = runGroundspeedWindCorrected({
      crosswindKt: 40,
      headwindKt: 0,
      trueAirspeedKt: 100,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.groundSpeedKt).toBeCloseTo(91.6515138991168, 9);
  });
  it("combines headwind and crosswind", () => {
    const result = runGroundspeedWindCorrected({
      crosswindKt: 30,
      headwindKt: 20,
      trueAirspeedKt: 100,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.groundSpeedKt).toBeCloseTo(75.39392014169457, 9);
  });
  it("allows the crosswind to equal the airspeed", () =>
    expect(
      runGroundspeedWindCorrected({
        crosswindKt: 100,
        headwindKt: 0,
        trueAirspeedKt: 100,
      }),
    ).toEqual({ ok: true, output: { groundSpeedKt: 0 } }));
  it("rejects headwinds exceeding the airspeed", () => {
    const result = runGroundspeedWindCorrected({
      crosswindKt: 0,
      headwindKt: 60,
      trueAirspeedKt: 50,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure.");
    expect(result.error.code).toBe("invalid_input");
    expect(result.error.issues[0]?.code).toBe("insufficient_airspeed");
  });
  it("rejects crosswinds exceeding the airspeed", () => {
    const result = runGroundspeedWindCorrected({
      crosswindKt: -60,
      headwindKt: 0,
      trueAirspeedKt: 50,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure.");
    expect(result.error.issues[0]?.code).toBe("insufficient_airspeed");
  });
  it("rejects non-positive airspeeds", () =>
    expect(
      runGroundspeedWindCorrected({
        crosswindKt: 0,
        headwindKt: 0,
        trueAirspeedKt: 0,
      }).ok,
    ).toBe(false));
});
