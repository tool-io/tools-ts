import { describe, expect, it } from "vitest";
import { runInverseLinear } from "./tool.js";
describe("Inverse Linear Interpolation Calculator", () => {
  it("calculates a valid result", () => {
    expect(runInverseLinear({ start: 10, end: 20, value: 12.5 })).toEqual({
      ok: true,
      output: { parameter: 0.25 },
    });
  });
  it("rejects invalid input", () =>
    expect(runInverseLinear(null).ok).toBe(false));
});
