import { describe, expect, it } from "vitest";
import { calculateVrSpeed, runVrSpeed, vrSpeedExample } from "./tool.js";

describe("vr speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVrSpeed(vrSpeedExample.input)).toEqual({
      ok: true,
      output: vrSpeedExample.output,
    });
  });

  it("returns the published speed at the published weight", () => {
    expect(
      calculateVrSpeed({
        newWeightLb: 2000,
        publishedVrKt: 55,
        publishedWeightLb: 2000,
      }),
    ).toEqual({ vrKt: 55 });
  });

  it("rejects non-positive weights through execution", () => {
    for (const bad of [
      { newWeightLb: 0, publishedVrKt: 55, publishedWeightLb: 2000 },
      { newWeightLb: 2400, publishedVrKt: 55, publishedWeightLb: -1 },
    ])
      expect(runVrSpeed(bad).ok).toBe(false);
  });
});
