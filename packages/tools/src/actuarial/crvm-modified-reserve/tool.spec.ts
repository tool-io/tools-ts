import { describe, expect, it } from "vitest";
import {
  calculateCrvmModifiedReserve,
  crvmModifiedReserveExample,
  runCrvmModifiedReserve,
} from "./tool.js";

describe("CRVM Modified Reserve Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(runCrvmModifiedReserve(crvmModifiedReserveExample.input)).toEqual({
      ok: true,
      output: crvmModifiedReserveExample.output,
    });
  });

  it("uses the full preliminary term increase when it is below the cap", () => {
    expect(
      calculateCrvmModifiedReserve({
        benefitPresentValue: 120,
        firstYearTermPremium: 1,
        fullPreliminaryTermRenewalPremium: 8,
        futurePremiumAnnuityFactor: 10,
        nineteenPaymentLifePremiumNextAge: 20,
        netLevelPremium: 6,
      }),
    ).toEqual({
      commissionersExpenseAllowance: 2,
      modifiedValuationPremium: 8,
      valuationReserve: 40,
    });
  });

  it("limits the premium increase under the Commissioners method", () => {
    expect(
      calculateCrvmModifiedReserve({
        benefitPresentValue: 400,
        firstYearTermPremium: 2,
        fullPreliminaryTermRenewalPremium: 35,
        futurePremiumAnnuityFactor: 12,
        nineteenPaymentLifePremiumNextAge: 12,
        netLevelPremium: 20,
      }),
    ).toEqual({
      commissionersExpenseAllowance: 10,
      modifiedValuationPremium: 30,
      valuationReserve: 40,
    });
  });

  it("permits a negative prospective reserve", () => {
    const result = runCrvmModifiedReserve({
      ...crvmModifiedReserveExample.input,
      benefitPresentValue: 100,
    });
    expect(result).toEqual({
      ok: true,
      output: {
        commissionersExpenseAllowance: 10,
        modifiedValuationPremium: 30,
        valuationReserve: -260,
      },
    });
  });

  it("rejects negative actuarial inputs and malformed objects", () => {
    expect(
      runCrvmModifiedReserve({
        ...crvmModifiedReserveExample.input,
        benefitPresentValue: -1,
      }).ok,
    ).toBe(false);
    expect(runCrvmModifiedReserve(null).ok).toBe(false);
    expect(() =>
      calculateCrvmModifiedReserve({
        ...crvmModifiedReserveExample.input,
        firstYearTermPremium: Number.POSITIVE_INFINITY,
      }),
    ).toThrow();
  });
});
