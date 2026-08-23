import { describe, expect, it } from "vitest";
import {
  calculateProjectedSalaryAccrualPresentValue,
  projectedSalaryAccrualPresentValueExample,
  runProjectedSalaryAccrualPresentValue,
} from "./tool.js";

describe("projected salary accrual present value calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runProjectedSalaryAccrualPresentValue(
        projectedSalaryAccrualPresentValueExample.input,
      ),
    ).toEqual({
      ok: true,
      output: projectedSalaryAccrualPresentValueExample.output,
    });
  });

  it("discounts a distant accrual more heavily when growth is zero", () => {
    const near = calculateProjectedSalaryAccrualPresentValue({
      accrualRatePercent: 2,
      currentSalary: 100000,
      discountRatePercent: 10,
      salaryGrowthRatePercent: 0,
      yearsToPayment: 1,
    });
    const far = calculateProjectedSalaryAccrualPresentValue({
      accrualRatePercent: 2,
      currentSalary: 100000,
      discountRatePercent: 10,
      salaryGrowthRatePercent: 0,
      yearsToPayment: 5,
    });
    expect(far.presentValue).toBeLessThan(near.presentValue);
  });

  it("rejects negative and incomplete inputs", () => {
    expect(
      runProjectedSalaryAccrualPresentValue({
        accrualRatePercent: -2,
        currentSalary: 100000,
        discountRatePercent: 4,
        yearsToPayment: 10,
      }).ok,
    ).toBe(false);
    expect(
      runProjectedSalaryAccrualPresentValue({ currentSalary: 100000 }).ok,
    ).toBe(false);
  });
});
