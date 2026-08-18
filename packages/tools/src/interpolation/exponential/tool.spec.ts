import { describe, expect, it } from "vitest";
import {
  calculateExponentialInterpolation,
  exponentialInterpolationExample,
  runExponentialInterpolation,
} from "./tool.js";

describe("exponential interpolation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runExponentialInterpolation(exponentialInterpolationExample.input),
    ).toEqual({ ok: true, output: exponentialInterpolationExample.output });
  });

  it("returns endpoints and preserves negative curves", () => {
    expect(
      calculateExponentialInterpolation({
        x: 0,
        x0: 0,
        x1: 2,
        y0: 1,
        y1: 4,
      }),
    ).toEqual({ y: 1 });
    expect(
      calculateExponentialInterpolation({
        x: 1,
        x0: 0,
        x1: 2,
        y0: -1,
        y1: -4,
      }).y,
    ).toBe(-2);
  });

  it("rejects shared x points and sign-mixed ranges through execution", () => {
    expect(
      runExponentialInterpolation({
        x: 1,
        x0: 1,
        x1: 1,
        y0: 1,
        y1: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "equal_x_points" }] },
      ok: false,
    });
    expect(
      runExponentialInterpolation({
        x: 1,
        x0: 0,
        x1: 2,
        y0: -1,
        y1: 4,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_y_range" }] },
      ok: false,
    });
  });
});
