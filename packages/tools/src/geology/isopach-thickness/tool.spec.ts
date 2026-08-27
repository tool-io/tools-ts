import { describe, expect, it } from "vitest";
import { isopachThicknessExample, runIsopachThickness } from "./tool.js";

describe("isopach-thickness", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIsopachThickness(isopachThicknessExample.input)).toEqual({
      ok: true,
      output: isopachThicknessExample.output,
    });
  });

  it("equals the vertical thickness on horizontal beds", () => {
    const result = runIsopachThickness({
      verticalThicknessM: 25,
      bedDipDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.isopachThicknessM as number).toBe(25);
  });

  it("rejects negative thickness and out-of-range dips", () => {
    expect(
      runIsopachThickness({ verticalThicknessM: -1, bedDipDeg: 30 }).ok,
    ).toBe(false);
    expect(
      runIsopachThickness({ verticalThicknessM: 10, bedDipDeg: 120 }).ok,
    ).toBe(false);
  });
});
