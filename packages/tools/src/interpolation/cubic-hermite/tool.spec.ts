import { describe, expect, it } from "vitest";
import {
  calculateCubicHermite,
  cubicHermiteExample,
  runCubicHermite,
} from "./tool.js";

describe("cubic hermite interpolation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCubicHermite(cubicHermiteExample.input)).toEqual({
      ok: true,
      output: cubicHermiteExample.output,
    });
  });

  it("matches endpoints and respects tangents", () => {
    expect(
      calculateCubicHermite({ m0: 5, m1: -3, p0: 2, p1: 8, t: 0 }),
    ).toEqual({ value: 2 });
    expect(
      calculateCubicHermite({ m0: 5, m1: -3, p0: 2, p1: 8, t: 1 }),
    ).toEqual({ value: 8 });
    // A large positive start tangent overshoots the endpoint mid-curve.
    const overshoot = calculateCubicHermite({
      m0: 40,
      m1: 0,
      p0: 0,
      p1: 10,
      t: 0.25,
    });
    expect(overshoot.value).toBeGreaterThan(2.5);
  });

  it("rejects out-of-range t through execution", () => {
    for (const t of [-0.01, 1.01]) {
      expect(
        runCubicHermite({ m0: 0, m1: 0, p0: 0, p1: 1, t }).ok,
      ).toBe(false);
      expect(() =>
        calculateCubicHermite({ m0: 0, m1: 0, p0: 0, p1: 1, t }),
      ).toThrow(/between zero and one/);
    }
  });
});
