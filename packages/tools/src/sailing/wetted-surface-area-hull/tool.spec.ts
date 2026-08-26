import { describe, expect, it } from "vitest";
import {
  runWettedSurfaceAreaHull,
  wettedSurfaceAreaHullExample,
} from "./tool.js";

describe("Wetted Surface Estimate", () => {
  it("calculates the canonical example with the default coefficient", () =>
    expect(
      runWettedSurfaceAreaHull(wettedSurfaceAreaHullExample.input),
    ).toEqual({ ok: true, output: wettedSurfaceAreaHullExample.output }));
  it("grows with the two thirds power of displacement", () =>
    expect(runWettedSurfaceAreaHull({ displacementTonnes: 64 })).toEqual({
      ok: true,
      output: { wettedSurfaceAreaM2: 40 },
    }));
  it("honours a custom coefficient", () =>
    expect(
      runWettedSurfaceAreaHull({
        displacementTonnes: 27,
        wettedCoefficient: 3,
      }),
    ).toEqual({ ok: true, output: { wettedSurfaceAreaM2: 27 } }));
  it("accepts coefficients at both bounds", () => {
    expect(
      runWettedSurfaceAreaHull({ displacementTonnes: 1, wettedCoefficient: 1 }),
    ).toEqual({ ok: true, output: { wettedSurfaceAreaM2: 1 } });
    expect(
      runWettedSurfaceAreaHull({ displacementTonnes: 1, wettedCoefficient: 4 }),
    ).toEqual({ ok: true, output: { wettedSurfaceAreaM2: 4 } });
  });
  it("rejects coefficients below one", () =>
    expect(
      runWettedSurfaceAreaHull({
        displacementTonnes: 8,
        wettedCoefficient: 0.9,
      }).ok,
    ).toBe(false));
  it("rejects coefficients above four", () =>
    expect(
      runWettedSurfaceAreaHull({
        displacementTonnes: 8,
        wettedCoefficient: 4.1,
      }).ok,
    ).toBe(false));
  it("rejects zero displacement", () => {
    const result = runWettedSurfaceAreaHull({ displacementTonnes: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_displacement");
  });
  it("rejects negative and malformed displacement", () => {
    expect(runWettedSurfaceAreaHull({ displacementTonnes: -8 }).ok).toBe(false);
    expect(runWettedSurfaceAreaHull({ displacementTonnes: "8" }).ok).toBe(
      false,
    );
    expect(runWettedSurfaceAreaHull(null).ok).toBe(false);
  });
});
