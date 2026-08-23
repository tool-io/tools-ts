import { describe, expect, it } from "vitest";
import { linearExample, calculateLinear, runLinear } from "./tool.js";

describe("regression/linear", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLinear(linearExample.input)).toEqual({
      ok: true,
      output: linearExample.output,
    });
  });
  it("rejects invalid input (mismatched_lengths)", () => {
    expect(runLinear({ x: [1, 2], y: [1] }).ok).toBe(false);
  });
  it("rejects invalid input (constant_x)", () => {
    expect(runLinear({ x: [5, 5], y: [1, 2] }).ok).toBe(false);
  });
  it("recovers an exact line without residual noise", () => {
    const result = runLinear({ x: [0, 1, 2], y: [3, 5, 7] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toEqual({
      intercept: 3,
      rSquared: 1,
      slope: 2,
    });
  });

  it("fits a horizontal line to a constant response", () => {
    expect(calculateLinear({ x: [1, 2, 3], y: [7, 7, 7] })).toEqual({
      intercept: 7,
      rSquared: 1,
      slope: 0,
    });
  });
});
