import { describe, expect, it } from "vitest";
import { runVaporPressureSolution } from "./tool.js";

describe("Vapor Pressure of Solution Calculator", () => {
  it("calculates a valid result", () => {
    const result = runVaporPressureSolution({
      pureSolventPressure: 100,
      solventMoleFraction: 0.9,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.solutionPressure).toBeCloseTo(90, 6);
  });

  it("rejects invalid input", () =>
    expect(runVaporPressureSolution(null).ok).toBe(false));
});
