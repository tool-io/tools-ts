import { describe, expect, it } from "vitest";
import { runLinear } from "./tool.js";
describe("Linear Interpolation Calculator", () => {
  it("calculates a valid result", () => {
    expect(runLinear({ start: 10, end: 20, parameter: 0.25 })).toEqual({
      ok: true,
      output: { value: 12.5 },
    });
  });
  it("rejects invalid input", () => expect(runLinear(null).ok).toBe(false));
});
