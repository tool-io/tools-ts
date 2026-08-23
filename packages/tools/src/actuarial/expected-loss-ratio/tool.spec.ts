import { describe, expect, it } from "vitest";
import {
  calculateExpectedLossRatio,
  expectedLossRatioExample,
  runExpectedLossRatio,
} from "./tool.js";

describe("expected loss ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runExpectedLossRatio(expectedLossRatioExample.input)).toEqual({
      ok: true,
      output: expectedLossRatioExample.output,
    });
  });

  it("allows ratios above one for unprofitable books", () => {
    const result = calculateExpectedLossRatio({
      earnedPremium: 500000,
      expectedLosses: 750000,
    });
    expect(result.expectedLossRatio).toBe(1.5);
  });

  it("rejects zero premium with a stable field-specific code", () => {
    expect(
      runExpectedLossRatio({ earnedPremium: 0, expectedLosses: 100 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "positive_earned_premium_required", field: "earnedPremium" },
        ],
      },
      ok: false,
    });
  });

  it("rejects malformed and negative inputs with field-specific issues", () => {
    expect(runExpectedLossRatio(null)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      runExpectedLossRatio({ earnedPremium: 100, expectedLosses: -50 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "expectedLosses" }] },
      ok: false,
    });
    expect(
      runExpectedLossRatio({ earnedPremium: Number.NaN, expectedLosses: 50 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "earnedPremium" }] },
      ok: false,
    });
  });
});
