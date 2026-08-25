import { describe, expect, it } from "vitest";
import {
  horizonVisibilityRangeExample,
  runHorizonVisibilityRange,
} from "./tool.js";

describe("Horizon Range Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runHorizonVisibilityRange(horizonVisibilityRangeExample.input),
    ).toEqual({ ok: true, output: { horizonRangeNm: 3.51 } });
  });

  it("returns the bare coefficient for a one foot height", () => {
    const result = runHorizonVisibilityRange({ observerHeightFeet: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.horizonRangeNm).toBeCloseTo(1.17, 10);
  });

  it("handles perfect square heights exactly", () => {
    expect(runHorizonVisibilityRange({ observerHeightFeet: 16 })).toEqual({
      ok: true,
      output: { horizonRangeNm: 4.68 },
    });
    expect(runHorizonVisibilityRange({ observerHeightFeet: 25 })).toEqual({
      ok: true,
      output: { horizonRangeNm: 5.85 },
    });
  });

  it("grows with the square root for non-square heights", () => {
    const result = runHorizonVisibilityRange({ observerHeightFeet: 60 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.horizonRangeNm).toBeCloseTo(9.062781030125356, 10);
  });

  it("doubles the range for four times the height", () => {
    const low = runHorizonVisibilityRange({ observerHeightFeet: 10 });
    const high = runHorizonVisibilityRange({ observerHeightFeet: 40 });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.horizonRangeNm).toBeCloseTo(
      Number(low.output.horizonRangeNm) * 2,
      10,
    );
  });

  it("returns zero at water level and rejects negative heights", () => {
    expect(runHorizonVisibilityRange({ observerHeightFeet: 0 })).toEqual({
      ok: true,
      output: { horizonRangeNm: 0 },
    });
    expect(runHorizonVisibilityRange({ observerHeightFeet: -6 }).ok).toBe(
      false,
    );
  });

  it("rejects non-finite heights", () => {
    expect(
      runHorizonVisibilityRange({ observerHeightFeet: Number.NaN }).ok,
    ).toBe(false);
    expect(
      runHorizonVisibilityRange({
        observerHeightFeet: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runHorizonVisibilityRange({
        deckHeightFt: 4,
        observerHeightFeet: 9,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "deckHeightFt" }] },
      ok: false,
    });
    expect(runHorizonVisibilityRange(null).ok).toBe(false);
    expect(runHorizonVisibilityRange({}).ok).toBe(false);
  });
});
