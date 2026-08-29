import { describe, expect, it } from "vitest";
import {
  bonusAccrualExample,
  calculateBonusAccrual,
  runBonusAccrual,
} from "./tool.js";

describe("bonus accrual monthly recognition", () => {
  it("executes its canonical example exactly", () => {
    expect(runBonusAccrual(bonusAccrualExample.input)).toEqual({
      ok: true,
      output: bonusAccrualExample.output,
    });
  });

  it("computes an independently known value", () => {
    // 10% of 120,000 = 12,000 per year; 1,000 per month; 5 months -> 5,000.
    expect(
      calculateBonusAccrual({
        bonusTarget: 120000,
        monthsElapsed: 5,
        targetPercent: 10,
      }),
    ).toEqual({ accruedToDate: 5000, monthlyExpense: 1000 });
  });

  it("caps the accrual at the full-year bonus after 12 months", () => {
    expect(
      calculateBonusAccrual({
        bonusTarget: 120000,
        monthsElapsed: 12,
        targetPercent: 10,
      }),
    ).toEqual({ accruedToDate: 12000, monthlyExpense: 1000 });
    expect(
      calculateBonusAccrual({
        bonusTarget: 120000,
        monthsElapsed: 24,
        targetPercent: 10,
      }),
    ).toEqual({ accruedToDate: 12000, monthlyExpense: 1000 });
  });

  it("accrues nothing before any month has elapsed", () => {
    expect(
      calculateBonusAccrual({
        bonusTarget: 120000,
        monthsElapsed: 0,
        targetPercent: 10,
      }),
    ).toEqual({ accruedToDate: 0, monthlyExpense: 1000 });
  });

  it("scales linearly in the bonus target", () => {
    const base = calculateBonusAccrual({
      bonusTarget: 120000,
      monthsElapsed: 5,
      targetPercent: 10,
    });
    const doubled = calculateBonusAccrual({
      bonusTarget: 240000,
      monthsElapsed: 5,
      targetPercent: 10,
    });
    expect(doubled.accruedToDate).toBeCloseTo(base.accruedToDate * 2, 9);
    expect(doubled.monthlyExpense).toBeCloseTo(base.monthlyExpense * 2, 9);
  });

  it("handles fractional rates without negative zero", () => {
    const result = calculateBonusAccrual({
      bonusTarget: 333333.33,
      monthsElapsed: 3,
      targetPercent: 7.5,
    });
    expect(result.monthlyExpense).toBeCloseTo(2083.3333125, 6);
    expect(result.accruedToDate).toBeCloseTo(6250, 3);
    expect(
      calculateBonusAccrual({
        bonusTarget: 0,
        monthsElapsed: 5,
        targetPercent: 10,
      }).monthlyExpense,
    ).toBe(0);
  });

  it("rejects malformed runtime input", () => {
    expect(
      runBonusAccrual({ bonusTarget: 120000, targetPercent: 10 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "monthsElapsed" }] },
    });
    expect(
      runBonusAccrual({
        bonusTarget: 120000,
        monthsElapsed: 2.5,
        targetPercent: 10,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "monthsElapsed" }] },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateBonusAccrual({
        bonusTarget: 120000,
        monthsElapsed: 5,
        targetPercent: 101,
      }),
    ).toThrow();
    expect(() =>
      calculateBonusAccrual({
        bonusTarget: -120000,
        monthsElapsed: 5,
        targetPercent: 10,
      }),
    ).toThrow();
  });
});
