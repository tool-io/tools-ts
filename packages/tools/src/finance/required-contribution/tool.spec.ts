import { describe, expect, it } from "vitest";
import {
  requiredContributionExample,
  calculateRequiredContribution,
  runRequiredContribution,
} from "./tool.js";

describe("finance/required-contribution", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRequiredContribution(requiredContributionExample.input)).toEqual({
      ok: true,
      output: requiredContributionExample.output,
    });
  });
  it("rejects invalid input (invalid_rate)", () => {
    expect(runRequiredContribution({ annualRatePercent: -1 }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_amount)", () => {
    expect(runRequiredContribution({ currentSavings: -3 }).ok).toBe(false);
  });
});
