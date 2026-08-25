import { describe, expect, it } from "vitest";
import {
  calculateDoubleBrokeringRiskFlagChecker,
  doubleBrokeringRiskFlagCheckerExample,
  runDoubleBrokeringRiskFlagChecker,
} from "./tool.js";

describe("double-brokering-risk-flag-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDoubleBrokeringRiskFlagChecker(
        doubleBrokeringRiskFlagCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: doubleBrokeringRiskFlagCheckerExample.output,
    });
  });

  it("stays quiet on normal margins", () => {
    expect(
      runDoubleBrokeringRiskFlagChecker({
        carrierPayUsd: 2400,
        shipperPayUsd: 2600,
      }),
    ).toEqual({
      ok: true,
      output: {
        doubleBrokeringRiskFlag: false,
        payDiscountPercent: 7.6923076923076925,
      },
    });
  });

  it("rejects zero shipper pay", () => {
    expect(
      runDoubleBrokeringRiskFlagChecker({
        carrierPayUsd: 500,
        shipperPayUsd: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite carrier pay", () => {
    expect(() =>
      calculateDoubleBrokeringRiskFlagChecker({
        carrierPayUsd: Number.NaN,
        shipperPayUsd: 100,
      }),
    ).toThrow("must be finite");
  });
});
