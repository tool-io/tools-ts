import { describe, expect, it } from "vitest";
import {
  kinkEffectFloatingBodyExample,
  runKinkEffectFloatingBody,
} from "./tool.js";

const calibrated = {
  bodyCoefficientMillivoltsPerVolt: 30,
  drainVolts: 1.2,
  saturationVolts: 0.7,
};

describe("Floating Body Kink Shift Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKinkEffectFloatingBody(kinkEffectFloatingBodyExample.input),
    ).toEqual({
      ok: true,
      output: kinkEffectFloatingBodyExample.output,
    });
  });

  it("returns zero at and below saturation", () => {
    for (const drainVolts of [0.3, 0.7])
      expect(runKinkEffectFloatingBody({ ...calibrated, drainVolts })).toEqual({
        ok: true,
        output: { kinkShiftMillivolts: 0 },
      });
  });

  it("scales with calibrated excess drain bias", () => {
    expect(
      runKinkEffectFloatingBody({
        bodyCoefficientMillivoltsPerVolt: 45,
        drainVolts: 2,
        saturationVolts: 0.9,
      }),
    ).toEqual({ ok: true, output: { kinkShiftMillivolts: 49.50000000000001 } });
  });

  it("rejects missing calibration and negative voltages", () => {
    for (const input of [
      { drainVolts: 1.2, saturationVolts: 0.7 },
      { ...calibrated, drainVolts: -1 },
      { ...calibrated, saturationVolts: -1 },
    ])
      expect(runKinkEffectFloatingBody(input).ok).toBe(false);
  });
});
