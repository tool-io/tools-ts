import { describe, expect, it } from "vitest";
import {
  calculateNormalRetirementBenefit,
  normalRetirementBenefitExample,
  runNormalRetirementBenefit,
} from "./tool.js";

describe("normal retirement benefit calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNormalRetirementBenefit(normalRetirementBenefitExample.input),
    ).toEqual({
      ok: true,
      output: normalRetirementBenefitExample.output,
    });
  });

  it("scales linearly with service and accrual rate", () => {
    const half = calculateNormalRetirementBenefit({
      annualAccrualRatePercent: 1,
      finalAverageSalary: 60000,
      yearsOfService: 30,
    });
    expect(half.annualBenefit).toBe(18000);
    expect(
      calculateNormalRetirementBenefit({
        annualAccrualRatePercent: 2,
        finalAverageSalary: 60000,
        yearsOfService: 0,
      }).annualBenefit,
    ).toBe(0);
  });

  it("rejects invalid inputs", () => {
    expect(runNormalRetirementBenefit({ finalAverageSalary: -100 }).ok).toBe(
      false,
    );
    expect(
      runNormalRetirementBenefit({
        finalAverageSalary: 60000,
        yearsOfService: -3,
      }).ok,
    ).toBe(false);
  });
});
