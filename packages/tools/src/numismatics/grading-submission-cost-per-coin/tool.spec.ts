import { describe, expect, it } from "vitest";
import {
  calculateGradingSubmissionCostPerCoin,
  example,
  runGradingSubmissionCostPerCoin,
} from "./tool.js";

describe("numismatics/grading-submission-cost-per-coin", () => {
  it("calculates the published example", () => {
    expect(calculateGradingSubmissionCostPerCoin(example.input)).toEqual(
      example.output,
    );
    expect(runGradingSubmissionCostPerCoin(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runGradingSubmissionCostPerCoin({
      ...example.input,
      gradingFees: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runGradingSubmissionCostPerCoin({ ...example.input, coinCount: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "coinCount" }] },
    });
  });
});
