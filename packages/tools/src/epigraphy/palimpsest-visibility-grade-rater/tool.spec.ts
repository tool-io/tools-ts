import { describe, expect, it } from "vitest";
import {
  palimpsestVisibilityGradeRaterExample,
  runPalimpsestVisibilityGradeRater,
} from "./tool.js";

describe("palimpsest-visibility-grade-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPalimpsestVisibilityGradeRater(
        palimpsestVisibilityGradeRaterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: palimpsestVisibilityGradeRaterExample.output,
    });
  });

  it("grades quartile boundaries as high and negligible", () => {
    const high = runPalimpsestVisibilityGradeRater({
      underTextVisibilityPercent: 75,
    });
    if (!high.ok) throw new Error("expected success");
    expect(high.output.visibilityGrade as string).toBe("high");
    const negligible = runPalimpsestVisibilityGradeRater({
      underTextVisibilityPercent: 24.9,
    });
    if (!negligible.ok) throw new Error("expected success");
    expect(negligible.output.visibilityGrade as string).toBe("negligible");
  });

  it("rejects visibility above 100 percent", () => {
    expect(
      runPalimpsestVisibilityGradeRater({ underTextVisibilityPercent: 101 }).ok,
    ).toBe(false);
  });
});
