import { describe, expect, it } from "vitest";
import { onlapAngleExample, runOnlapAngle } from "./tool.js";

describe("onlap-angle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOnlapAngle(onlapAngleExample.input)).toEqual({
      ok: true,
      output: onlapAngleExample.output,
    });
  });

  it("is zero when strata parallel the substrate", () => {
    const result = runOnlapAngle({ onlappingDipDeg: 8, substrateDipDeg: 8 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.onlapAngleDeg as number).toBe(0);
  });

  it("rejects out-of-range dips", () => {
    expect(runOnlapAngle({ onlappingDipDeg: -1, substrateDipDeg: 6 }).ok).toBe(
      false,
    );
    expect(runOnlapAngle({ onlappingDipDeg: 6, substrateDipDeg: 95 }).ok).toBe(
      false,
    );
  });
});
