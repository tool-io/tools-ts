import { describe, expect, it } from "vitest";
import {
  stratigraphicThicknessTrueVsApparentExample,
  runStratigraphicThicknessTrueVsApparent,
} from "./tool.js";

describe("stratigraphic-thickness-true-vs-apparent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStratigraphicThicknessTrueVsApparent(
        stratigraphicThicknessTrueVsApparentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: stratigraphicThicknessTrueVsApparentExample.output,
    });
  });

  it("makes the vertical thickness exceed the true thickness", () => {
    const result = runStratigraphicThicknessTrueVsApparent({
      outcropWidthMeters: 50,
      trueDipDegrees: 45,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verticalThicknessMeters as number).toBeGreaterThan(
      result.output.trueThicknessMeters as number,
    );
  });
  it("rejects a ninety degree dip", () => {
    expect(
      runStratigraphicThicknessTrueVsApparent({
        outcropWidthMeters: 100,
        trueDipDegrees: 90,
      }).ok,
    ).toBe(false);
  });
});
