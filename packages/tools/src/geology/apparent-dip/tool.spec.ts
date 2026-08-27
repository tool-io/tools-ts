import { describe, expect, it } from "vitest";
import { apparentDipExample, runApparentDip } from "./tool.js";

describe("apparent-dip", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runApparentDip(apparentDipExample.input)).toEqual({
      ok: true,
      output: apparentDipExample.output,
    });
  });

  it("equals the true dip along the dip direction", () => {
    const result = runApparentDip({
      trueDipDeg: 40,
      angleFromDipDirectionDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.apparentDipDeg as number).toBeCloseTo(40, 12);
  });

  it("gives zero apparent dip for a strike-parallel section", () => {
    const result = runApparentDip({
      trueDipDeg: 60,
      angleFromDipDirectionDeg: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.apparentDipDeg as number).toBeCloseTo(0, 9);
  });

  it("rejects non-positive true dips", () => {
    expect(
      runApparentDip({ trueDipDeg: 0, angleFromDipDirectionDeg: 30 }).ok,
    ).toBe(false);
  });
});
