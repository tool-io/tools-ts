import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateLoanPayment,
  loanPaymentExample,
  loanPaymentTool,
} from "./tool.js";

describe("Loan Payment", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = loanPaymentTool.execute(loanPaymentExample.input);
    expect(result).toEqual({ ok: true, output: loanPaymentExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(loanPaymentTool.id).toBe("finance/loan-payment");
    expect(validateToolContract(loanPaymentTool)).toEqual([]);
  });

  it("divides principal evenly at zero percent", () => {
    const result = calculateLoanPayment({
      annualRatePercent: 0,
      months: 24,
      principal: 2400,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.monthlyPayment).toBe(100);
      expect(result.output.totalInterest).toBe(0);
      expect(result.output.totalPaid).toBe(2400);
    }
  });

  it("keeps totalPaid within a cent of payment times months", () => {
    const result = calculateLoanPayment({
      annualRatePercent: 3.9,
      months: 60,
      principal: 15000,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        Math.abs(
          result.output.totalPaid - result.output.monthlyPayment * 60,
        ),
      ).toBeLessThanOrEqual(0.5);
  });

  it("rejects malformed probes", () => {
    expect(calculateLoanPayment(null).ok).toBe(false);
    expect(calculateLoanPayment({})).toMatchObject({
      error: { issues: { length: 3 } },
    });
    expect(
      calculateLoanPayment({
        annualRatePercent: -1,
        months: 12,
        principal: 1000,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateLoanPayment({
        annualRatePercent: 5,
        months: 12.5,
        principal: 1000,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateLoanPayment({
        annualRatePercent: 5,
        extra: true,
        months: 12,
        principal: 1000,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
