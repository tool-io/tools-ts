import { describe, expect, it } from "vitest";
import { inverseExample, calculateInverse, runInverse } from "./tool.js";

describe("matrix/inverse", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runInverse(inverseExample.input)).toEqual({
      ok: true,
      output: inverseExample.output,
    });
  });
  it("rejects invalid input (singular_matrix)", () => {
    expect(
      runInverse({
        matrix: [
          [1, 2],
          [2, 4],
        ],
      }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (not_square_matrix)", () => {
    expect(runInverse({ matrix: [[1, 2], [3]] }).ok).toBe(false);
  });
});
