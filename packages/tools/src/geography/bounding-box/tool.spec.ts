import { describe, expect, it } from "vitest";
import {
  boundingBoxExample,
  calculateBoundingBox,
  runBoundingBox,
} from "./tool.js";

describe("geography/bounding-box", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBoundingBox(boundingBoxExample.input)).toEqual({
      ok: true,
      output: boundingBoxExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBoundingBox({
        centerLatitudeDeg: 0,
        centerLongitudeDeg: 0,
        radiusM: 0,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBoundingBox({
        centerLatitudeDeg: 0,
        centerLongitudeDeg: 0,
        radiusM: 30000000,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(
      runBoundingBox({
        centerLatitudeDeg: 91,
        centerLongitudeDeg: 0,
        radiusM: 1000,
      }).ok,
    ).toBe(false);
  });
  it("spans every longitude when the circle reaches a pole", () => {
    const result = runBoundingBox({
      centerLatitudeDeg: 89.99,
      centerLongitudeDeg: 10,
      radiusM: 50000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.crossesPoles).toBe(true);
      expect(result.output.minLongitudeDeg).toBe(-170);
      expect(result.output.maxLongitudeDeg).toBe(190);
    }
  });

  it("clamps latitudes at the poles", () => {
    const result = runBoundingBox({
      centerLatitudeDeg: -89.999,
      centerLongitudeDeg: 0,
      radiusM: 5000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.minLatitudeDeg).toBe(-90);
  });
});
