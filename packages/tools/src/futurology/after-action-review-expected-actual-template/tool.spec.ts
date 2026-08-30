import { describe, expect, it } from "vitest";
import {
  afterActionReviewExample,
  buildAfterActionReviewTemplate,
  runAfterActionReview,
} from "./tool.js";

describe("after-action review expected actual template", () => {
  it("reproduces its canonical example", () => {
    expect(runAfterActionReview(afterActionReviewExample.input)).toEqual({
      ok: true,
      output: afterActionReviewExample.output,
    });
  });

  it("matches actions without case sensitivity", () => {
    expect(
      buildAfterActionReviewTemplate({
        actualActions: ["REVIEW"],
        expectedActions: ["review"],
        outcome: "Completed",
      }).matchedActions,
    ).toEqual(["review"]);
  });

  it("handles empty action lists", () => {
    expect(
      buildAfterActionReviewTemplate({
        actualActions: [],
        expectedActions: [],
        outcome: "No action",
      }),
    ).toMatchObject({
      matchedActions: [],
      missingActions: [],
      unexpectedActions: [],
    });
  });

  it("rejects an empty outcome", () => {
    expect(
      runAfterActionReview({
        actualActions: [],
        expectedActions: [],
        outcome: " ",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "outcome_required", field: "outcome" }] },
      ok: false,
    });
  });
});
