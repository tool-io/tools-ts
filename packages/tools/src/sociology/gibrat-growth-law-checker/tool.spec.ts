import { describe, expect, it } from "vitest";
import {
  calculateGibratGrowthLaw,
  gibratGrowthLawCheckerExample,
  gibratGrowthLawCheckerTool,
  runGibratGrowthLawChecker,
} from "./tool.js";

describe("gibratGrowthLawCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runGibratGrowthLawChecker(gibratGrowthLawCheckerExample.input),
    ).toEqual({
      ok: true,
      output: gibratGrowthLawCheckerExample.output,
    });
  });

  it("uses an absolute percentage-point gap and includes the tolerance boundary", () => {
    expect(
      calculateGibratGrowthLaw({
        largeGroupGrowthPercent: -2,
        smallGroupGrowthPercent: -1,
        tolerancePercent: 1,
      }),
    ).toEqual({ growthGapPercent: 1, proportionalGrowth: true });
    const result = runGibratGrowthLawChecker({
      largeGroupGrowthPercent: 1,
      smallGroupGrowthPercent: 2,
      tolerancePercent: -1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("tolerancePercent");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(gibratGrowthLawCheckerExample))).toEqual(
      gibratGrowthLawCheckerExample,
    );
    expect(gibratGrowthLawCheckerTool.contractVersion).toBe(1);
    expect(gibratGrowthLawCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runGibratGrowthLawChecker(null).ok).toBe(false);
    expect(
      runGibratGrowthLawChecker({
        ...gibratGrowthLawCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
