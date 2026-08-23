import { describe, expect, it } from "vitest";
import { reshapeExample, calculateReshape, runReshape } from "./tool.js";

describe("matrix/reshape", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReshape(reshapeExample.input)).toEqual({
      ok: true,
      output: reshapeExample.output,
    });
  });
  it("rejects invalid input (shape_mismatch)", () => {
    expect(
      runReshape({
        matrix: [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
        rows: 2,
        columns: 2,
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runReshape({ matrix: [], rows: 1, columns: 1 }).ok).toBe(false);
  });
  it("preserves row-major order when reflowing", () => {
    const result = runReshape({
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      rows: 3,
      columns: 2,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.reshaped).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
  });
});
