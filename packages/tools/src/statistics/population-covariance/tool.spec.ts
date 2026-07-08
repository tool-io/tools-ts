import { describe, expect, it } from "vitest";
import { runPopulationCovariance } from "./tool.js";
describe("Population Covariance Calculator", () => {
  it("calculates a valid result", () => {
    const result = runPopulationCovariance({
      first: [1, 2, 3],
      second: [2, 4, 6],
    });
    expect(result.ok && result.output.covariance).toBeCloseTo(4 / 3);
  });
  it("rejects invalid input", () =>
    expect(runPopulationCovariance(null).ok).toBe(false));
});
