import { describe, expect, it } from "vitest";
import {
  checkTcwgCommunications,
  runTcwgCommunications,
  tcwgCommunicationsExample,
} from "./tool.js";

describe("TCWG required communications checklist", () => {
  it("reproduces its canonical example", () => {
    expect(runTcwgCommunications(tcwgCommunicationsExample.input)).toEqual({
      ok: true,
      output: tcwgCommunicationsExample.output,
    });
  });

  it("accepts all selected communications", () => {
    expect(
      checkTcwgCommunications({
        communicatedAuditScope: true,
        communicatedSignificantFindings: true,
        communicatedUncorrectedMisstatements: true,
        independenceConfirmed: true,
        significantJudgmentsCommunicated: true,
      }).complete,
    ).toBe(true);
  });

  it("reports multiple missing communications", () => {
    expect(
      checkTcwgCommunications({
        communicatedAuditScope: false,
        communicatedSignificantFindings: true,
        communicatedUncorrectedMisstatements: true,
        independenceConfirmed: false,
        significantJudgmentsCommunicated: true,
      }).missingCommunications,
    ).toEqual(["independence", "audit scope"]);
  });

  it("rejects a malformed communication status", () => {
    expect(
      runTcwgCommunications({
        communicatedAuditScope: 1,
        communicatedSignificantFindings: true,
        communicatedUncorrectedMisstatements: true,
        independenceConfirmed: true,
        significantJudgmentsCommunicated: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "communicatedAuditScope" }],
      },
      ok: false,
    });
  });
});
