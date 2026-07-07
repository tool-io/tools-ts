import { describe, expect, it } from "vitest";
import { runPercentageDifference } from "./tool.js";
describe("Percentage Difference Calculator", () => {
  it("calculates a valid result", () => {
    const result = runPercentageDifference({ first: 80, second: 100 });
    expect(result.ok && result.output.percentDifference).toBeCloseTo(
      22.2222222222,
    );
  });
  it("rejects invalid input", () =>
    expect(runPercentageDifference(null).ok).toBe(false));
});
