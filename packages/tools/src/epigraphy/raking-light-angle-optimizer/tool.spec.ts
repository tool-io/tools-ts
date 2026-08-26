import { describe, expect, it } from "vitest";
import {
  rakingLightAngleOptimizerExample,
  runRakingLightAngleOptimizer,
} from "./tool.js";

describe("raking-light-angle-optimizer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRakingLightAngleOptimizer(rakingLightAngleOptimizerExample.input),
    ).toEqual({
      ok: true,
      output: rakingLightAngleOptimizerExample.output,
    });
  });

  it("gives a 45 degree graze for equal height and shadow", () => {
    const r = runRakingLightAngleOptimizer({
      reliefHeightMm: 5,
      targetShadowLengthMm: 5,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.rakeAngleDeg as number).toBe(45);
    expect(r.output.tangentRatio as number).toBe(1);
  });
  it("rejects non-positive heights", () => {
    expect(
      runRakingLightAngleOptimizer({
        reliefHeightMm: -1,
        targetShadowLengthMm: 10,
      }).ok,
    ).toBe(false);
  });
});
