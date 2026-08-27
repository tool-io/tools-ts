import { describe, expect, it } from "vitest";
import {
  trueThicknessFromApparentExample,
  runTrueThicknessFromApparent,
} from "./tool.js";

describe("true-thickness-from-apparent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTrueThicknessFromApparent(trueThicknessFromApparentExample.input),
    ).toEqual({
      ok: true,
      output: trueThicknessFromApparentExample.output,
    });
  });

  it("keeps the thickness for a traverse along the dip direction", () => {
    const result = runTrueThicknessFromApparent({
      apparentThicknessM: 9,
      angleFromDipDirectionDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.trueThicknessM as number).toBe(9);
  });

  it("rejects non-positive apparent thicknesses", () => {
    expect(
      runTrueThicknessFromApparent({
        apparentThicknessM: 0,
        angleFromDipDirectionDeg: 20,
      }).ok,
    ).toBe(false);
    expect(
      runTrueThicknessFromApparent({
        apparentThicknessM: -4,
        angleFromDipDirectionDeg: 20,
      }).ok,
    ).toBe(false);
  });
});
