import { describe, expect, it } from "vitest";
import {
  calculateWithdrawalServiceProbabilities,
  runWithdrawalProbabilityServiceTable,
  withdrawalProbabilityServiceTableExample,
} from "./tool.js";

describe("withdrawal probability service table calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWithdrawalProbabilityServiceTable(
        withdrawalProbabilityServiceTableExample.input,
      ),
    ).toEqual({
      ok: true,
      output: withdrawalProbabilityServiceTableExample.output,
    });
  });

  it("retention and cumulative withdrawal sum to one", () => {
    const result = calculateWithdrawalServiceProbabilities({
      annualWithdrawalProbability: 0.25,
      serviceYears: 4,
    });
    expect(
      result.retentionProbability + result.cumulativeWithdrawalProbability,
    ).toBeCloseTo(1, 12);
  });

  it("rejects invalid probabilities and terms", () => {
    expect(
      runWithdrawalProbabilityServiceTable({
        annualWithdrawalProbability: -0.25,
        serviceYears: 4,
      }).ok,
    ).toBe(false);
    expect(
      runWithdrawalProbabilityServiceTable({
        annualWithdrawalProbability: 0.25,
        serviceYears: 0,
      }).ok,
    ).toBe(false);
  });
});
