import { describe, expect, it } from "vitest";
import { toplapAngleExample, runToplapAngle } from "./tool.js";

describe("toplap-angle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runToplapAngle(toplapAngleExample.input)).toEqual({
      ok: true,
      output: toplapAngleExample.output,
    });
  });

  it("is zero for concordant tops", () => {
    const result = runToplapAngle({
      strataDipDeg: 2.5,
      upperSurfaceDipDeg: 2.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.toplapAngleDeg as number).toBe(0);
  });

  it("rejects out-of-range dips", () => {
    expect(
      runToplapAngle({ strataDipDeg: -0.1, upperSurfaceDipDeg: 1 }).ok,
    ).toBe(false);
    expect(runToplapAngle({ strataDipDeg: 1, upperSurfaceDipDeg: 92 }).ok).toBe(
      false,
    );
  });
});
