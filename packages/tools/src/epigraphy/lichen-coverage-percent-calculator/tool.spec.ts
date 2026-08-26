import { describe, expect, it } from "vitest";
import {
  lichenCoveragePercentCalculatorExample,
  runLichenCoveragePercentCalculator,
} from "./tool.js";

describe("lichen-coverage-percent-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLichenCoveragePercentCalculator(
        lichenCoveragePercentCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: lichenCoveragePercentCalculatorExample.output,
    });
  });

  it("reports full coverage when the whole sample is colonized", () => {
    const result = runLichenCoveragePercentCalculator({
      coveredAreaCm2: 1000,
      totalAreaCm2: 1000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.coveragePercent as number).toBe(100);
    expect(result.output.colonizationFraction as number).toBe(1);
  });

  it("rejects coverage exceeding the sampled area", () => {
    expect(
      runLichenCoveragePercentCalculator({
        coveredAreaCm2: 101,
        totalAreaCm2: 100,
      }).ok,
    ).toBe(false);
  });
});
