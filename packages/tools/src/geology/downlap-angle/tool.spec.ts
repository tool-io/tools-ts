import { describe, expect, it } from "vitest";
import { downlapAngleExample, runDownlapAngle } from "./tool.js";

describe("downlap-angle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDownlapAngle(downlapAngleExample.input)).toEqual({
      ok: true,
      output: downlapAngleExample.output,
    });
  });

  it("matches the clinoform dip on a flat base", () => {
    const result = runDownlapAngle({
      downlappingDipDeg: 7.2,
      basalSurfaceDipDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.downlapAngleDeg as number).toBe(7.2);
  });

  it("rejects out-of-range dips", () => {
    expect(
      runDownlapAngle({ downlappingDipDeg: -2, basalSurfaceDipDeg: 1 }).ok,
    ).toBe(false);
    expect(
      runDownlapAngle({ downlappingDipDeg: 1, basalSurfaceDipDeg: 100 }).ok,
    ).toBe(false);
  });
});
