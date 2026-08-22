import { describe, expect, it } from "vitest";
import {
  bankAngleStandardRateExample,
  calculateBankAngleForStandardRate,
  runBankAngleForStandardRate,
} from "./tool.js";

describe("bank angle for standard rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBankAngleForStandardRate(bankAngleStandardRateExample.input),
    ).toEqual({
      ok: true,
      output: bankAngleStandardRateExample.output,
    });
  });

  it("returns about eighteen degrees of bank at standard rate and 120 knots", () => {
    expect(
      calculateBankAngleForStandardRate({
        standardRateDegPerS: 3,
        trueAirspeedKt: 120,
      }).bankAngleDeg,
    ).toBeCloseTo(18.2426158738, 9);
  });

  it("rejects non-positive turn rates through execution", () => {
    expect(
      runBankAngleForStandardRate({
        standardRateDegPerS: 0,
        trueAirspeedKt: 120,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rate" }] },
      ok: false,
    });
  });
});
