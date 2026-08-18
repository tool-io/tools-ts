import { describe, expect, it } from "vitest";
import {
  calculateBilinearInterpolation,
  bilinearInterpolationExample,
  runBilinearInterpolation,
} from "./tool.js";

describe("bilinear interpolation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBilinearInterpolation(bilinearInterpolationExample.input),
    ).toEqual({ ok: true, output: bilinearInterpolationExample.output });
  });

  it("reproduces exact corners on the unit square", () => {
    const values = [[1, 2], [3, 4]];
    for (const [pointX, pointY, expected] of [
      [0, 0, 1],
      [1, 0, 2],
      [0, 1, 3],
      [1, 1, 4],
    ])
      expect(
        calculateBilinearInterpolation({ pointX, pointY, values }).value,
      ).toBe(expected);
  });

  it("honors custom grid coordinates", () => {
    const output = calculateBilinearInterpolation({
      pointX: 5,
      pointY: 10,
      values: [[0, 10], [20, 30]],
      x0: 0,
      x1: 10,
      y0: 0,
      y1: 20,
    });
    // Half-way in both directions averages the four corners.
    expect(output.value).toBe(15);
  });

  it("rejects non-2x2 grids and equal coordinates through execution", () => {
    expect(runBilinearInterpolation({ pointX: 0, pointY: 0, values: [[1]] }))
      .toMatchObject({
        error: { issues: [{ code: "not_2x2_grid" }] },
        ok: false,
      });
    expect(
      runBilinearInterpolation({
        pointX: 0,
        pointY: 0,
        values: [[0, 1], [2, 3]],
        x0: 5,
        x1: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "equal_x_coordinates" }] },
      ok: false,
    });
  });
});
