import { describe, expect, it } from "vitest";
import {
  calculateDiodeCurrent,
  diodeCurrentExample,
  runDiodeCurrent,
} from "./tool.js";

describe("Shockley Diode Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiodeCurrent(diodeCurrentExample.input)).toEqual({
      ok: true,
      output: diodeCurrentExample.output,
    });
  });

  it("rejects non-positive saturation current", () => {
    expect(
      runDiodeCurrent({
        saturationCurrentA: 0,
        thermalVoltageVolts: 0.025852,
        vForwardVolts: 0.7,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_saturation_current" }] },
      ok: false,
    });
  });

  it("approaches zero current as forward voltage vanishes", () => {
    expect(
      calculateDiodeCurrent({
        saturationCurrentA: 1e-12,
        thermalVoltageVolts: 0.025852,
        vForwardVolts: 0,
      }).diodeCurrentA,
    ).toBe(0);
  });

  it("doubles current for each added ideality-factor thermal voltage step", () => {
    const vt = 0.025852;
    const low = calculateDiodeCurrent({
      saturationCurrentA: 1e-12,
      thermalVoltageVolts: vt,
      vForwardVolts: vt,
    }).diodeCurrentA;
    const high = calculateDiodeCurrent({
      saturationCurrentA: 1e-12,
      thermalVoltageVolts: vt,
      vForwardVolts: vt + vt * Math.LN2,
    }).diodeCurrentA;
    expect(high / low).toBeCloseTo((2 * Math.E - 1) / (Math.E - 1), 12);
  });
});
