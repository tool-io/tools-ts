import { describe, expect, it } from "vitest";
import { runReactionYieldMass } from "./tool.js";

describe("Reaction Yield Mass Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runReactionYieldMass({
        molarMassGMol: 58.44,
        percentYield: 85,
        productMoles: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { actualMassG: expect.closeTo(24.837, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runReactionYieldMass(null).ok).toBe(false));
});
