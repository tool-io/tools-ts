import { describe, expect, it } from "vitest";
import {
  calculateContributionMargin,
  contributionMarginExample,
  runContributionMargin,
} from "./tool.js";

describe("contribution margin calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runContributionMargin(contributionMarginExample.input)).toEqual({
      ok: true,
      output: contributionMarginExample.output,
    });
  });

  it("reports a negative margin when variable costs exceed revenue", () => {
    const output = calculateContributionMargin({
      revenue: 100,
      variableCosts: 150,
    });
    expect(output).toEqual({
      contributionMargin: -50,
      marginRatioPercent: -50,
    });
  });

  it("rejects zero revenue through execution", () => {
    expect(
      runContributionMargin({ revenue: 0, variableCosts: 10 }),
    ).toMatchObject({
      error: { issues: [{ code: "zero_revenue" }] },
      ok: false,
    });
  });
});
