import { describe, expect, it } from "vitest";
import {
  calculateFrequencySeverityExpectedLoss,
  frequencySeverityExpectedLossExample,
  runFrequencySeverityExpectedLoss,
} from "./tool.js";

describe("frequency severity expected loss calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFrequencySeverityExpectedLoss(
        frequencySeverityExpectedLossExample.input,
      ),
    ).toEqual({
      ok: true,
      output: frequencySeverityExpectedLossExample.output,
    });
  });

  it("multiplies fractional frequency and severity exactly", () => {
    expect(
      calculateFrequencySeverityExpectedLoss({
        averageClaimSeverity: 250.5,
        claimFrequency: 7,
      }),
    ).toEqual({ expectedLoss: 1753.5 });
  });

  it("returns zero loss when no claims are expected", () => {
    expect(
      calculateFrequencySeverityExpectedLoss({
        averageClaimSeverity: 3000,
        claimFrequency: 0,
      }),
    ).toEqual({ expectedLoss: 0 });
  });

  it("rejects malformed and negative inputs with field-specific issues", () => {
    expect(runFrequencySeverityExpectedLoss(null)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      runFrequencySeverityExpectedLoss({
        ...frequencySeverityExpectedLossExample.input,
        unexpectedField: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpectedField" }] },
      ok: false,
    });
    expect(
      runFrequencySeverityExpectedLoss({
        averageClaimSeverity: -1,
        claimFrequency: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "averageClaimSeverity" }],
      },
      ok: false,
    });
  });

  it("rejects a non-finite aggregate result with a stable code", () => {
    expect(
      runFrequencySeverityExpectedLoss({
        averageClaimSeverity: Number.MAX_VALUE,
        claimFrequency: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "result_not_finite", field: "averageClaimSeverity" }],
      },
      ok: false,
    });
  });
});
