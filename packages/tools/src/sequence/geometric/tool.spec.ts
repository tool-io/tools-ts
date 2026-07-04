import { describe, expect, it } from "vitest";
import { runGeometric } from "./tool.js";
describe("Geometric Sequence Calculator", () => {
  it("calculates a valid result", () => {
    expect(runGeometric({ firstTerm: 2, ratio: 3, position: 4 })).toEqual({
      ok: true,
      output: { term: 54, sum: 80 },
    });
  });
  it("rejects invalid input", () => expect(runGeometric(null).ok).toBe(false));
});
