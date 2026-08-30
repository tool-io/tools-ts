import { describe, expect, it } from "vitest";
import {
  calculateCaseRefinishingBudget,
  caseRefinishingBudgetExample,
  runCaseRefinishingBudget,
} from "./tool.js";

describe("case refinishing removal-budget calculator", () => {
  it("reproduces the canonical five-pass allocation", () => {
    expect(
      runCaseRefinishingBudget(caseRefinishingBudgetExample.input),
    ).toEqual({
      ok: true,
      output: caseRefinishingBudgetExample.output,
    });
  });

  it("allocates a larger budget across one pass", () => {
    expect(
      calculateCaseRefinishingBudget({
        currentCaseThicknessMillimeters: 8,
        minimumAcceptableThicknessMillimeters: 7.5,
        plannedPolishingPasses: 1,
      }),
    ).toMatchObject({
      maximumPlannedRemovalPerPassMicrometers: 500,
      removalBudgetMillimeters: 0.5,
    });
  });

  it("preserves the warning that the budget is not a removal prediction", () => {
    expect(
      calculateCaseRefinishingBudget({
        currentCaseThicknessMillimeters: 10,
        minimumAcceptableThicknessMillimeters: 9,
        plannedPolishingPasses: 2,
      }).refinishingCaveat,
    ).toContain("not a prediction");
  });

  it("rejects a nonpositive removal budget", () => {
    expect(
      runCaseRefinishingBudget({
        currentCaseThicknessMillimeters: 10,
        minimumAcceptableThicknessMillimeters: 10,
        plannedPolishingPasses: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "nonpositive_removal_budget",
            field: "minimumAcceptableThicknessMillimeters",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects a zero polishing-pass count", () => {
    expect(
      runCaseRefinishingBudget({
        currentCaseThicknessMillimeters: 10,
        minimumAcceptableThicknessMillimeters: 9.5,
        plannedPolishingPasses: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "plannedPolishingPasses" }],
      },
      ok: false,
    });
  });
});
