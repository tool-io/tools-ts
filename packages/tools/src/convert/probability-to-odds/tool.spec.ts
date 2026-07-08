import { describe, expect, it } from "vitest";
import { runProbabilityToOdds } from "./tool.js";
describe("Probability to Odds Converter", () => {
  it("calculates a valid result", () => {
    expect(runProbabilityToOdds({ probability: 0.75 })).toEqual({
      ok: true,
      output: { odds: 3 },
    });
  });
  it("rejects invalid input", () =>
    expect(runProbabilityToOdds({ probability: 1 }).ok).toBe(false));
});
