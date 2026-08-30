import { describe, expect, it } from "vitest";
import {
  checkSecondPartnerRequirements,
  engagementQualityReviewExample,
  runEngagementQualityReview,
} from "./tool.js";

describe("engagement quality second partner requirements", () => {
  it("reproduces its canonical example", () => {
    expect(
      runEngagementQualityReview(engagementQualityReviewExample.input),
    ).toEqual({
      ok: true,
      output: engagementQualityReviewExample.output,
    });
  });

  it("flags the same person as both reviewers", () => {
    expect(
      checkSecondPartnerRequirements({
        checklistComplete: true,
        firstReviewer: "Alex Chen",
        secondReviewer: "alex chen",
        secondReviewerIndependent: true,
        significantJudgmentsReviewed: true,
        signed: true,
      }).issues,
    ).toEqual(["reviewers_must_differ"]);
  });

  it("flags missing independence and sign-off", () => {
    expect(
      checkSecondPartnerRequirements({
        checklistComplete: true,
        firstReviewer: "Alex Chen",
        secondReviewer: "Jordan Lee",
        secondReviewerIndependent: false,
        significantJudgmentsReviewed: true,
        signed: false,
      }).issueCount,
    ).toBe(2);
  });

  it("rejects a blank reviewer", () => {
    expect(
      runEngagementQualityReview({
        checklistComplete: true,
        firstReviewer: "Alex Chen",
        secondReviewer: " ",
        secondReviewerIndependent: true,
        significantJudgmentsReviewed: true,
        signed: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "reviewer_required", field: "secondReviewer" }],
      },
      ok: false,
    });
  });
});
