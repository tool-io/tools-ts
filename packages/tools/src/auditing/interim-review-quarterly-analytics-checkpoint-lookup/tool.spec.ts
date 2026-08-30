import { describe, expect, it } from "vitest";
import {
  checkInterimReviewCheckpoint,
  interimReviewCheckpointExample,
  runInterimReviewCheckpoint,
} from "./tool.js";

describe("interim review analytics checkpoint", () => {
  it("reproduces its canonical example", () => {
    expect(
      runInterimReviewCheckpoint(interimReviewCheckpointExample.input),
    ).toEqual({
      ok: true,
      output: interimReviewCheckpointExample.output,
    });
  });

  it("accepts a complete interim-review checkpoint", () => {
    expect(
      checkInterimReviewCheckpoint({
        controlChangesDocumented: true,
        discrepanciesResolved: true,
        periodEndReconciled: true,
        reviewApproved: true,
        subsequentEventsReviewed: true,
      }).checkpointComplete,
    ).toBe(true);
  });

  it("lists multiple missing checkpoint items", () => {
    expect(
      checkInterimReviewCheckpoint({
        controlChangesDocumented: false,
        discrepanciesResolved: true,
        periodEndReconciled: false,
        reviewApproved: true,
        subsequentEventsReviewed: true,
      }).missingItems,
    ).toEqual(["period end reconciliation", "control change documentation"]);
  });

  it("rejects a malformed checkpoint flag", () => {
    expect(
      runInterimReviewCheckpoint({
        controlChangesDocumented: 1,
        discrepanciesResolved: true,
        periodEndReconciled: true,
        reviewApproved: true,
        subsequentEventsReviewed: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "controlChangesDocumented" }],
      },
      ok: false,
    });
  });
});
