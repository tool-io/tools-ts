import { describe, expect, it } from "vitest";
import { shrinkageLimitExample, runShrinkageLimit } from "./tool.js";

describe("shrinkage-limit", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runShrinkageLimit(shrinkageLimitExample.input)).toEqual({
      ok: true,
      output: shrinkageLimitExample.output,
    });
  });

  it("equals the initial water content when no volume change occurs", () => {
    const result = runShrinkageLimit({
      initialWaterContentPercent: 20,
      wetVolumeCm3: 15,
      dryVolumeCm3: 15,
      dryMassG: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.shrinkageLimitPercent as number).toBe(20);
  });

  it("rejects a dry volume exceeding the wet volume", () => {
    expect(
      runShrinkageLimit({
        initialWaterContentPercent: 30,
        wetVolumeCm3: 10,
        dryVolumeCm3: 12,
        dryMassG: 40,
      }).ok,
    ).toBe(false);
  });
});
