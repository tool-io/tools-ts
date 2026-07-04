import { describe, expect, it } from "vitest";
import { runEmpirical } from "./tool.js";
describe("Empirical Probability Calculator", () => {
  it("calculates a valid result", () => {
    expect(runEmpirical({ successes: 3, trials: 10 })).toEqual({
      ok: true,
      output: { probability: 0.3, percent: 30 },
    });
  });
  it("rejects invalid input", () => expect(runEmpirical(null).ok).toBe(false));
});
