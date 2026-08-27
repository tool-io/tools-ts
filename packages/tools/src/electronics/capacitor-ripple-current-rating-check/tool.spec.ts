import { describe, expect, it } from "vitest";
import {
  calculateCapacitorRippleCurrentRatingCheck,
  capacitorRippleCurrentRatingCheckExample,
  runCapacitorRippleCurrentRatingCheck,
} from "./tool.js";

describe("capacitor ripple current rating check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapacitorRippleCurrentRatingCheck(
        capacitorRippleCurrentRatingCheckExample.input,
      ),
    ).toEqual({
      ok: true,
      output: capacitorRippleCurrentRatingCheckExample.output,
    });
  });

  it("reports zero margin when applied ripple equals the rating", () => {
    expect(
      calculateCapacitorRippleCurrentRatingCheck({
        appliedRippleAmps: 1.2,
        ratedRippleAmps: 1.2,
      }).rippleMarginPercent,
    ).toBeCloseTo(0, 15);
  });

  it("reports negative margin when the rating is exceeded", () => {
    expect(
      calculateCapacitorRippleCurrentRatingCheck({
        appliedRippleAmps: 0.5,
        ratedRippleAmps: 0.25,
      }).rippleMarginPercent,
    ).toBe(-50);
  });

  it("doubles the margin each time applied ripple halves below the rating", () => {
    const quarter = calculateCapacitorRippleCurrentRatingCheck({
      appliedRippleAmps: 0.125,
      ratedRippleAmps: 0.5,
    }).rippleMarginPercent;
    const half = calculateCapacitorRippleCurrentRatingCheck({
      appliedRippleAmps: 0.25,
      ratedRippleAmps: 0.5,
    }).rippleMarginPercent;
    expect(half).toBe(100);
    expect(quarter).toBe(300);
    expect(quarter - half).toBeGreaterThan(half);
  });

  it("rejects non-positive currents through execution", () => {
    expect(
      runCapacitorRippleCurrentRatingCheck({
        appliedRippleAmps: 1,
        ratedRippleAmps: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "ratedRippleAmps" }],
      },
      ok: false,
    });
    expect(
      runCapacitorRippleCurrentRatingCheck({
        appliedRippleAmps: -1,
        ratedRippleAmps: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "appliedRippleAmps" }],
      },
      ok: false,
    });
  });

  it("computes the signed margin from the ratio of rated over applied", () => {
    const result = calculateCapacitorRippleCurrentRatingCheck({
      appliedRippleAmps: 1.2,
      ratedRippleAmps: 1.5,
    });
    expect(result.rippleMarginPercent).toBeCloseTo((1.5 / 1.2 - 1) * 100, 15);
  });
});
