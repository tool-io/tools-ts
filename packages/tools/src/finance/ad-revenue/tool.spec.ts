import { describe, expect, it } from "vitest";
import { adRevenueExample, runAdRevenue } from "./tool.js";

describe("advertising revenue target calculator", () => {
  it("reproduces its canonical example", () => {
    expect(runAdRevenue(adRevenueExample.input)).toEqual({
      ok: true,
      output: adRevenueExample.output,
    });
  });

  it("preserves a zero revenue target", () => {
    expect(
      runAdRevenue({
        impressionsPerUser: 4,
        monthlyUsersPerTool: 1_000,
        revenuePerThousandImpressions: 2,
        targetRevenue: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        impressionsNeeded: 0,
        revenuePerUser: 0.008,
        toolsNeeded: 0,
        usersNeeded: 0,
      },
    });
  });

  it("rejects a zero RPM", () => {
    const result = runAdRevenue({
      impressionsPerUser: 4,
      monthlyUsersPerTool: 1_000,
      revenuePerThousandImpressions: 0,
      targetRevenue: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "rate_not_positive",
        field: "revenuePerThousandImpressions",
      });
  });
});
