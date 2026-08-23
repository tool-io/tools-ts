import { describe, expect, it } from "vitest";
import {
  polylineLengthExample,
  calculatePolylineLength,
  runPolylineLength,
} from "./tool.js";

describe("geometry/polyline-length", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPolylineLength(polylineLengthExample.input)).toEqual({
      ok: true,
      output: polylineLengthExample.output,
    });
  });
  it("rejects invalid input (invalid_polyline)", () => {
    expect(runPolylineLength({ xs: [0, 1], ys: [0] }).ok).toBe(false);
  });
});
