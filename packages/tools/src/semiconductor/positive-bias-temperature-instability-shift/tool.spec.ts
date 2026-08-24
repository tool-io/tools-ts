import { describe, expect, it } from "vitest";
import {
  calculatePositiveBiasTemperatureInstabilityShift,
  positiveBiasTemperatureInstabilityShiftExample,
  runPositiveBiasTemperatureInstabilityShift,
} from "./tool.js";

const calibrated = {
  activationEnergyEv: 0.6,
  prefactorMillivolts: 10,
  stressTimeHours: 16,
  temperatureKelvin: 350,
  timeExponent: 0.25,
};

describe("PBTI Shift Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPositiveBiasTemperatureInstabilityShift(
        positiveBiasTemperatureInstabilityShiftExample.input,
      ),
    ).toEqual({
      ok: true,
      output: positiveBiasTemperatureInstabilityShiftExample.output,
    });
  });

  it("returns zero at zero stress time", () => {
    expect(
      calculatePositiveBiasTemperatureInstabilityShift({
        ...calibrated,
        stressTimeHours: 0,
      }),
    ).toEqual({ thresholdShiftMillivolts: 0 });
  });

  it("equals the prefactor at one hour and the 300 K reference", () => {
    expect(
      calculatePositiveBiasTemperatureInstabilityShift({
        ...calibrated,
        stressTimeHours: 1,
        temperatureKelvin: 300,
      }),
    ).toEqual({ thresholdShiftMillivolts: 10.000000000000002 });
  });

  it("uses the supplied time exponent", () => {
    expect(
      calculatePositiveBiasTemperatureInstabilityShift({
        ...calibrated,
        activationEnergyEv: 0.1,
        prefactorMillivolts: 2,
        stressTimeHours: 16,
        temperatureKelvin: 300,
        timeExponent: 0.5,
      }),
    ).toEqual({ thresholdShiftMillivolts: 7.999999999999998 });
  });

  it("requires every device-specific calibration parameter", () => {
    expect(
      runPositiveBiasTemperatureInstabilityShift({
        stressTimeHours: 16,
        temperatureKelvin: 350,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive calibration values", () => {
    for (const field of [
      "activationEnergyEv",
      "prefactorMillivolts",
      "timeExponent",
    ] as const)
      expect(
        runPositiveBiasTemperatureInstabilityShift({
          ...calibrated,
          [field]: 0,
        }).ok,
      ).toBe(false);
  });

  it("rejects negative stress time and out-of-range temperature", () => {
    expect(
      runPositiveBiasTemperatureInstabilityShift({
        ...calibrated,
        stressTimeHours: -1,
      }).ok,
    ).toBe(false);
    expect(
      runPositiveBiasTemperatureInstabilityShift({
        ...calibrated,
        temperatureKelvin: 500,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runPositiveBiasTemperatureInstabilityShift({
        ...calibrated,
        extra: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
