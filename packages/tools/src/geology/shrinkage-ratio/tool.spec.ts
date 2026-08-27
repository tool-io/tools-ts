import { describe, expect, it } from "vitest";
import { shrinkageRatioExample, runShrinkageRatio } from "./tool.js";

describe("shrinkage-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runShrinkageRatio(shrinkageRatioExample.input)).toEqual({
      ok: true,
      output: shrinkageRatioExample.output,
    });
  });

  it("computes a representative drying pat", () => {
    const result = runShrinkageRatio({
      wetVolumeCm3: 30,
      dryVolumeCm3: 25,
      wetMassG: 50,
      dryMassG: 44,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.shrinkageRatio as number).toBe(1.76);
    expect(result.output.shrinkageLimitPercent as number).toBe(
      2.272727272727273,
    );
  });

  it("rejects a non-positive dry mass", () => {
    expect(
      runShrinkageRatio({
        wetVolumeCm3: 30,
        dryVolumeCm3: 25,
        wetMassG: 50,
        dryMassG: 0,
      }).ok,
    ).toBe(false);
  });
});
