import { describe, expect, it } from "vitest";
import {
  calculateKickstarterFundingProgress,
  kickstarterFundingExample,
  runKickstarterFunding,
} from "./tool.js";

describe("Kickstarter funding-progress calculator", () => {
  it("reproduces the canonical 75-percent example", () => {
    expect(runKickstarterFunding(kickstarterFundingExample.input)).toEqual({
      ok: true,
      output: kickstarterFundingExample.output,
    });
  });

  it("marks a pledge exactly at the goal as reached", () => {
    expect(
      calculateKickstarterFundingProgress({
        fundingGoal: 1000,
        pledgedAmount: 1000,
      }),
    ).toMatchObject({
      goalReached: true,
      remainingToGoal: 0,
      fundingPercent: 100,
    });
  });

  it("allows overfunding", () => {
    expect(
      calculateKickstarterFundingProgress({
        fundingGoal: 1000,
        pledgedAmount: 1500,
      }).fundingPercent,
    ).toBe(150);
  });

  it("rejects a zero funding goal", () => {
    expect(
      runKickstarterFunding({ fundingGoal: 0, pledgedAmount: 100 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "funding_goal_invalid", field: "fundingGoal" }],
      },
      ok: false,
    });
  });

  it("rejects a negative pledged amount", () => {
    expect(
      runKickstarterFunding({ fundingGoal: 1000, pledgedAmount: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "pledgedAmount" }] },
      ok: false,
    });
  });
});
