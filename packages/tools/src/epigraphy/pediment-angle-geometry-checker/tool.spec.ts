import { describe, expect, it } from "vitest";
import {
  pedimentAngleGeometryCheckerExample,
  runPedimentAngleGeometryChecker,
} from "./tool.js";

describe("pediment-angle-geometry-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPedimentAngleGeometryChecker(
        pedimentAngleGeometryCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: pedimentAngleGeometryCheckerExample.output,
    });
  });

  it("derives a right apex from equal 45 degree base angles", () => {
    const result = runPedimentAngleGeometryChecker({
      leftBaseAngleDeg: 45,
      rightBaseAngleDeg: 45,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.apexAngleDeg as number).toBe(90);
    expect(result.output.isValidTriangle as boolean).toBe(true);
  });

  it("rejects base angles that sum to 180 degrees or more", () => {
    expect(
      runPedimentAngleGeometryChecker({
        leftBaseAngleDeg: 90,
        rightBaseAngleDeg: 90,
      }).ok,
    ).toBe(false);
  });
});
