import { describe, expect, it } from "vitest";
import {
  buildPersonalFuturesBackcastWorksheet,
  personalBackcastExample,
  runPersonalBackcast,
} from "./tool.js";

describe("personal futures life planning backcast worksheet", () => {
  it("reproduces its canonical example", () => {
    expect(runPersonalBackcast(personalBackcastExample.input)).toEqual({
      ok: true,
      output: personalBackcastExample.output,
    });
  });

  it("creates milestone years ending at the target", () => {
    expect(
      buildPersonalFuturesBackcastWorksheet({
        currentConstraints: ["Constraint"],
        currentStrengths: ["Strength"],
        desiredOutcome: "Outcome",
        firstMilestoneDate: "2027",
        targetYear: 2030,
      }).milestoneYears,
    ).toEqual([2020, 2025, 2028, 2030]);
  });

  it("includes strengths and constraints in the worksheet", () => {
    expect(
      buildPersonalFuturesBackcastWorksheet({
        currentConstraints: ["Constraint"],
        currentStrengths: ["Strength"],
        desiredOutcome: "Outcome",
        firstMilestoneDate: "2027",
        targetYear: 2030,
      }).worksheet,
    ).toContain("Strengths: Strength");
  });

  it("rejects an empty desired outcome", () => {
    expect(
      runPersonalBackcast({
        currentConstraints: ["Constraint"],
        currentStrengths: ["Strength"],
        desiredOutcome: " ",
        firstMilestoneDate: "2027",
        targetYear: 2030,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "backcast_field_required", field: "desiredOutcome" }],
      },
      ok: false,
    });
  });
});
