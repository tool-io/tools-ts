import { describe, expect, it } from "vitest";
import { runAdd } from "./tool.js";
describe("Vector Addition Calculator", () => {
  it("calculates a valid result", () => {
    expect(runAdd({ first: [1, 2], second: [3, 4] })).toEqual({
      ok: true,
      output: { vector: [4, 6] },
    });
  });
  it("rejects invalid input", () => expect(runAdd(null).ok).toBe(false));
});
