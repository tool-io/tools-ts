import { describe, expect, it } from "vitest";
import {
  irongallCorrosionGradeRaterExample,
  runIrongallCorrosionGradeRater,
} from "./tool.js";

describe("irongall-corrosion-grade-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIrongallCorrosionGradeRater(irongallCorrosionGradeRaterExample.input),
    ).toEqual({
      ok: true,
      output: irongallCorrosionGradeRaterExample.output,
    });
  });

  it("rates a clean leaf as grade none", () => {
    const result = runIrongallCorrosionGradeRater({
      inkLossScore: 0,
      burnThroughScore: 0,
      haloBleedingScore: 0,
      mechanicalWeaknessScore: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.corrosionGrade).toBe(0);
    expect(result.output.gradeLabel).toBe("none");
  });

  it("rejects out-of-range indicator scores", () => {
    expect(
      runIrongallCorrosionGradeRater({
        inkLossScore: 4,
        burnThroughScore: 1,
        haloBleedingScore: 1,
        mechanicalWeaknessScore: 1,
      }).ok,
    ).toBe(false);
  });
});
