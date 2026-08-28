import { describe, expect, it } from "vitest";
import { runLimitingReagentExcessAmount } from "./tool.js";

describe("Limiting Reagent Excess Amount Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runLimitingReagentExcessAmount({
        excessAvailableMoles: 5,
        excessCoeff: 1,
        limitingCoeff: 2,
        limitingMoles: 3,
      }),
    ).toEqual({ ok: true, output: { excessRemainingMoles: 3.5 } });
  });

  it("rejects invalid input", () =>
    expect(runLimitingReagentExcessAmount(null).ok).toBe(false));
});
