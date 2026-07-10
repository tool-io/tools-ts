import { describe, expect, it } from "vitest";
import { runTriangularNumber } from "./tool.js";
describe("Triangular Number Calculator", () => {
  it("calculates a valid result", () => {
    expect(runTriangularNumber({ position: 10 })).toEqual({
      ok: true,
      output: { triangularNumber: 55 },
    });
  });
  it("rejects invalid input", () =>
    expect(runTriangularNumber(null).ok).toBe(false));
});
