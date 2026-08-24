import { describe, expect, it } from "vitest";
import {
  calculateNegativeBiasTemperatureInstabilityShift,
  negativeBiasTemperatureInstabilityShiftExample,
  runNegativeBiasTemperatureInstabilityShift,
} from "./tool.js";

const calibrated = {
  activationEnergyEv: 0.6,
  prefactorMillivolts: 10,
  stressTimeHours: 16,
  temperatureKelvin: 350,
  timeExponent: 0.25,
};

describe("NBTI Shift Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNegativeBiasTemperatureInstabilityShift(
        negativeBiasTemperatureInstabilityShiftExample.input,
      ),
    ).toEqual({
      ok: true,
      output: negativeBiasTemperatureInstabilityShiftExample.output,
    });
  });

  it("returns zero at zero stress time", () => {
    expect(
      calculateNegativeBiasTemperatureInstabilityShift({
        ...calibrated,
        stressTimeHours: 0,
      }),
    ).toEqual({ thresholdShiftMillivolts: 0 });
  });

  it("equals the prefactor at one hour and the 300 K reference", () => {
    expect(
      calculateNegativeBiasTemperatureInstabilityShift({
        ...calibrated,
        stressTimeHours: 1,
        temperatureKelvin: 300,
      }),
    ).toEqual({ thresholdShiftMillivolts: 10.000000000000002 });
  });

  it("requires every positive calibration parameter", () => {
    expect(
      runNegativeBiasTemperatureInstabilityShift({
        stressTimeHours: 16,
        temperatureKelvin: 350,
      }).ok,
    ).toBe(false);
    expect(
      runNegativeBiasTemperatureInstabilityShift({
        ...calibrated,
        timeExponent: 0,
      }).ok,
    ).toBe(false);
  });
});
