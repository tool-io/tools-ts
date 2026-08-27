import { describe, expect, it } from "vitest";
import { foldInterlimbAngleExample, runFoldInterlimbAngle } from "./tool.js";

describe("fold-interlimb-angle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFoldInterlimbAngle(foldInterlimbAngleExample.input)).toEqual({
      ok: true,
      output: foldInterlimbAngleExample.output,
    });
  });

  it("returns zero and isoclinal for vertical limbs", () => {
    const result = runFoldInterlimbAngle({
      leftLimbDipDegrees: 90,
      rightLimbDipDegrees: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.interlimbAngleDegrees).toBe(0);
    expect(result.output.tightness).toBe("isoclinal");
  });
  it("rejects dips beyond 90 degrees", () => {
    expect(
      runFoldInterlimbAngle({ leftLimbDipDegrees: 95, rightLimbDipDegrees: 30 })
        .ok,
    ).toBe(false);
  });
});
