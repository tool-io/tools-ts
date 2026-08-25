import { describe, expect, it } from "vitest";
import {
  HORIZON_COEFFICIENT_NM_PER_SQRT_FT,
  horizonDistanceExample,
  runHorizonDistance,
} from "./tool.js";

describe("Horizon Distance Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runHorizonDistance(horizonDistanceExample.input)).toEqual({
      ok: true,
      output: { horizonDistanceNm: 3.51 },
    });
  });

  it("returns the bare coefficient for a one foot height", () => {
    expect(runHorizonDistance({ heightAboveWaterFeet: 1 })).toEqual({
      ok: true,
      output: { horizonDistanceNm: HORIZON_COEFFICIENT_NM_PER_SQRT_FT },
    });
  });

  it("handles perfect square heights exactly", () => {
    expect(runHorizonDistance({ heightAboveWaterFeet: 16 })).toEqual({
      ok: true,
      output: { horizonDistanceNm: 4.68 },
    });
    expect(runHorizonDistance({ heightAboveWaterFeet: 100 })).toEqual({
      ok: true,
      output: { horizonDistanceNm: 11.7 },
    });
  });

  it("grows with the square root for non-square heights", () => {
    const result = runHorizonDistance({ heightAboveWaterFeet: 60 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.horizonDistanceNm).toBeCloseTo(9.062781030125356, 10);
  });

  it("returns zero range at water level", () => {
    expect(runHorizonDistance({ heightAboveWaterFeet: 0 })).toEqual({
      ok: true,
      output: { horizonDistanceNm: 0 },
    });
  });

  it("rejects negative heights", () => {
    expect(runHorizonDistance({ heightAboveWaterFeet: -3 }).ok).toBe(false);
  });

  it("rejects non-finite heights", () => {
    expect(runHorizonDistance({ heightAboveWaterFeet: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runHorizonDistance({
        heightAboveWaterFeet: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runHorizonDistance({ eyeHeightM: 2, heightAboveWaterFeet: 9 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "eyeHeightM" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runHorizonDistance(null).ok).toBe(false);
    expect(runHorizonDistance({}).ok).toBe(false);
  });
});
