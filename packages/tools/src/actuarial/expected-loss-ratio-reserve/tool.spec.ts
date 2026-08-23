import { describe, expect, it } from "vitest";
import {
  calculateExpectedLossRatioReserve,
  expectedLossRatioReserveExample,
  runExpectedLossRatioReserve,
} from "./tool.js";

describe("expected loss ratio reserve calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runExpectedLossRatioReserve(expectedLossRatioReserveExample.input),
    ).toEqual({
      ok: true,
      output: expectedLossRatioReserveExample.output,
    });
  });

  it("reserves the gap between expected ultimate and reported losses", () => {
    const reserve = calculateExpectedLossRatioReserve({
      earnedPremium: 5000000,
      expectedLossRatioPercent: 72,
      reportedIncurredLosses: 2600000,
    });
    expect(reserve.unreportedLossEstimate).toBe(1000000);
  });

  it("allows loss ratios above one hundred percent", () => {
    const reserve = calculateExpectedLossRatioReserve({
      earnedPremium: 1000000,
      expectedLossRatioPercent: 110,
      reportedIncurredLosses: 800000,
    });
    expect(reserve.unreportedLossEstimate).toBe(300000);
  });

  it("returns a negative reserve when reported losses exceed the ultimate", () => {
    const reserve = calculateExpectedLossRatioReserve({
      earnedPremium: 1000000,
      expectedLossRatioPercent: 60,
      reportedIncurredLosses: 700000,
    });
    expect(reserve.unreportedLossEstimate).toBe(-100000);
  });

  it("rejects malformed and negative inputs with field-specific issues", () => {
    expect(runExpectedLossRatioReserve(null)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      runExpectedLossRatioReserve({
        earnedPremium: -1,
        expectedLossRatioPercent: 60,
        reportedIncurredLosses: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "earnedPremium" }] },
      ok: false,
    });
  });
});
