import { describe, expect, it } from "vitest";
import { runLogOdds } from "./tool.js";
describe("Log-Odds Calculator", () => {
  it("calculates a valid result", () => {
    expect(runLogOdds({ probability: 0.5 })).toEqual({
      ok: true,
      output: { logOdds: 0 },
    });
  });
  it("rejects invalid input", () => expect(runLogOdds(null).ok).toBe(false));
});
