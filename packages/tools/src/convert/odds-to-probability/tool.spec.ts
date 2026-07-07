import { describe, expect, it } from "vitest";
import { runOddsToProbability } from "./tool.js";
describe("Odds to Probability Converter", () => {
  it("calculates a valid result", () => {
    expect(runOddsToProbability({ odds: 3 })).toEqual({
      ok: true,
      output: { probability: 0.75, percent: 75 },
    });
  });
  it("rejects invalid input", () =>
    expect(runOddsToProbability(null).ok).toBe(false));
});
