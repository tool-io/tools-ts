import { describe, expect, it } from "vitest";
import { runExcessReagentMolesRemaining } from "./tool.js";

describe("Excess Reagent Moles Remaining Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runExcessReagentMolesRemaining({
        availableMoles: 5,
        excessCoeff: 1,
        limitingCoeff: 2,
        limitingMoles: 3,
      }),
    ).toEqual({ ok: true, output: { remainingMoles: 3.5 } });
  });

  it("rejects invalid input", () =>
    expect(runExcessReagentMolesRemaining(null).ok).toBe(false));
});
