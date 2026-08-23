import { describe, expect, it } from "vitest";
import {
  boundingBoxExample,
  calculateBoundingBox,
  runBoundingBox,
} from "./tool.js";

describe("geometry/bounding-box", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBoundingBox(boundingBoxExample.input)).toEqual({
      ok: true,
      output: boundingBoxExample.output,
    });
  });

  it("handles negative and fractional coordinates", () => {
    const output = calculateBoundingBox({
      points: [
        [-2.5, -1],
        [3, 7.25],
      ],
    });
    expect(output).toEqual({
      height: 8.25,
      maxX: 3,
      maxY: 7.25,
      minX: -2.5,
      minY: -1,
      width: 5.5,
    });
  });

  it("collapses to a zero-size box for a single point", () => {
    const output = calculateBoundingBox({ points: [[9, -4]] });
    expect(output).toEqual({
      height: 0,
      maxX: 9,
      maxY: -4,
      minX: 9,
      minY: -4,
      width: 0,
    });
  });

  it("rejects an empty point list", () => {
    expect(runBoundingBox({ points: [] })).toMatchObject({
      error: { issues: [{ code: "empty_points" }] },
      ok: false,
    });
  });

  it("rejects rows without x and y", () => {
    expect(runBoundingBox({ points: [[1], [2, 3]] })).toMatchObject({
      error: { issues: [{ code: "invalid_point" }] },
      ok: false,
    });
  });
});
