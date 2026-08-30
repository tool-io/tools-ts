import { describe, expect, it } from "vitest";
import {
  payrollTaxTieOutExample,
  runPayrollTaxTieOut,
  tieOutPayrollGrossToTaxReturn,
} from "./tool.js";

describe("payroll gross tax return tie-out", () => {
  it("reproduces its canonical example", () => {
    expect(runPayrollTaxTieOut(payrollTaxTieOutExample.input)).toEqual({
      ok: true,
      output: payrollTaxTieOutExample.output,
    });
  });

  it("accepts an exact tie-out", () => {
    expect(
      tieOutPayrollGrossToTaxReturn({
        payrollGross: 1000,
        taxReturnGross: 1000,
        tolerance: 0,
      }),
    ).toEqual({ difference: 0, reconciled: true });
  });

  it("flags a difference beyond tolerance", () => {
    expect(
      tieOutPayrollGrossToTaxReturn({
        payrollGross: 1001,
        taxReturnGross: 1000,
        tolerance: 0,
      }).reconciled,
    ).toBe(false);
  });

  it("rejects a negative payroll amount", () => {
    expect(
      runPayrollTaxTieOut({
        payrollGross: -1,
        taxReturnGross: 0,
        tolerance: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "payrollGross" }],
      },
      ok: false,
    });
  });
});
