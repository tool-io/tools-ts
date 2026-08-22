import { describe, expect, it } from "vitest";
import { runVrefSpeed, vrefSpeedExample } from "./tool.js";

describe("vref speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVrefSpeed(vrefSpeedExample.input)).toEqual({
      ok: true,
      output: vrefSpeedExample.output,
    });
  });

  it("equals 1.3 times stall speed at the published weight", () => {
    expect(
      runVrefSpeed({
        currentWeightLb: 2000,
        publishedWeightLb: 2000,
        stallSpeedRefKt: 50,
      }),
    ).toEqual({ ok: true, output: { vrefKt: 65 } });
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { currentWeightLb: 0, publishedWeightLb: 2000, stallSpeedRefKt: 50 },
      { currentWeightLb: 2400, publishedWeightLb: -1, stallSpeedRefKt: 50 },
      { currentWeightLb: 2400, publishedWeightLb: 2000, stallSpeedRefKt: 0 },
    ])
      expect(runVrefSpeed(bad).ok).toBe(false);
  });
});
