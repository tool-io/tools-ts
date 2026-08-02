import { describe, expect, it } from "vitest";
import { coefficientOfRangeExample, runCoefficientOfRange } from "./tool.js";
describe("Coefficient of Range Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCoefficientOfRange({ minimum: 2, maximum: 8 })).toEqual({
      ok: true,
      output: { coefficient: 0.6 },
    });
  });
  it("rejects invalid input", () =>
    expect(runCoefficientOfRange(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runCoefficientOfRange(coefficientOfRangeExample.input).ok).toBe(
      true,
    ));
});
