import { describe, expect, it } from "vitest";
import { runLogarithm } from "./tool.js";
describe("Logarithm with Arbitrary Base", () => {
  it("calculates a valid result", () => {
    expect(runLogarithm({ value: 8, base: 2 })).toEqual({
      ok: true,
      output: { logarithm: 3 },
    });
  });
  it("rejects invalid input", () => expect(runLogarithm(null).ok).toBe(false));
});
