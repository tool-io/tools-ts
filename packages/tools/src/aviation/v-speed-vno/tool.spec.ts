import { describe, expect, it } from "vitest";
import { runVSpeedVno, vSpeedVnoExample } from "./tool.js";

describe("VNO speed calculator", () => {
  it("reproduces its aircraft-specific ratio example", () => {
    expect(runVSpeedVno(vSpeedVnoExample.input)).toEqual({
      ok: true,
      output: vSpeedVnoExample.output,
    });
  });

  it("uses the supplied ratio", () => {
    expect(
      runVSpeedVno({ neverExceedSpeedKt: 180, vnoToVneRatio: 0.75 }),
    ).toEqual({ ok: true, output: { vnoKt: 135 } });
  });

  it("rejects non-positive speed and invalid ratios", () => {
    expect(
      runVSpeedVno({ neverExceedSpeedKt: 0, vnoToVneRatio: 0.74 }).ok,
    ).toBe(false);
    expect(runVSpeedVno({ neverExceedSpeedKt: 200, vnoToVneRatio: 0 }).ok).toBe(
      false,
    );
    expect(
      runVSpeedVno({ neverExceedSpeedKt: 200, vnoToVneRatio: 1.01 }).ok,
    ).toBe(false);
  });
});
