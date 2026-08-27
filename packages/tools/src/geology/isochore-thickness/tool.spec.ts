import { describe, expect, it } from "vitest";
import { isochoreThicknessExample, runIsochoreThickness } from "./tool.js";

describe("isochore-thickness", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIsochoreThickness(isochoreThicknessExample.input)).toEqual({
      ok: true,
      output: isochoreThicknessExample.output,
    });
  });

  it("equals the true thickness on horizontal beds", () => {
    const result = runIsochoreThickness({
      isopachThicknessM: 30,
      bedDipDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.isochoreThicknessM as number).toBe(30);
  });

  it("rejects negative thickness and vertical dips", () => {
    expect(
      runIsochoreThickness({ isopachThicknessM: -5, bedDipDeg: 20 }).ok,
    ).toBe(false);
    expect(
      runIsochoreThickness({ isopachThicknessM: 5, bedDipDeg: 90 }).ok,
    ).toBe(false);
  });
});
