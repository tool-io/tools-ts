import { describe, expect, it } from "vitest";
import { runRateDeterminingStepChecker } from "./tool.js";

describe("Rate Determining Step Checker", () => {
  it("calculates a valid result", () => {
    const result = runRateDeterminingStepChecker({
      rateConstantStep1: 1,
      rateConstantStep2: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rateDeterminingStep).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runRateDeterminingStepChecker(null).ok).toBe(false));
});
