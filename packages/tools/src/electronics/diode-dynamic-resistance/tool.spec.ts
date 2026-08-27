import { describe, expect, it } from "vitest";
import {
  calculateDiodeDynamicResistance,
  diodeDynamicResistanceExample,
  runDiodeDynamicResistance,
} from "./tool.js";

describe("Diode Dynamic Resistance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDiodeDynamicResistance(diodeDynamicResistanceExample.input),
    ).toEqual({
      ok: true,
      output: diodeDynamicResistanceExample.output,
    });
  });

  it("rejects non-positive diode current", () => {
    expect(
      runDiodeDynamicResistance({
        diodeCurrentA: 0,
        thermalVoltageVolts: 0.025852,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current" }] },
      ok: false,
    });
  });

  it("halves dynamic resistance when current doubles", () => {
    const base = calculateDiodeDynamicResistance({
      diodeCurrentA: 0.001,
      thermalVoltageVolts: 0.025852,
    }).dynamicResistanceOhms;
    expect(
      calculateDiodeDynamicResistance({
        diodeCurrentA: 0.002,
        thermalVoltageVolts: 0.025852,
      }).dynamicResistanceOhms,
    ).toBe(base / 2);
  });

  it("applies the ideality factor as a multiplier", () => {
    expect(
      calculateDiodeDynamicResistance({
        diodeCurrentA: 0.001,
        nIdeality: 2,
        thermalVoltageVolts: 0.025852,
      }).dynamicResistanceOhms,
    ).toBe(51.704);
  });
});
