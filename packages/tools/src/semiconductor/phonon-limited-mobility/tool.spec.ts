import { describe, expect, it } from "vitest";
import {
  phononLimitedMobilityExample,
  runPhononLimitedMobility,
} from "./tool.js";

const siliconCalibration = {
  referenceMobilityCm2PerVs: 1400,
  referenceTemperatureK: 300,
  temperatureExponent: -2.42,
};

describe("Phonon Mobility Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhononLimitedMobility(phononLimitedMobilityExample.input),
    ).toEqual({
      ok: true,
      output: phononLimitedMobilityExample.output,
    });
  });

  it("applies the supplied reference and negative exponent", () => {
    expect(
      runPhononLimitedMobility({ ...siliconCalibration, temperatureK: 400 }),
    ).toEqual({ ok: true, output: { mobilityCm2PerVs: 697.8728342456626 } });
  });

  it("decreases as temperature rises for a negative exponent", () => {
    const cold = runPhononLimitedMobility({
      ...siliconCalibration,
      temperatureK: 200,
    });
    const hot = runPhononLimitedMobility({
      ...siliconCalibration,
      temperatureK: 600,
    });
    expect(cold.ok && hot.ok).toBe(true);
    if (cold.ok && hot.ok)
      expect(cold.output.mobilityCm2PerVs).toBeGreaterThan(
        hot.output.mobilityCm2PerVs,
      );
  });

  it("requires positive references and a negative exponent", () => {
    expect(runPhononLimitedMobility({ temperatureK: 300 }).ok).toBe(false);
    expect(
      runPhononLimitedMobility({
        ...siliconCalibration,
        temperatureExponent: 0,
        temperatureK: 300,
      }).ok,
    ).toBe(false);
  });
});
