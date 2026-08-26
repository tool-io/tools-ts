import { describe, expect, it } from "vitest";
import {
  rubbingLegibilityGradeRaterExample,
  runRubbingLegibilityGradeRater,
} from "./tool.js";

describe("rubbing-legibility-grade-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRubbingLegibilityGradeRater(rubbingLegibilityGradeRaterExample.input),
    ).toEqual({
      ok: true,
      output: rubbingLegibilityGradeRaterExample.output,
    });
  });

  it("grades quartile boundaries as excellent and fair", () => {
    const excellent = runRubbingLegibilityGradeRater({ legibilityPercent: 75 });
    if (!excellent.ok) throw new Error("expected success");
    expect(excellent.output.legibilityGrade as string).toBe("excellent");
    const fair = runRubbingLegibilityGradeRater({ legibilityPercent: 49 });
    if (!fair.ok) throw new Error("expected success");
    expect(fair.output.legibilityGrade as string).toBe("fair");
  });

  it("rejects legibility above 100 percent", () => {
    expect(runRubbingLegibilityGradeRater({ legibilityPercent: 101 }).ok).toBe(
      false,
    );
  });
});
