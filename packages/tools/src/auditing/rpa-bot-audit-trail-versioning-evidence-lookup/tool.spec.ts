import { describe, expect, it } from "vitest";
import {
  assessRpaAuditTrailEvidence,
  rpaAuditTrailExample,
  runRpaAuditTrail,
} from "./tool.js";

describe("RPA audit trail versioning evidence", () => {
  it("reproduces its canonical example", () => {
    expect(runRpaAuditTrail(rpaAuditTrailExample.input)).toEqual({
      ok: true,
      output: rpaAuditTrailExample.output,
    });
  });

  it("accepts complete RPA evidence", () => {
    expect(
      assessRpaAuditTrailEvidence({
        automationName: "Bot",
        changeApprovalId: "CHG-1",
        exceptionHandlingTested: true,
        executionLogsComplete: true,
        lastRunDate: "2026-01-01",
        outputReviewEvidence: true,
        version: "1.0.0",
      }).evidenceReady,
    ).toBe(true);
  });

  it("reports every missing evidence category", () => {
    expect(
      assessRpaAuditTrailEvidence({
        automationName: "Bot",
        changeApprovalId: "CHG-1",
        exceptionHandlingTested: false,
        executionLogsComplete: false,
        lastRunDate: "2026-01-01",
        outputReviewEvidence: false,
        version: "1.0.0",
      }).issueCount,
    ).toBe(3);
  });

  it("rejects a blank automation version", () => {
    expect(
      runRpaAuditTrail({
        automationName: "Bot",
        changeApprovalId: "CHG-1",
        exceptionHandlingTested: true,
        executionLogsComplete: true,
        lastRunDate: "2026-01-01",
        outputReviewEvidence: true,
        version: " ",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "rpa_field_required", field: "version" }] },
      ok: false,
    });
  });
});
