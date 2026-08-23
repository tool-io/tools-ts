import { describe, expect, it } from "vitest";
import { multiplyExample, calculateMultiply, runMultiply } from "./tool.js";

describe("matrix/multiply", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMultiply(multiplyExample.input)).toEqual({
      ok: true,
      output: multiplyExample.output,
    });
  });
  it("rejects invalid input (shape_mismatch)", () => {
    expect(runMultiply({ first: [[1, 2]], second: [[1, 2]] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runMultiply({ first: [], second: [[1]] }).ok).toBe(false);
  });
  it("leaves a matrix unchanged under identity multiplication", () => {
    const result = runMultiply({
      first: [
        [2, 3],
        [4, 5],
      ],
      second: [
        [1, 0],
        [0, 1],
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.product).toEqual([
        [2, 3],
        [4, 5],
      ]);
  });
});
