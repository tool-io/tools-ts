import { describe, expect, it } from "vitest";
import {
  calculateAntennaEfficiency,
  runAntennaEfficiency,
  antennaEfficiencyExample,
} from "./tool.js";

describe("Antenna Efficiency %", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAntennaEfficiency(antennaEfficiencyExample.input)).toEqual({
      ok: true,
      output: antennaEfficiencyExample.output,
    });
  });

  it("reaches one hundred percent for a lossless antenna", () => {
    expect(
      runAntennaEfficiency({
        lossResistanceOhms: 0,
        radiationResistanceOhms: 50,
      }),
    ).toEqual({ ok: true, output: { antennaEfficiencyPercent: 100 } });
  });

  it("approaches zero percent when losses dominate", () => {
    const result = calculateAntennaEfficiency({
      lossResistanceOhms: 10000,
      radiationResistanceOhms: 1,
    }).antennaEfficiencyPercent;
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
  });

  it("splits evenly for equal resistances", () => {
    expect(
      calculateAntennaEfficiency({
        lossResistanceOhms: 30,
        radiationResistanceOhms: 30,
      }).antennaEfficiencyPercent,
    ).toBeCloseTo(50, 12);
  });

  it("matches the ratio formula on an arbitrary pair", () => {
    expect(
      calculateAntennaEfficiency({
        lossResistanceOhms: 6,
        radiationResistanceOhms: 14,
      }).antennaEfficiencyPercent,
    ).toBe((14 / 20) * 100);
  });

  it("rejects non-positive radiation resistance", () => {
    expect(
      runAntennaEfficiency({
        lossResistanceOhms: 10,
        radiationResistanceOhms: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative loss resistance", () => {
    expect(
      runAntennaEfficiency({
        lossResistanceOhms: -5,
        radiationResistanceOhms: 50,
      }).ok,
    ).toBe(false);
  });
});
