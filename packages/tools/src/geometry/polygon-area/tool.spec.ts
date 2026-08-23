import { describe, expect, it } from "vitest";
import {
  polygonAreaExample,
  calculatePolygonArea,
  runPolygonArea,
} from "./tool.js";

describe("geometry/polygon-area", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPolygonArea(polygonAreaExample.input)).toEqual({
      ok: true,
      output: polygonAreaExample.output,
    });
  });
  it("rejects invalid input (invalid_polygon)", () => {
    expect(runPolygonArea({ xs: [0, 1], ys: [0, 1, 2] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_polygon)", () => {
    expect(runPolygonArea({ xs: [0, 1], ys: [0, 1] }).ok).toBe(false);
  });
});
