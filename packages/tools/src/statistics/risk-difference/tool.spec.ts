import { describe, expect, it } from "vitest";
import { runRiskDifference } from "./tool.js";
describe("Risk Difference Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runRiskDifference({
        treatmentEvents: 10,
        treatmentTotal: 100,
        controlEvents: 20,
        controlTotal: 100,
      }),
    ).toEqual({ ok: true, output: { riskDifference: -0.1 } });
  });
  it("rejects invalid input", () =>
    expect(runRiskDifference(null).ok).toBe(false));
});
