import { describe, expect, it } from "vitest";
import {
  checkAuditWrapUpFile,
  runWrapUpChecklist,
  wrapUpChecklistExample,
} from "./tool.js";

describe("audit wrap-up final review checklist", () => {
  it("reproduces its canonical example", () => {
    expect(runWrapUpChecklist(wrapUpChecklistExample.input)).toEqual({
      ok: true,
      output: wrapUpChecklistExample.output,
    });
  });

  it("accepts a complete wrap-up file", () => {
    expect(
      checkAuditWrapUpFile({
        finalReviewApproved: true,
        financialStatementsFinalized: true,
        managementRepresentationReceived: true,
        subsequentEventsReviewed: true,
        unadjustedMisstatementsApproved: true,
      }).complete,
    ).toBe(true);
  });

  it("lists multiple missing wrap-up items", () => {
    expect(
      checkAuditWrapUpFile({
        finalReviewApproved: false,
        financialStatementsFinalized: false,
        managementRepresentationReceived: true,
        subsequentEventsReviewed: true,
        unadjustedMisstatementsApproved: true,
      }).missingItems,
    ).toEqual(["financial statements finalized", "final review approved"]);
  });

  it("rejects a malformed completion flag", () => {
    expect(
      runWrapUpChecklist({
        finalReviewApproved: 1,
        financialStatementsFinalized: true,
        managementRepresentationReceived: true,
        subsequentEventsReviewed: true,
        unadjustedMisstatementsApproved: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "finalReviewApproved" }],
      },
      ok: false,
    });
  });
});
