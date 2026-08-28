import { describe, expect, it } from "vitest";
import { runExcessReagentMassRemaining } from "./tool.js";

describe("Excess Reagent Mass Remaining Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runExcessReagentMassRemaining({
        molarMassGMol: 32,
        remainingMoles: 3.5,
      }),
    ).toEqual({ ok: true, output: { remainingMassG: 112 } });
  });

  it("rejects invalid input", () =>
    expect(runExcessReagentMassRemaining(null).ok).toBe(false));
});
