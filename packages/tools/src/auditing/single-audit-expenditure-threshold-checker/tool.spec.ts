import { describe, expect, it } from "vitest";
import {
  checkSingleAuditExpenditureThreshold,
  runSingleAuditThreshold,
  singleAuditThresholdExample,
} from "./tool.js";

describe("Single Audit expenditure threshold checker", () => {
  it("reproduces its canonical example", () => {
    expect(runSingleAuditThreshold(singleAuditThresholdExample.input)).toEqual({
      ok: true,
      output: singleAuditThresholdExample.output,
    });
  });

  it("treats expenditure equal to the threshold as meeting it", () => {
    expect(
      checkSingleAuditExpenditureThreshold({
        auditThreshold: 1_000_000,
        totalFederalAwardsExpended: 1_000_000,
      }),
    ).toEqual({ amountAboveThreshold: 0, singleAuditThresholdMet: true });
  });

  it("rejects a negative expenditure", () => {
    expect(
      runSingleAuditThreshold({
        auditThreshold: 1_000_000,
        totalFederalAwardsExpended: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "totalFederalAwardsExpended",
          },
        ],
      },
      ok: false,
    });
  });
});
