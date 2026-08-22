import { describe, expect, it } from "vitest";
import { calculateVaSpeed, runVaSpeed, vaSpeedExample } from "./tool.js";

describe("maneuvering speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVaSpeed(vaSpeedExample.input)).toEqual({
      ok: true,
      output: vaSpeedExample.output,
    });
  });

  it("returns the published speed at the published weight", () => {
    expect(
      calculateVaSpeed({
        newWeightLb: 2200,
        publishedVaKt: 97,
        publishedWeightLb: 2200,
      }),
    ).toEqual({ vaKt: 97 });
  });

  it("lowers Va when the aircraft is lighter", () => {
    const lighter = calculateVaSpeed({
      newWeightLb: 1800,
      publishedVaKt: 100,
      publishedWeightLb: 2200,
    }).vaKt;
    expect(lighter).toBeLessThan(100);
  });
});
