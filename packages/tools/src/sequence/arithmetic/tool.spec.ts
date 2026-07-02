import { describe, expect, it } from "vitest";
import { runArithmetic } from "./tool.js";
describe("Arithmetic Sequence Calculator", () => {
  it("calculates a valid result", () => {
    expect(runArithmetic({ firstTerm: 2, difference: 3, position: 4 })).toEqual(
      { ok: true, output: { term: 11, sum: 26 } },
    );
  });
  it("rejects invalid input", () => expect(runArithmetic(null).ok).toBe(false));
});
