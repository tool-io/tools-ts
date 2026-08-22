import { describe, expect, it } from "vitest";
import { runInterestPortion } from "./tool.js";

describe("Interest Portion Calculator", () => {
  it("calculates a valid result", () => {
    expect(runInterestPortion({ annualRatePercent: 6, balance: 1000 })).toEqual(
      {
        ok: true,
        output: { interest: 5 },
      },
    );
  });

  it("supports custom payment frequencies", () => {
    expect(
      runInterestPortion({
        annualRatePercent: 12,
        balance: 2000,
        paymentsPerYear: 4,
      }),
    ).toEqual({
      ok: true,
      output: { interest: 60 },
    });
  });

  it("rejects non-positive payment frequencies through execution", () => {
    expect(
      runInterestPortion({
        annualRatePercent: 6,
        balance: 1000,
        paymentsPerYear: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_payments_per_year" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runInterestPortion(null).ok).toBe(false));
});
